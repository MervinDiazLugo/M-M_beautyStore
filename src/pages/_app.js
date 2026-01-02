import "../styles/globals.css";
import Layout from '../components/Layout';
import { SearchProvider } from '../components/SearchContext';

export default function App({ Component, pageProps }) {
  return (
    <SearchProvider>
      <Layout showSearch={true}>
        <Component {...pageProps} />
      </Layout>
    </SearchProvider>
  );
}