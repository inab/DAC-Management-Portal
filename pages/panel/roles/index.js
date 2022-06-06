import React from 'react';
import Link from 'next/link';
import { getGroupsAndIds } from '../../../src/services/helpers';

export default function review(data) {
  return (
    <div className="container">
      <div className="content-wrapper">
        <div className="row justify-content-center text-center">
          <h4>
            Please select a DAC
          </h4>
          <div className="col-6">
            <ul className="list-group list-group-hover list-group-striped">
              {data.dacGroupsAndIds.map((el, index) =>
              (
                <li key={index} className="list-group-item">
                  <Link key={index} href="/panel/roles/[id]" as={`/panel/roles/${el.id}`}>
                    <a> {el.group} - {el.id}  </a>
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
  const dacGroupsAndIds = await getGroupsAndIds('dacs');
  console.log(dacGroupsAndIds)
  return {
    props: {
      dacGroupsAndIds
    },
  }
}