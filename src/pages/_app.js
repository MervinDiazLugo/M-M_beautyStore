import "../styles/globals.css";
import Layout from '../components/Layout';
import { SearchProvider } from '../components/SearchContext';
import { Analytics } from "@vercel/analytics/next";

export default function App({ Component, pageProps }) {
  return (
    <SearchProvider>
      <Layout showSearch={true}>
        <Component {...pageProps} />
        <Analytics />
      </Layout>
    </SearchProvider>
  );
}