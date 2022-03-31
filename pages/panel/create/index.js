import React from 'react';
import Link from 'next/link';

export default function create(data) {
    return (
      <div>
        <h4>
           Please select a submission group/folder:
        </h4>
        <ul>
            {data.groups.map((el,index) => 
                ( 
                    <li key={index}>
                        <Link key={index} href="/panel/create/[id]" as={`/panel/create/${el}`}> 
                            <a> {el} </a> 
                        </Link>
                    </li> 
                ) 
            )}
        </ul>
      </div>
    )
}

export async function getServerSideProps() {
    let groups = ["IPC", "CURIE", "R2"]

    return {
      props: {
        groups
      },
    }
  }