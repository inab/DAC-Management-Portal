import Head from 'next/head';
import Link from 'next/link';

export default function Panel() {

    return <>
        <div>
            <Head>
                <title>DAC Management</title>
                <meta name="description" content="iPC DAC-Mgt Portal" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main class="main">
                <h2 class="title">
                    Administrator panel
                </h2>
                <div class="panel">
                    <Link href="/panel/review">
                        <a class="card-panel">
                            <h2> Review DACs </h2>
                            <p> Validate DAC info supplied by the DAC-admins.  </p>
                        </a>
                    </Link>
                    <Link href="/panel/create">
                        <a class="card-panel">
                            <h2> Create a DAC </h2>
                            <p> Link users with resources and generate new DACs. </p>
                        </a>
                    </Link>
                    <Link href="/panel/roles">
                        <a class="card-panel">
                            <h2> Manage DAC roles </h2>
                            <p> Manage roles from existing DACs. </p>
                        </a>
                    </Link>
                    <Link href="/panel/resources">
                        <a class="card-panel">
                            <h2> Manage Resources </h2>
                            <p> Manage resources allocated to the DACs.  </p>
                        </a>
                    </Link>
                </div>
            </main>
        </div>
    </>
}
