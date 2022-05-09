import React from 'react';
import Link from 'next/link';
import { getGroupsAndIds } from '../../../src/services/helpers';

export default function review(data) {
  return (
    <div class="container">
      <div class="content-wrapper">
        <div class="row justify-content-center text-center">
          <h4>
            Please select a DAC
          </h4>
          <div class="col-6">
            <ul class="list-group list-group-hover list-group-striped">
              {data.dacGroupsAndIds.map((el, index) =>
              (
                <li key={index} class="list-group-item">
                  <Link key={index} href="/panel/resources/[id]" as={`/panel/resources/${el.id}`}>
                    <a> {el.group} : {el.id} </a>
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
  return {
    props: {
      dacGroupsAndIds
    },
  }
}