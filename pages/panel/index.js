import Head from 'next/head';
import { useRouter } from "next/router";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as icons from '@fortawesome/free-solid-svg-icons';
import Menu from '../../src/menu';

export default function Panel() {
    const router = useRouter();

    return <>
        <Head>
            <title>DAC Management</title>
            <meta name="description" content="iPC DAC-Mgt Portal" />
            <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className="main">
            <div className="row h-100">
                <div className="col-4 h-75 my-auto">
                    <h2 className="card-title"> Main panel </h2>
                    <h4 className="card-text mb-2 text-muted"> Administrate the iPC Data Access Committees </h4>
                </div>
                <div className="col-8 h-50 my-auto">
                    <div className="row h-75">
                        {Menu.map((element, idx) => (
                            <>
                                <div className="col-6 p-2" onClick={() => router.push(element.href)}>
                                    <div className={"card w-100 h-100 " + element.color}>
                                        <div className="card-body text-white d-flex flex-column">
                                            <p className="card-title"> {element.title} </p>
                                            <p className="card-text"> {element.description} </p>
                                            <div className="card-icon mt-auto align-self-end">
                                                <FontAwesomeIcon icon={icons[element.icon]} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    </>
}


