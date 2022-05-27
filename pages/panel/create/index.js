import React from 'react';
import Link from 'next/link';

export default function create(data) {
  return (
    <div class="container">
      <div class="content-wrapper">
        <div class="row justify-content-center text-center">
          <h4>
            Please select a submission group/folder
          </h4>
          <div class="col-6">
            <ul class="list-group list-group-hover list-group-striped">
              {data.groups.map((el, index) =>
              (
                <li key={index} class="list-group-item">
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
  let groups = ["IGTP", "R2", "CURIE", "DREAM", "DEMONSTRATOR"]

  return {
    props: {
      groups
    },
  }
}
