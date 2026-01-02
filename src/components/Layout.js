import Head from 'next/head';
import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';
import { SearchContext } from './SearchContext';
import Footer from './Footer';

const Layout = ({ children, showSearch = true }) => {
  const { searchTerm, updateSearchTerm } = useContext(SearchContext);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      {/* HEADER RESPONSIVE - ALTURA FIJA PARA CALCULAR */}
      <header style={{
        padding: '0',
        width: '100%',
        backgroundColor: '#fff',
        borderBottom: '1px solid #e0e0e0',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        {/* Logo container - ALTURA FIJA PARA CALCULAR */}
        <div style={{
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: isMobile ? '15px 16px' : '20px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: isMobile ? '65px' : '85px', // ALTURA FIJA
          boxSizing: 'border-box'
        }}>
          <Link href="/" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            padding: '0',
            textDecoration: 'none'
          }}>
            {/* Contenedor de logo responsivo - AJUSTADO */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              width: '100%',
              maxWidth: '100%'
            }}>
              <img
                src="/header.png"
                alt="M&M - Beauty and Skincare store"
                style={{
                  height: isMobile ? '45px' : '65px', // ALTURA FIJA
                  width: 'auto',
                  maxWidth: isMobile ? '300px' : '450px',
                  objectFit: 'contain',
                  objectPosition: 'center',
                  display: 'block'
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = `
                    <div style="
                      color: #9c27b0;
                      font-size: ${isMobile ? '22px' : '28px'};
                      font-weight: 800;
                      text-align: center;
                      letter-spacing: 1px;
                      padding: ${isMobile ? '5px' : '10px'};
                    ">
                      M&M BEAUTY
                      <div style="
                        font-size: ${isMobile ? '12px' : '14px'};
                        font-weight: 500;
                        color: #666;
                        margin-top: ${isMobile ? '2px' : '4px'};
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

        {/* Subtítulo opcional - SOLO EN DESKTOP */}
        {!isMobile && (
          <div style={{
            textAlign: 'center',
            padding: '8px 0 12px 0',
            backgroundColor: '#f9f5ff',
            borderTop: '1px solid #f0f0f0',
            width: '100%'
          }}>
            <span style={{
              color: '#9c27b0',
              fontSize: '14px',
              fontWeight: '500',
              letterSpacing: '1px'
            }}>
              Productos premium de belleza y cuidado de la piel
            </span>
          </div>
        )}
      </header>

      {/* MAIN CONTENT */}
      <main style={{
        flex: 1,
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: isMobile ? '16px' : '20px',
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