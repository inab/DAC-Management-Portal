import '../styles/sass/App.scss';
import { useRouter } from "next/router";
import Navbar from '../src/components/Navbar';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const showNavbar = router.pathname === "/" ? false : true;

  return (
    <div>
      {showNavbar && <Navbar/>}
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp
