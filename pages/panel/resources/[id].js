import { React, useState } from 'react';
import { basicAuthRequest } from '../../../src/lib/requests';
import { getGroupsAndIds } from '../../../src/services/helpers';
import parseXml from '../../../src/lib/parseXml';
import Multiselect from "multiselect-react-dropdown";
import axios from 'axios';

export default function item(data) {
    const [files, setFiles] = useState(data.fileIds);
    const [filesName, setFilesName] = useState(data.filesName);
    const [controlledFiles, setControlledFiles] = useState(data.fileIds);

    const submitHandler = async (e) => {
        e.preventDefault();

        if (controlledFiles.length > 0) {
            try {
                const response = await axios.post(`/api/resources/${data.id}`, { controlledFiles });
                alert(response.data.alert)
            } catch (e) {
                alert(e)
            }
        } else {
            alert("Please, select at least one DAC-admin & file")
        }
    };

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
        <div class="container">
            <div class="content-wrapper">
                <div class="row justify-content-center text-center">
                    <h2> Manage resources - {data.id} </h2>
                    <div class="col-5 m-1">
                        <div class="card">
                            <div class="card-header">
                                Resources
                            </div>
                            <div class="card-body">
                                <p class="card-text"> Select resources for this DAC </p>
                                <Multiselect
                                    isObject={false}
                                    onSelect={controlledFilesHandler}
                                    onRemove={controlledFilesHandler}
                                    options={filesName}
                                    selectedValues={filesName}
                                    showCheckbox
                                    style={dropdownStyle}
                                />
                            </div>
                        </div>
                    </div>
                </div> 
                <div class="row justify-content-center text-center mt-2">
                    <div class="col-5">
                        <button type="button" class="btn btn-success w-100" onClick={(e) => submitHandler(e)}> Send </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export async function getServerSideProps(context) {
    const { id } = context.query;
    const dacGroupsAndIds = await getGroupsAndIds('dacs');
    const group = dacGroupsAndIds.filter(el => el.id === id)
                                 .map(el2 => el2.group)

    let filesRequest = {
        method: 'PROPFIND',
        endpoint: `/remote.php/dav/files/${process.env.NEXTCLOUD_DAC_MANAGER_USER}/${group[0]}`,
        data: `<?xml version="1.0" encoding="UTF-8"?>
                <d:propfind xmlns:d="DAV:">
                    <d:prop xmlns:oc="http://owncloud.org/ns">
                        <oc:fileid />
                        <oc:id />
                    </d:prop>
                </d:propfind>`
    }

    // GETTING INITIAL DATA FROM KEYCLOAK AND NEXTCLOUD
    const xmlFiles = await basicAuthRequest(filesRequest)

    // PARSING DATA: FILES (RESOURCES)
    let { fileIds, filePath } = await parseXml(xmlFiles.data)
    fileIds = [].concat.apply([], fileIds.map(el => el[0]["oc:fileid"]))
    let filesName = [].concat.apply([], filePath.map(el => el[0].split("/").pop()))

    return {
        props: {
            fileIds,
            filesName,
            id
        },
    }
}
