import { React, useState } from 'react';
import { basicAuthRequest, basicAuthRequestWithHeaders } from '../../../src/lib/requests';
import { getUsersMask, applyUsersMask } from '../../../src/lib/filter';
import parseXml from '../../../src/lib/parseXml';
import { getUsers } from '../../../src/getUsers';
import axios from 'axios';
import Multiselect from "multiselect-react-dropdown";

export default function item(data) {
    const [users, setUsers] = useState(data.submitterAndGroup);
    const [resources, setResources] = useState(data.urn);
    const [admin, setAdmin] = useState([]);
    const [controlledResources, setControlledResources] = useState([]);

    const submitHandler = async (e) => {
        e.preventDefault();

        if(admin.length > 0 && controlledResources.length > 0) {
            try {
                await axios.post(`/api/create/${data.id}`, { admin, controlledResources });
                alert("DAC created")
            } catch (e) {
                alert(e)
            }
        } else {
            alert("Please, select at least one DAC-admin & resource")
        }
    };

    const adminHandler = (e) => {
        setAdmin(e);
    }

    const controlledResourcesHandler = (e) => {
        setControlledResources(e);
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
                        onSelect={controlledResourcesHandler}
                        options={resources}
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
    let files = await parseXml(xmlFiles.data)
    let urn = [].concat.apply([], files.map(el => process.env.NEXTCLOUD_DOMAIN + ":" + el[0]["oc:fileid"]))

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
            urn,
            submitterAndGroup,
            id
        },
    }
}