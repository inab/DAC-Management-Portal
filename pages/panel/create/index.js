import React from 'react';
import Link from 'next/link';
import { basicAuthRequest } from '../../../src/lib/requests';
import { parseGroupFoldersXml } from '../../../src/lib/parseXml';

export default function create(data) {
  return (
    <div className="container">
      <div className="content-wrapper">
        <div className="row justify-content-center text-center">
          <h4>
            Please select a submission group/folder
          </h4>
          <div className="col-6">
            <ul className="list-group list-group-hover list-group-striped">
              {data.groups.map((el, index) =>
              (
                <li key={index} className="list-group-item">
                  <Link key={index} href="/panel/create/[id]" as={`/panel/create/${el}`}>
                    <a> {el} </a>
                  </Link>
                </li>
              )
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export async function getServerSideProps() {

  let filesRequest = {
    method: 'PROPFIND',
    endpoint: `/remote.php/dav/files/${process.env.NEXTCLOUD_DAC_MANAGER_USER}`,
    data: `<?xml version="1.0" encoding="UTF-8"?>
    <d:propfind xmlns:d="DAV:">
      <d:prop xmlns:oc="http://owncloud.org/ns">
        <d:getlastmodified/>
        <d:getcontentlength/>
        <d:getcontenttype/>
        <oc:permissions/>
        <d:resourcetype/>
        <d:getetag/>
      </d:prop>
    </d:propfind>`
  }

  const xmlFiles = await basicAuthRequest(filesRequest);

  const parsedXml = await parseGroupFoldersXml(xmlFiles.data);

  const groups = parsedXml.folders.map(el => el.split("/").slice(-2).reverse().pop()).slice(1)

  return {
    props: {
      groups
    },
  }
}
