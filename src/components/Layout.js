import Head from 'next/head';
import Link from 'next/link';
import { useState, useContext } from 'react';
import { SearchContext } from './SearchContext';

const Layout = ({ children, showSearch = true }) => {
  const { searchTerm, updateSearchTerm } = useContext(SearchContext);

  return (
    <div style={{ minHeight: '100vh' }}>
      <Head>
        <title>Mi Tienda</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header style={{ padding: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', borderBottom: '1px solid #e0e0e0' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0' }}>
          <Link href="/" style={{ textDecoration: 'none', color: '#9c27b0', fontWeight: 'bold' }}>
            <img src="/header.png" alt="Header Image" style={{ width: '80%', height: 'auto', margin: '0' }} />
          </Link>
        </div>
      </header>
      <main style={{ padding: 24 }}>{children}</main>

      <footer style={{ textAlign: 'center', padding: 24, marginTop: 24, borderTop: '1px solid #e0e0e0', backgroundColor: '#fff', color: '#757575' }}>
        <p>Copyright 2023</p>
      </footer>
    </div>
  );
};

export default Layout;



