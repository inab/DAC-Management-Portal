import { React, useState } from 'react';
import { basicAuthRequest, basicAuthRequestWithHeaders } from '../../../src/lib/requests';
import { getUsersMask, applyUsersMask } from '../../../src/lib/filter';
import { parseXml } from '../../../src/lib/parseXml';
import { getUsers } from '../../../src/getUsers';
import axios from 'axios';
import Multiselect from "multiselect-react-dropdown";

export default function Item(data) {
    const [users, setUsers] = useState(data.submitterAndGroup);
    const [files, setFiles] = useState(data.fileIds);
    const [filesName, setFilesName] = useState(data.filesName);
    const [admin, setAdmin] = useState([]);
    const [controlledFiles, setControlledFiles] = useState([]);

    const submitHandler = async (e) => {
        e.preventDefault();

        if (admin.length > 0 && controlledFiles.length > 0) {
            try {
                const response = await axios.post(`/api/create/${data.id}`, { admin, controlledFiles });
                alert(response.data.alert)
            } catch (e) {
                alert(e)
            }
        } else {
            alert("Please, select at least one DAC-admin & file")
        }
    };

    const adminHandler = (e) => {
        setAdmin(e);
    }

    const controlledFilesHandler = (e) => {
        const indexes = e.map(item => filesName.indexOf(item));
        const ids = files.filter((item, idx) => indexes.includes(idx));
        setControlledFiles(ids);
    }

    const dropdownStyle = {
        searchBox: {
            margin: 0,
            border: "none",
            height: 150
        },
        option: { verticalAlign: "middle" }
    };

    return (
        <div className="container">
            <div className="content-wrapper">
                <div className="row justify-content-center text-center">
                    <h2> Create DAC - {data.id} </h2>
                    <div className="col-5 m-1">
                        <div className="card">
                            <div className="card-header">
                                Roles
                            </div>
                            <div className="card-body">
                                <p className="card-text"> Select administrators for this DAC </p>
                                <Multiselect
                                    isObject={false}
                                    onSelect={adminHandler}
                                    onRemove={adminHandler}
                                    options={users}
                                    showCheckbox
                                    style={dropdownStyle}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-5 m-1">
                        <div className="card">
                            <div className="card-header">
                                Resources
                            </div>
                            <div className="card-body">
                                <p className="card-text"> Select resources for this DAC </p>
                                <Multiselect
                                    isObject={false}
                                    onSelect={controlledFilesHandler}
                                    onRemove={controlledFilesHandler}
                                    options={filesName}
                                    showCheckbox
                                    style={dropdownStyle}
                                />
                            </div>

                        </div>
                    </div>
                </div> 
                <div className="row justify-content-center text-center mt-2">
                    <div className="col-6">
                        <button type="button" className="btn btn-success w-100" onClick={(e) => submitHandler(e)}> Send </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export async function getServerSideProps(context) {
    const { id } = context.query;

    let filesRequest = {
        method: 'PROPFIND',
        endpoint: `/remote.php/dav/files/${process.env.NEXTCLOUD_DAC_MANAGER_USER}/${id}`,
        data: `<?xml version="1.0" encoding="UTF-8"?>
                <d:propfind xmlns:d="DAV:">
                    <d:prop xmlns:oc="http://owncloud.org/ns">
                        <oc:fileid />
                        <oc:id />
                    </d:prop>
                </d:propfind>`
    }

    let usersRequest = {
        method: 'get',
        endpoint: '/ocs/v1.php/cloud/users',
        headers: {
            "OCS-APIRequest": true
        }
    }

    // GETTING INITIAL DATA FROM KEYCLOAK AND NEXTCLOUD
    const keycloakUsers = await getUsers();
    let nextcloudUsers = await basicAuthRequestWithHeaders(usersRequest)
    const xmlFiles = await basicAuthRequest(filesRequest)

    // PARSING DATA: FILES (RESOURCES) AND USERS 
    let { fileIds, filePath } = await parseXml(xmlFiles.data)
    // let urn = [].concat.apply([], fileIds.map(el => process.env.NEXTCLOUD_DOMAIN + ":" + el[0]["oc:fileid"]))
    fileIds = [].concat.apply([], fileIds.map(el => el[0]["oc:fileid"]))
    let filesName = [].concat.apply([], filePath.map(el => el[0].split("/").pop()))

    nextcloudUsers = nextcloudUsers.data.ocs.data.users

    // ADDITIONAL QUERIES TO THE NEXTCLOUD OCS ENDPOINT: USER GROUPS
    let users = await Promise.all(
        nextcloudUsers.map(async (item, index) => {
            usersRequest.endpoint = "/ocs/v1.php/cloud/users/" + item
            return await basicAuthRequestWithHeaders(usersRequest)
        })
    );

    // DESTRUCTURING COMPLEX RESPONSE OBJECT
    let userIdAndGroups = users.map(el => {
        let { id, groups } = el.data.ocs.data;
        return { "id": id, "groups": groups }
    });

    // APPLYING BINARY MASK FOR FILTERING USERS
    const usersMask = getUsersMask(keycloakUsers, userIdAndGroups)
    const submitters = applyUsersMask(keycloakUsers, usersMask)

    // COMBINE GROUPS (DATA SUBMISSION GROUP) + USERS AND DESTRUCTURING FOR RENDERING
    let submitterAndGroup = [];

    submitters.map(el => userIdAndGroups.forEach(it => {
        if (el.username === it.id && it.groups.includes(id)) {
            let selector = it.id;
            submitterAndGroup.push(selector)
        }
    }))

    return {
        props: {
            fileIds,
            filesName,
            submitterAndGroup,
            id
        },
    }
}
