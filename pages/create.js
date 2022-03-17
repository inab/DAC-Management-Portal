import React from 'react';
import { basicAuthRequest, basicAuthRequestWithHeaders } from '../src/lib/requests';
import { getUsersMask, applyUsersMask } from '../src/lib/filter';
import parseXml from '../src/lib/parseXml';
import getUsers from '../src/getUsers';
import { useSession, getSession } from "next-auth/react";
//import jwt_decode from "jwt-decode";

export default function create(data) {
    const { data: session } = useSession()
    console.log(session)
    /* decode access token */
    /* if(!roles...) -> DENY ACCESS */
    return (
      <div>
        <h4>
           Datasets (iPC group folder)
        </h4>
        <ul>
            {data.files.map(el => ( <li> {el} </li> ))}
        </ul>
        
        <h4>
           Username and ID
        </h4>
        <ul>
            {data.submitters.map(el => ( <li> {el.username} || {el.id}  </li> ))}
        </ul>
        
        <h4>
           Data submitter
        </h4>
        <ul>
            {data.submitterAndGroup.map(el => ( <li> {el.id} || {el.groups}  </li> ))}
        </ul>
      </div>
    )
}

export async function getServerSideProps(context) {
    // GROUP: IPC -> THIS MUST BE DONE FOR ALL THE SUBMISSION GROUPS
    let filesRequest = {
        method: 'PROPFIND',
        endpoint: '/remote.php/dav/files/admin/IPC',
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
            "OCS-APIRequest" : true
        }
    }

    // GETTING INITIAL DATA FROM KEYCLOAK AND NEXTCLOUD
    const keycloakUsers = await getUsers();
    let nextcloudUsers = await basicAuthRequestWithHeaders(usersRequest)
    const xmlFiles = await basicAuthRequest(filesRequest)
    
    // PARSING DATA: FILES (RESOURCES) AND USERS 
    const files = await parseXml(xmlFiles.data)
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
        if(el.username === it.id) {
            let object = { ...it, ...el }
            submitterAndGroup.push(object)
        }
    }))

    return {
      props: {
        files, 
        submitters,
        submitterAndGroup,
        session: await getSession(context)
      },
    }
  }