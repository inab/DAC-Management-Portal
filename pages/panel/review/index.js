import React from 'react';
import Link from 'next/link';
import { getIds } from '../../../src/services/helpers';

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
              {data.dacIds.map((el, index) =>
              (
                <li key={index} class="list-group-item">
                  <Link key={index} href="/panel/review/[id]" as={`/panel/review/${el}`}>
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
  const dacIds = await getIds('dacs');
  return {
    props: {
      dacIds
    },
  }
}