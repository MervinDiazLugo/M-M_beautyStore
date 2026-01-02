import ProductCard from "../components/ProductCard";
import { useContext, useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { SearchContext } from '../components/SearchContext';
import { PRODUCTS } from './product-data';
import Head from 'next/head';

// Hook para debouncing
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function Home() {
  const { searchTerm, updateSearchTerm } = useContext(SearchContext);
  const [headerHeight, setHeaderHeight] = useState(85);
  const [isMobile, setIsMobile] = useState(false);
  const [isSmallMobile, setIsSmallMobile] = useState(false);
  const [gridColumns, setGridColumns] = useState("repeat(auto-fill, minmax(250px, 1fr))");
  const [visibleProducts, setVisibleProducts] = useState(12);
  const [isLoading, setIsLoading] = useState(false);
  
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const searchCache = useRef({});

  // Detectar tamaño del header y si es mobile
  useEffect(() => {
    const updateHeaderHeight = () => {
      const width = window.innerWidth;
      const isMobileDevice = width < 768;
      const isSmallMobileDevice = width < 480;
      setIsMobile(isMobileDevice);
      setIsSmallMobile(isSmallMobileDevice);
      
      // Usar variable CSS para consistencia
      const cssHeaderHeight = getComputedStyle(document.documentElement)
        .getPropertyValue('--header-height')
        .trim();
      
      const height = cssHeaderHeight ? parseInt(cssHeaderHeight) : (isMobileDevice ? 65 : 85);
      setHeaderHeight(height);
      
      // Actualizar grid columns según el tamaño
      if (width < 480) {
        setGridColumns("1fr");
      } else if (width < 768) {
        setGridColumns("repeat(2, 1fr)");
      } else {
        setGridColumns("repeat(auto-fill, minmax(250px, 1fr))");
      }
    };

    updateHeaderHeight();
    window.addEventListener('resize', updateHeaderHeight);
    return () => window.removeEventListener('resize', updateHeaderHeight);
  }, []);

  // Lógica de filtrado con cache y memoización
  const getFilteredProducts = useCallback((term) => {
    if (!term.trim()) {
      // Si no hay término, mostrar todos los productos
      return Object.entries(PRODUCTS).map(([key, product]) => ({ key, product }));
    }

    // Verificar cache
    const cacheKey = term.toLowerCase();
    if (searchCache.current[cacheKey]) {
      return searchCache.current[cacheKey];
    }

    const termLower = term.toLowerCase();
    const searchWords = termLower.split(' ').filter(word => word.length > 0);

    const filtered = Object.entries(PRODUCTS)
      .filter(([key, product]) => {
        const productName = product.name.toLowerCase();
        const productSku = product.sku.toLowerCase();
        const productDesc = (product.description || '').toLowerCase();
        const productCategory = (product.category || '').toLowerCase();

        // Búsqueda avanzada: todas las palabras deben coincidir en algún campo
        return searchWords.every(word => 
          productName.includes(word) || 
          productSku.includes(word) ||
          productDesc.includes(word) ||
          productCategory.includes(word)
        );
      })
      .sort((a, b) => {
        const aName = a[1].name.toLowerCase();
        const bName = b[1].name.toLowerCase();
        const aSku = a[1].sku.toLowerCase();
        const bSku = b[1].sku.toLowerCase();

        // 1. Coincidencia exacta con nombre
        if (aName === termLower) return -1;
        if (bName === termLower) return 1;

        // 2. Coincidencia exacta con SKU
        if (aSku === termLower) return -1;
        if (bSku === termLower) return 1;

        // 3. Nombre empieza con término de búsqueda
        if (aName.startsWith(termLower)) return -1;
        if (bName.startsWith(termLower)) return 1;

        // 4. SKU empieza con término de búsqueda
        if (aSku.startsWith(termLower)) return -1;
        if (bSku.startsWith(termLower)) return 1;

        // 5. Orden alfabético
        return aName.localeCompare(bName);
      })
      .map(([key, product]) => ({ 
        key, 
        product,
        relevance: calculateRelevance(product, termLower)
      }));

    // Guardar en cache
    searchCache.current[cacheKey] = filtered;
    return filtered;
  }, []);

  // Función para calcular relevancia
  const calculateRelevance = (product, searchTerm) => {
    let score = 0;
    const name = product.name.toLowerCase();
    const sku = product.sku.toLowerCase();
    
    if (name === searchTerm) score += 100;
    if (sku === searchTerm) score += 90;
    if (name.startsWith(searchTerm)) score += 80;
    if (sku.startsWith(searchTerm)) score += 70;
    if (name.includes(searchTerm)) score += 60;
    if (sku.includes(searchTerm)) score += 50;
    
    return score;
  };

  // Obtener productos filtrados
  const filteredProducts = useMemo(() => {
    setIsLoading(true);
    const result = getFilteredProducts(debouncedSearchTerm);
    // Simular carga para mostrar skeleton
    setTimeout(() => setIsLoading(false), 200);
    return result;
  }, [debouncedSearchTerm, getFilteredProducts]);

  // Resetear productos visibles al buscar
  useEffect(() => {
    setVisibleProducts(12);
  }, [debouncedSearchTerm]);

  // Infinite scroll
  useEffect(() => {
    if (visibleProducts >= filteredProducts.length) return;

    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 300) {
        setVisibleProducts(prev => Math.min(prev + 12, filteredProducts.length));
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [visibleProducts, filteredProducts.length]);

  // Productos a mostrar (para infinite scroll)
  const productsToShow = filteredProducts.slice(0, visibleProducts);

  return (
    <div style={{ width: '100%' }}>
      {/* SEO con Head nativo de Next.js */}
      <Head>
        <title>{searchTerm ? `Buscar: ${searchTerm} | ` : ''}M&M Beauty Store</title>
        <meta 
          name="description" 
          content="Tienda online de productos premium de belleza y cuidado de la piel. Encuentra los mejores productos de skincare y belleza." 
        />
        <meta 
          name="keywords" 
          content="belleza, skincare, productos belleza, cuidado piel, cosméticos, maquillaje" 
        />
        
        {/* Open Graph */}
        <meta property="og:title" content="M&M Beauty Store - Productos Premium" />
        <meta property="og:description" content="Descubre nuestra colección de productos de belleza y cuidado de la piel" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/og-image.jpg" />
        <meta property="og:url" content="https://tutienda.com/" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="M&M Beauty Store" />
        <meta name="twitter:description" content="Productos premium de belleza y cuidado de la piel" />
        <meta name="twitter:image" content="/og-image.jpg" />
      </Head>

      {/* Contenedor de búsqueda STICKY - PADDING DRAMÁTICAMENTE REDUCIDO */}
      <div style={{
        position: 'sticky',
        top: `${headerHeight}px`, 
        zIndex: 999,
        backgroundColor: '#fff',
        borderBottom: '1px solid #f0f0f0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        width: '100%',
        transition: 'top 0.3s ease'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: isSmallMobile ? '8px 12px' : isMobile ? '10px 16px' : '32px 48px',
          backgroundColor: '#fff'
        }}>
          <div style={{ 
            position: 'relative',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: isSmallMobile ? '6px' : isMobile ? '8px' : '12px',
            flexWrap: 'nowrap'
          }}>
            {/* Search input container */}
            <div style={{ 
              position: 'relative',
              flex: isSmallMobile ? '1 1 65%' : isMobile ? '1 1 70%' : '1 1 75%',
              minWidth: 0
            }}>
              <div style={{
                position: 'absolute',
                left: isSmallMobile ? '12px' : isMobile ? '14px' : '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 2,
                pointerEvents: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg
                  width={isSmallMobile ? "14" : isMobile ? "15" : "16"}
                  height={isSmallMobile ? "14" : isMobile ? "15" : "16"}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
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
                aria-label="Buscar productos por nombre o SKU"
                placeholder={isSmallMobile ? "Buscar..." : "Buscar productos por nombre o SKU..."}
                value={searchTerm}
                onChange={(e) => updateSearchTerm(e.target.value)}
                style={{
                  paddingLeft: isSmallMobile ? '34px' : isMobile ? '38px' : '42px',
                  paddingRight: isSmallMobile ? '10px' : isMobile ? '12px' : '14px',
                  paddingTop: isSmallMobile ? '8px' : isMobile ? '9px' : '10px',
                  paddingBottom: isSmallMobile ? '8px' : isMobile ? '9px' : '10px',
                  borderRadius: '6px',
                  border: '1px solid #e0d0f0',
                  width: '100%',
                  fontSize: isSmallMobile ? '13px' : isMobile ? '14px' : '15px',
                  backgroundColor: '#fff',
                  color: '#333',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                  outline: 'none',
                  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                  WebkitAppearance: 'none',
                  MozAppearance: 'none',
                  appearance: 'none',
                  minHeight: isSmallMobile ? '36px' : isMobile ? '38px' : '40px',
                  lineHeight: '1.2'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#9c27b0';
                  e.target.style.boxShadow = '0 0 0 2px rgba(156, 39, 176, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e0d0f0';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Botón de Contacto - CON ICONO DE MENSAJES */}
            <a 
              href="https://wa.me/5491122503272?text=Hola, tengo una consulta sobre un producto de la tienda" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Consultar por mensaje"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                background: 'linear-gradient(135deg, #25D366, #128C7E)', // Verde WhatsApp
                color: '#fff', 
                padding: isSmallMobile ? '8px' : isMobile ? '9px 10px' : '10px 12px', 
                borderRadius: '6px',
                flex: isSmallMobile ? '0 0 35%' : isMobile ? '0 0 30%' : '0 0 25%',
                maxWidth: isSmallMobile ? '100px' : isMobile ? '120px' : '150px',
                minWidth: isSmallMobile ? '70px' : isMobile ? '80px' : '100px',
                textDecoration: 'none', 
                fontSize: isSmallMobile ? '12px' : isMobile ? '13px' : '14px',
                fontWeight: 600,
                textAlign: 'center',
                lineHeight: 1.2,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 6px rgba(37, 211, 102, 0.25)', 
                border: 'none',
                cursor: 'pointer',
                minHeight: isSmallMobile ? '36px' : isMobile ? '38px' : '40px',
                flexShrink: 0
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 4px 10px rgba(156, 39, 176, 0.35)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 6px rgba(156, 39, 176, 0.25)';
              }}
            >
              {/* ICONO DE MENSAJES - REEMPLAZA AL DE WHATSAPP */}
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width={isSmallMobile ? "14" : isMobile ? "15" : "16"} 
                height={isSmallMobile ? "14" : isMobile ? "15" : "16"} 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                style={{ 
                  marginRight: isSmallMobile ? '4px' : isMobile ? '5px' : '6px',
                  flexShrink: 0 
                }}
              >
                {/* Icono de burbuja de chat/mensaje */}
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
              {isSmallMobile ? 'Chat' : isMobile ? 'Chat' : 'Chat Directo'}
            </a>
          </div>

          {/* Información de resultados - COMPACTA */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '6px',
            padding: '0 2px',
            minHeight: '18px'
          }}>
            {searchTerm ? (
              <p style={{
                color: '#666',
                fontSize: isSmallMobile ? '11px' : isMobile ? '11px' : '12px',
                margin: 0,
                fontWeight: 500,
                textAlign: 'center',
                width: '100%',
                lineHeight: 1.3
              }}>
                {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
                {searchTerm && ` para "${searchTerm}"`}
              </p>
            ) : (
              <>
                {/* Subtítulo - MÁS COMPACTO */}
                <p style={{
                  color: '#666',
                  fontSize: isSmallMobile ? '11px' : isMobile ? '11px' : '12px',
                  margin: 0,
                  fontStyle: 'italic',
                  opacity: 0.7,
                  textAlign: 'center',
                  width: '100%',
                  lineHeight: 1.3,
                  paddingTop: '2px'
                }}>
                  Productos premium de belleza y cuidado de la piel
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <main style={{
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: isSmallMobile ? '12px' : isMobile ? '14px' : '16px 20px 24px 20px',
        paddingTop: isSmallMobile ? '10px' : isMobile ? '12px' : '16px'
      }}>
        {/* Loading Skeleton */}
        {isLoading ? (
          <div style={{
            display: "grid",
            gridTemplateColumns: gridColumns,
            gap: isSmallMobile ? "8px" : isMobile ? "10px" : "16px",
            marginBottom: isSmallMobile ? '16px' : isMobile ? '20px' : '24px',
            width: '100%'
          }}>
            {[...Array(6)].map((_, i) => (
              <div 
                key={i}
                style={{
                  background: '#f5f5f5',
                  borderRadius: '10px',
                  height: isSmallMobile ? '280px' : isMobile ? '300px' : '320px',
                  animation: 'pulse 1.5s ease-in-out infinite',
                  border: '1px solid #eee'
                }}
              />
            ))}
          </div>
        ) : (
          <>
            {/* Grid de productos */}
            <div style={{
              display: "grid",
              gridTemplateColumns: gridColumns,
              gap: isSmallMobile ? "8px" : isMobile ? "10px" : "16px",
              marginBottom: isSmallMobile ? '16px' : isMobile ? '20px' : '24px',
              width: '100%'
            }}>
              {productsToShow.map(({ key, product }) => (
                <ProductCard key={key} product={product} />
              ))}
            </div>

            {/* Botón cargar más */}
            {visibleProducts < filteredProducts.length && filteredProducts.length > 12 && (
              <div style={{ textAlign: 'center', margin: isMobile ? '12px 0 24px 0' : '16px 0 32px 0' }}>
                <button
                  onClick={() => setVisibleProducts(prev => Math.min(prev + 12, filteredProducts.length))}
                  style={{
                    padding: isMobile ? '8px 16px' : '10px 24px',
                    backgroundColor: '#9c27b0',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: isMobile ? '12px' : '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#7b1fa2';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#9c27b0';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  Cargar más productos ({filteredProducts.length - visibleProducts} restantes)
                </button>
              </div>
            )}
          </>
        )}

        {/* Mensaje si no hay productos */}
        {filteredProducts.length === 0 && searchTerm && !isLoading && (
          <div style={{
            textAlign: 'center',
            padding: isSmallMobile ? '16px 10px' : isMobile ? '20px 14px' : '24px 16px',
            backgroundColor: '#f9f5ff',
            borderRadius: '8px',
            marginBottom: isSmallMobile ? '16px' : isMobile ? '20px' : '24px'
          }}>
            <div style={{ marginBottom: isMobile ? '8px' : '12px' }}>
              <svg width={isSmallMobile ? "40" : isMobile ? "48" : "56"} height={isSmallMobile ? "40" : isMobile ? "48" : "56"} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.5 }}>
                <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                  stroke="#9c27b0"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p style={{ 
              fontSize: isSmallMobile ? '13px' : isMobile ? '14px' : '16px', 
              color: '#333', 
              marginBottom: '6px', 
              fontWeight: 600 
            }}>
              No encontramos "{searchTerm}"
            </p>
            <p style={{ 
              color: '#666', 
              fontSize: isSmallMobile ? '11px' : isMobile ? '12px' : '14px', 
              marginBottom: isMobile ? '12px' : '16px' 
            }}>
              Intenta con otros términos de búsqueda
            </p>
            <button
              onClick={() => updateSearchTerm('')}
              style={{
                padding: isMobile ? '6px 12px' : '8px 16px',
                backgroundColor: 'transparent',
                color: '#9c27b0',
                border: '1px solid #9c27b0',
                borderRadius: '6px',
                fontSize: isMobile ? '12px' : '13px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#9c27b0';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#9c27b0';
              }}
            >
              Ver todos los productos
            </button>
          </div>
        )}
      </main>

      {/* Estilos responsivos */}
      <style jsx global>{`
        /* Animación de skeleton loading */
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        /* Quitar bordes negros y estilos por defecto del input */
        input[type="search"] {
          -webkit-appearance: none !important;
          -moz-appearance: none !important;
          appearance: none !important;
          border-radius: 6px !important;
        }

        /* Quitar la 'x' de limpiar en algunos navegadores */
        input[type="search"]::-webkit-search-cancel-button,
        input[type="search"]::-webkit-search-decoration,
        input[type="search"]::-webkit-search-results-button,
        input[type="search"]::-webkit-search-results-decoration {
          -webkit-appearance: none !important;
          appearance: none !important;
          display: none !important;
        }

        /* Estilos específicos para Firefox */
        input[type="search"] {
          background-color: #fff !important;
        }

        /* Animación suave para el input */
        input[type="search"] {
          transition: all 0.2s ease !important;
        }

        /* Mejorar accesibilidad del foco */
        *:focus-visible {
          outline: 2px solid #9c27b0 !important;
          outline-offset: 2px !important;
        }

        /* Scroll suave */
        html {
          scroll-behavior: smooth;
        }

        /* Asegurar que el placeholder se muestre correctamente */
        ::placeholder {
          color: #999 !important;
          opacity: 1 !important;
        }

        :-ms-input-placeholder {
          color: #999 !important;
        }

        ::-ms-input-placeholder {
          color: #999 !important;
        }

        /* Reducir el tamaño general de los elementos */
        * {
          box-sizing: border-box;
        }

        /* Estilos compactos para el sticky container */
        .sticky-search-container {
          padding: 12px 20px !important;
        }

        @media (max-width: 768px) {
          .sticky-search-container {
            padding: 10px 16px !important;
          }
        }

        @media (max-width: 480px) {
          .sticky-search-container {
            padding: 8px 12px !important;
          }
        }
      `}</style>
    </div>
  );
}