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

      {/* HEADER RESPONSIVE */}
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
        <div style={{
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: isMobile ? '12px 16px' : '15px 20px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 'auto',
          minHeight: isMobile ? '65px' : '80px'
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
            {/* Contenedor de logo responsivo - MÁS GRANDE EN MOBILE */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: 'auto',
              width: '100%',
              maxWidth: '100%',
              padding: isMobile ? '5px 0' : '5px 0'
            }}>
              <img
                src="/header.png"
                alt="M&M - Beauty and Skincare store"
                style={{
                  height: 'auto',
                  width: '100%',
                  maxWidth: isMobile ? '350px' : '400px',
                  minWidth: isMobile ? '280px' : '250px',
                  objectFit: 'contain',
                  objectPosition: 'center',
                  display: 'flex'
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = `
                    <div style="
                      color: #9c27b0;
                      font-size: ${isMobile ? '28px' : '32px'};
                      font-weight: 800;
                      text-align: center;
                      letter-spacing: 1px;
                      padding: ${isMobile ? '10px' : '15px'};
                      width: 100%;
                    ">
                      M&M BEAUTY
                      <div style="
                        font-size: ${isMobile ? '13px' : '14px'};
                        font-weight: 500;
                        color: #666;
                        margin-top: 4px;
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

        {/* Media query inline para responsividad adicional */}
        <style jsx>{`
          @media (max-width: 480px) {
            header > div:first-child {
              padding: 10px 12px !important;
              min-height: 60px !important;
            }
            header > div:first-child img {
              max-width: 320px !important;
              min-width: 250px !important;
            }
          }
          
          @media (max-width: 360px) {
            header > div:first-child {
              padding: 8px 10px !important;
              min-height: 55px !important;
            }
            header > div:first-child img {
              max-width: 290px !important;
              min-width: 220px !important;
            }
          }
          
          @media (max-width: 320px) {
            header > div:first-child img {
              max-width: 270px !important;
              min-width: 200px !important;
            }
          }
          
          @media (min-width: 769px) {
            header > div:first-child {
              min-height: 85px !important;
            }
            header > div:first-child img {
              max-width: 520px !important;
            }
          }
          
          @media (min-width: 1024px) {
            header > div:first-child img {
              max-width: 550px !important;
            }
          }
        `}</style>
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