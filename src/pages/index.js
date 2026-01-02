import ProductCard from "../components/ProductCard";
import { useContext, useEffect, useState } from 'react';
import { SearchContext } from '../components/SearchContext';
import { PRODUCTS } from './product-data';

export default function Home() {
  const { searchTerm, updateSearchTerm } = useContext(SearchContext);
  const [headerHeight, setHeaderHeight] = useState(120); // Valor inicial
  const [isMobile, setIsMobile] = useState(false);

  // Detectar tamaño del header y si es mobile
  useEffect(() => {
    const updateHeaderHeight = () => {
      const width = window.innerWidth;
      const isMobileDevice = width < 768;
      setIsMobile(isMobileDevice);
      
      // ALTURAS COINCIDENTES CON LAYOUT.JS
      if (width < 480) {
        setHeaderHeight(65); // Mobile pequeño - 65px del header
      } else if (width < 768) {
        setHeaderHeight(65); // Mobile - 65px del header
      } else {
        setHeaderHeight(85); // Desktop - 85px del header (65px logo + 20px padding)
      }
    };

    updateHeaderHeight();
    window.addEventListener('resize', updateHeaderHeight);
    return () => window.removeEventListener('resize', updateHeaderHeight);
  }, []);

  const filteredProducts = Object.entries(PRODUCTS)
    .filter(([key, product]) => {
      const productName = product.name.toLowerCase();
      const productSku = product.sku.toLowerCase();
      const searchTermLower = searchTerm.toLowerCase();

      return productName.includes(searchTermLower) || productSku.includes(searchTermLower);
    })
    .map(([key, product]) => ({ key, product }));

  return (
    <div style={{ width: '100%' }}>
      {/* Contenedor de búsqueda STICKY - POSICIÓN CORRECTA */}
      <div style={{
        position: 'sticky',
        top: `${headerHeight}px`, // Posición dinámica BASADA EN HEADER REAL
        zIndex: 90,
        backgroundColor: '#fff',
        borderBottom: '1px solid #f0f0f0',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        width: '100%',
        transition: 'top 0.3s ease'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: isMobile ? '12px 16px' : '16px 20px',
          backgroundColor: '#fff'
        }}>
          <div style={{ 
            position: 'relative',
            width: '100%'
          }}>
            <div style={{
              position: 'absolute',
              left: isMobile ? '14px' : '18px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 2,
              pointerEvents: 'none'
            }}>
              <svg 
                width={isMobile ? "16" : "18"} 
                height={isMobile ? "16" : "18"} 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" 
                  stroke="#9c27b0" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            
            <input
              type="search"
              placeholder="Buscar productos por nombre o SKU..."
              value={searchTerm}
              onChange={(e) => updateSearchTerm(e.target.value)}
              style={{
                padding: isMobile ? '10px 14px 10px 40px' : '12px 16px 12px 48px',
                borderRadius: '8px',
                border: '1px solid #e0d0f0',
                width: '100%',
                fontSize: isMobile ? '14px' : '15px',
                backgroundColor: '#fff',
                color: '#333',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
                outline: 'none',
                transition: 'border-color 0.2s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = '#9c27b0'}
              onBlur={(e) => e.target.style.borderColor = '#e0d0f0'}
            />
          </div>
          
          {/* Subtítulo pequeño debajo de la búsqueda - SOLO EN MOBILE */}
          {isMobile && (
            <p style={{
              color: '#666',
              fontSize: '12px',
              textAlign: 'center',
              margin: '10px 0 0 0',
              fontStyle: 'italic',
              opacity: 0.8
            }}>
              Productos premium de belleza y cuidado de la piel
            </p>
          )}
        </div>
      </div>

      {/* Contenido principal */}
      <main style={{ 
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: isMobile ? '16px' : '20px 20px 30px 20px'
      }}>
        {/* Grid de productos */}
        <div style={{ 
          display: "grid",
          gridTemplateColumns: isMobile ? (window.innerWidth < 480 ? "1fr" : "repeat(2, 1fr)") : "repeat(auto-fill, minmax(250px, 1fr))",
          gap: isMobile ? "12px" : "20px",
          marginBottom: '30px',
          width: '100%'
        }}>
          {filteredProducts.map(({ key, product }) => (
            <ProductCard key={key} product={product} />
          ))}
        </div>
        
        {/* Mensaje si no hay productos */}
        {filteredProducts.length === 0 && searchTerm && (
          <div style={{
            textAlign: 'center',
            padding: isMobile ? '30px 16px' : '40px 20px',
            backgroundColor: '#f9f5ff',
            borderRadius: '10px',
            marginBottom: '30px'
          }}>
            <div style={{ marginBottom: '15px' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.5 }}>
                <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" 
                  stroke="#9c27b0" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p style={{ fontSize: isMobile ? '14px' : '16px', color: '#666', marginBottom: '8px' }}>
              No encontramos "{searchTerm}"
            </p>
            <p style={{ color: '#999', fontSize: isMobile ? '13px' : '14px' }}>
              Intenta con otros términos de búsqueda
            </p>
          </div>
        )}
      </main>
      
      {/* Estilos responsivos simplificados */}
      <style jsx>{`
        /* Quitar bordes negros del input */
        input[type="search"] {
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
        }
        
        /* Quitar la 'x' de limpiar en algunos navegadores */
        input[type="search"]::-webkit-search-cancel-button {
          -webkit-appearance: none;
          appearance: none;
        }
        
        /* Animación suave para el input */
        input[type="search"] {
          transition: all 0.2s ease;
        }
        
        /* Grid responsivo para diferentes tamaños de pantalla */
        @media (min-width: 768px) {
          main > div:first-of-type {
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 20px;
          }
        }
        
        @media (min-width: 1024px) {
          main > div:first-of-type {
            gap: 24px;
          }
        }
      `}</style>
    </div>
  )
}