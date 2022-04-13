import { React, useState } from 'react';
import { basicAuthRequest, basicAuthRequestWithHeaders } from '../../../src/lib/requests';
import { getUsersMask, applyUsersMask } from '../../../src/lib/filter';
import parseXml from '../../../src/lib/parseXml';
import { getUsers } from '../../../src/getUsers';
import axios from 'axios';
import Multiselect from "multiselect-react-dropdown";

export default function item(data) {
    const [users, setUsers] = useState(data.submitterAndGroup);
    const [files, setFiles] = useState(data.fileIds);
    const [filesName, setFilesName] = useState(data.filesName);
    const [admin, setAdmin] = useState([]);
    const [controlledFiles, setControlledFiles] = useState([]);

    const submitHandler = async (e) => {
        e.preventDefault();

        if(admin.length > 0 && controlledFiles.length > 0) {
            try {
                await axios.post(`/api/create/${data.id}`, { admin, controlledFiles });
                alert("DAC created")
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
          width: 350,
          height: 350
        },
        option: { verticalAlign: "middle" }
      };

    return (
        <>
        <h2> Create DAC: {data.id} </h2>
        <div class="main">
            <div class="panel">
                <div class="panel-box" style={{ width: "375px" }}>
                    <p> Select DAC-admin/s </p>
                    <Multiselect
                        isObject={false}
                        onSelect={adminHandler}
                        options={users}
                        showCheckbox
                        style={dropdownStyle} 
                    />
                </div>
                <div class="panel-box" style={{ width: "375px" }}>
                    <p> Select resource/s </p>
                    <Multiselect
                        isObject={false}
                        onSelect={controlledFilesHandler}
                        options={filesName}
                        showCheckbox
                        style={dropdownStyle}
                    />
                </div>
            </div>
        </div>
        <button onClick={(e) => submitHandler(e)}> Send </button>
        </>
    )
}

export async function getServerSideProps(context) {
    const { id } = context.query;

    let filesRequest = {
        method: 'PROPFIND',
        endpoint: `/remote.php/dav/files/admin/${id}`,
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
        if (el.username === it.id) {
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