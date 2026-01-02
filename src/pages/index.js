import ProductCard from "../components/ProductCard";
import { useContext } from 'react';
import { SearchContext } from '../components/SearchContext';
import { PRODUCTS } from './product-data';

export default function Home() {
  const { searchTerm, updateSearchTerm } = useContext(SearchContext);

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
      {/* Contenedor de búsqueda STICKY */}
      <div style={{
        position: 'sticky',
        top: '100px',
        zIndex: 90,
        backgroundColor: '#fff',
        borderBottom: '1px solid #f0f0f0',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        width: '100%'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '15px 20px',
          backgroundColor: '#fff'
        }}>
          <div style={{ 
            position: 'relative',
            width: '100%'
          }}>
            <div style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 2,
              pointerEvents: 'none'
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                padding: '12px 16px 12px 44px',
                borderRadius: '8px',
                border: '1px solid #e0d0f0',
                width: '100%',
                fontSize: '14px',
                backgroundColor: '#fff',
                color: '#333',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
                outline: 'none'
              }}
            />
          </div>
          
          {/* Subtítulo pequeño debajo de la búsqueda */}
          <p style={{
            color: '#666',
            fontSize: '13px',
            textAlign: 'center',
            margin: '10px 0 0 0',
            fontStyle: 'italic',
            opacity: 0.8
          }}>
            Productos premium de belleza y cuidado de la piel
          </p>
        </div>
      </div>

      {/* Contenido principal */}
      <main style={{ 
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px 20px 30px 20px'
      }}>
        {/* Subtítulo solo desktop (opcional, puedes quitarlo si prefieres) */}
        <div style={{
          textAlign: 'center',
          marginBottom: '20px',
          display: 'none'
        }}
          className="desktop-only"
        >
          <p style={{
            color: '#666',
            fontSize: '16px',
            margin: '0',
            fontStyle: 'italic'
          }}>
            Descubre nuestra selección de productos de belleza
          </p>
        </div>

        {/* Grid de productos */}
        <div style={{ 
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "20px",
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
            padding: '40px 20px',
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
            <p style={{ fontSize: '16px', color: '#666', marginBottom: '8px' }}>
              No encontramos "{searchTerm}"
            </p>
            <p style={{ color: '#999', fontSize: '14px' }}>
              Intenta con otros términos de búsqueda
            </p>
          </div>
        )}
      </main>
      
      {/* Estilos responsivos */}
      <style jsx>{`
        /* Quitar bordes negros del input */
        input[type="search"] {
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
        }
        
        /* Focus sin bordes negros */
        input[type="search"]:focus {
          border-color: #9c27b0 !important;
          box-shadow: 0 0 0 3px rgba(156, 39, 176, 0.1) !important;
          outline: none !important;
        }
        
        /* Quitar la 'x' de limpiar en algunos navegadores */
        input[type="search"]::-webkit-search-cancel-button {
          -webkit-appearance: none;
          appearance: none;
        }
        
        @media (max-width: 768px) {
          /* Búsqueda sticky ajustada para mobile */
          div[style*="position: sticky"] {
            top: 60px !important; /* Header más pequeño en mobile */
            padding: 10px 15px !important;
          }
          
          /* Grid 2 columnas */
          main > div:first-of-type {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 15px !important;
          }
          
          /* Ícono más pequeño */
          div[style*="position: absolute"] svg {
            width: 16px !important;
            height: 16px !important;
            left: 14px !important;
          }
          
          input[type="search"] {
            padding-left: 40px !important;
            padding-top: 10px !important;
            padding-bottom: 10px !important;
          }
          
          /* Subtítulo más pequeño en mobile */
          p[style*="font-style: italic"] {
            font-size: 11px !important;
            margin-top: 8px !important;
          }
          
          /* Padding reducido en mobile */
          main {
            padding: 15px !important;
          }
        }
        
        @media (max-width: 480px) {
          /* Búsqueda sticky ajustada para mobile pequeño */
          div[style*="position: sticky"] {
            top: 50px !important;
            padding: 8px 12px !important;
          }
          
          /* Grid 1 columna */
          main > div:first-of-type {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
          }
          
          /* Ícono más pequeño */
          div[style*="position: absolute"] svg {
            width: 14px !important;
            height: 14px !important;
            left: 12px !important;
          }
          
          input[type="search"] {
            padding-left: 36px !important;
            font-size: 13px !important;
            padding-top: 9px !important;
            padding-bottom: 9px !important;
          }
          
          /* Subtítulo oculto en mobile muy pequeño */
          p[style*="font-style: italic"] {
            display: none !important;
          }
          
          /* Padding más reducido en mobile pequeño */
          main {
            padding: 12px !important;
          }
        }
        
        @media (min-width: 769px) {
          /* Mostrar subtítulo en desktop */
          .desktop-only {
            display: block !important;
          }
          
          /* Grid 4 columnas */
          main > div:first-of-type {
            grid-template-columns: repeat(4, 1fr) !important;
          }
          
          /* Ícono más grande */
          div[style*="position: absolute"] svg {
            width: 20px !important;
            height: 20px !important;
            left: 18px !important;
          }
          
          input[type="search"] {
            padding-left: 50px !important;
            font-size: 15px !important;
            padding-top: 14px !important;
            padding-bottom: 14px !important;
          }
          
          /* Búsqueda sticky ajustada para desktop */
          div[style*="position: sticky"] {
            top: 80px !important;
          }
        }
        
        @media (min-width: 1024px) {
          /* Más espacio entre productos */
          main > div:first-of-type {
            gap: 24px !important;
          }
        }
        
        /* Animación suave para el input */
        input[type="search"] {
          transition: all 0.2s ease;
        }
      `}</style>
    </div>
  )
}