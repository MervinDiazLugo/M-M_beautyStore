import Head from 'next/head';
import Link from 'next/link';
import { useContext } from 'react';
import { SearchContext } from './SearchContext';
import Footer from './Footer';

const Layout = ({ children, showSearch = true }) => {
  const { searchTerm, updateSearchTerm } = useContext(SearchContext);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      width: '100%'
    }}>
      <Head>
        <title>M&M - Beauty and Skincare store - Productos de belleza</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="Tienda online de productos de belleza y cuidado personal" />
      </Head>

      {/* HEADER MÁS GRANDE Y PROMINENTE */}
      <header style={{
        padding: '0',
        width: '100%',
        backgroundColor: '#fff',
        borderBottom: '1px solid #e0e0e0',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        height: '80px', // ALTURA FIJA IMPORTANTE
        display: 'flex',
        alignItems: 'center'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100px', // Más alto
          height: 'auto',
          paddingTop: '15px',
          paddingBottom: '15px'
        }}>
          <Link href="/" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            padding: '10px 0'
          }}>
            {/* Contenedor de logo más grande */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '80px', // Más alto
              minHeight: '80px',
              width: '100%'
            }}>
              <img
                src="/header.png"
                alt="M&M - Beauty and Skincare store"
                style={{
                  height: '100%',
                  width: 'auto',
                  maxWidth: '500px', // Más ancho
                  minWidth: '300px',
                  objectFit: 'contain',
                  objectPosition: 'center',
                  display: 'block'
                }}
                onError={(e) => {
                  // Si la imagen falla, mostrar texto grande
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = `
                    <div style="
                      color: #9c27b0;
                      font-size: 32px;
                      font-weight: 800;
                      text-align: center;
                      letter-spacing: 1px;
                      padding: 20px;
                    ">
                      M&M BEAUTY
                      <div style="
                        font-size: 16px;
                        font-weight: 500;
                        color: #666;
                        margin-top: 5px;
                        letter-spacing: 2px;
                      ">
                        SKINCARE STORE
                      </div>
                    </div>
                  `;
                }}
              />
            </div>
          </Link>
        </div>

        {/* Subtítulo opcional debajo del logo */}
        <div style={{
          textAlign: 'center',
          padding: '5px 0 15px 0',
          backgroundColor: '#f9f5ff',
          borderTop: '1px solid #f0f0f0'
        }}>
          <span style={{
            color: '#9c27b0',
            fontSize: '14px',
            fontWeight: '500',
            letterSpacing: '1px'
          }}>
          </span>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main style={{
        flex: 1,
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '30px 20px', // Más padding
        position: 'relative'
      }}>
        {children}
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
};

export default Layout;