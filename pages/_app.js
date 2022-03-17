import '../styles/globals.css'
import Nav from '../src/components/Navbar'
import 'bootstrap/dist/css/bootstrap.css'
import { SessionProvider } from "next-auth/react";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <div>
        <Nav /> 
        <Component {...pageProps} />
      </div>
    </SessionProvider >
  )
}

export default MyApp
