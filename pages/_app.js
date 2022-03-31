import '../styles/sass/App.scss';

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp
