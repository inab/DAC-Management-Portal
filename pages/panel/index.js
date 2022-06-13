import Head from 'next/head';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsersRectangle, faUserShield, faChalkboardUser, faFileCircleExclamation } from '@fortawesome/free-solid-svg-icons';

export default function Panel() {

    return <>
        <div>
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
                            <div className="col-6 d-flex align-items-stretch p-2">
                                <div className="card text-white bg-primary w-100">
                                    <Link href="/panel/review">
                                        <a>
                                            <div className="card-body text-white">
                                                <h2 className="card-title"> Review DACs </h2>
                                                <p className="card-text"> Validate DAC info supplied by the DAC-admins.  </p>
                                                <div style={{ float: "right" }}>
                                                    <FontAwesomeIcon icon={faChalkboardUser} style={{ width: "45px" }} />
                                                </div>
                                            </div>
                                        </a>
                                    </Link>
                                </div>
                            </div>
                            <div className="col-6 d-flex align-items-stretch p-2">
                                <div className="card text-white bg-success w-100">
                                    <Link href="/panel/create">
                                        <a>
                                            <div className="card-body text-white">
                                                <h2 className="card-title"> Create a DAC </h2>
                                                <p className="card-text"> Link users with resources and generate new DACs. </p>
                                                <div style={{ float: "right" }}>
                                                    <FontAwesomeIcon icon={faUsersRectangle} style={{ width: "45px" }} />
                                                </div>
                                            </div>
                                        </a>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="row h-75">
                            <div className="col-6 d-flex align-items-stretch p-2">
                                <div className="card text-dark bg-warning w-100">
                                    <Link href="/panel/roles">
                                        <a>
                                            <div className="card-body text-white">
                                                <h2 className="card-title"> Manage DAC roles </h2>
                                                <p className="card-text"> Manage roles from existing DACs.</p>
                                                <div style={{ float: "right" }}>
                                                    <FontAwesomeIcon icon={faUserShield} style={{ width: "45px" }} />
                                                </div>
                                            </div>
                                        </a>
                                    </Link>
                                </div>
                            </div>
                            <div className="col-6 d-flex align-items-stretch p-2">
                                <div className="card text-white bg-danger w-100">
                                    <Link href="/panel/resources">
                                        <a>
                                            <div className="card-body text-white">
                                                <h2 className="card-title"> Manage Resources </h2>
                                                <p className="card-text"> Manage resources allocated to the DACs.  </p>
                                                <div style={{ float: "right" }}>
                                                    <FontAwesomeIcon icon={faFileCircleExclamation} style={{ width: "45px" }} />
                                                </div>
                                            </div>
                                        </a>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </>
}


