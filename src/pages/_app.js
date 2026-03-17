import "../styles/globals.css";
import Layout from '../components/Layout';
import { SearchProvider } from '../components/SearchContext';
import { Analytics } from "@vercel/analytics/next";
import { useRouter } from 'next/router';

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const isAdmin = router.pathname.startsWith('/admin');

  if (isAdmin) {
    return (
      <>
        <Component {...pageProps} />
        <Analytics />
      </>
    );
  }

  return (
    <SearchProvider>
      <Layout showSearch={true}>
        <Component {...pageProps} />
        <Analytics />
      </Layout>
    </SearchProvider>
  );
}
