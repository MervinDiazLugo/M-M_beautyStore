export function ProductDescription({ product, isMobile, mlPriceStr }) {
  return (
    <div style={{
      background: '#fff',
      padding: isMobile ? '20px' : '32px',
      borderRadius: '12px',
      marginBottom: isMobile ? '24px' : '40px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
    }}>
      <h3 style={{
        margin: '0 0 16px 0',
        fontSize: isMobile ? '18px' : 'clamp(20px, 3vw, 24px)',
        fontWeight: 600,
        color: '#111827',
        paddingBottom: isMobile ? '12px' : '16px',
        borderBottom: '1px solid #e5e7eb'
      }}>
        Descripción del producto
      </h3>
      <div style={{
        color: '#374151',
        lineHeight: '1.7',
        fontSize: isMobile ? '14px' : 'clamp(15px, 2vw, 16px)'
      }}>
        {product.description.split('\n').map((paragraph, index) => (
          <p key={index} style={{
            margin: '0 0 16px 0',
            wordWrap: 'break-word',
            overflowWrap: 'break-word'
          }}>
            {paragraph}
          </p>
        ))}

        {product.ml_price && product.mercadoLibreUrl && (
          <div style={{
            backgroundColor: '#f8fafc',
            borderRadius: '12px',
            padding: isMobile ? '20px' : '24px',
            marginTop: isMobile ? '20px' : '28px',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: isMobile ? '20px' : '24px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: isMobile ? '12px' : '16px'
                }}>
                  <img
                    src="/mercado-libre-logo.svg"
                    alt="MercadoLibre Logo"
                    style={{
                      width: isMobile ? '36px' : '44px',
                      height: isMobile ? '36px' : '44px',
                      objectFit: 'contain'
                    }}
                  />
                  <div>
                    <h4 style={{
                      margin: 0,
                      fontSize: isMobile ? '16px' : '18px',
                      fontWeight: 600,
                      color: '#374151'
                    }}>
                      También disponible en MercadoLibre
                    </h4>
                    <p style={{
                      margin: '4px 0 0 0',
                      fontSize: isMobile ? '13px' : '14px',
                      color: '#64748b'
                    }}>
                      Con precios más altos por comisiones de la plataforma
                    </p>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: isMobile ? '12px' : '16px',
                  padding: isMobile ? '12px' : '16px',
                  backgroundColor: 'white',
                  borderRadius: '10px',
                  border: '1px solid #e5e7eb',
                  flexWrap: 'wrap'
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      fontSize: isMobile ? '11px' : '12px',
                      color: '#6b7280',
                      marginBottom: '4px',
                      fontWeight: 500
                    }}>
                      MercadoLibre
                    </div>
                    <div style={{
                      fontSize: isMobile ? '18px' : '20px',
                      fontWeight: 700,
                      color: '#374151',
                      textDecoration: 'line-through'
                    }}>
                      ${mlPriceStr}
                    </div>
                  </div>
                  <div style={{
                    width: '1px',
                    height: '40px',
                    backgroundColor: '#e5e7eb'
                  }}></div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      fontSize: isMobile ? '11px' : '12px',
                      color: '#7c3aed',
                      marginBottom: '4px',
                      fontWeight: 600
                    }}>
                      Precio Web
                    </div>
                    <div style={{
                      fontSize: isMobile ? '20px' : '24px',
                      fontWeight: 800,
                      color: '#7c3aed'
                    }}>
                      ${product.price.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>
              </div>

              <a
                href={product.mercadoLibreUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  padding: '16px',
                  backgroundColor: '#fff159',
                  color: '#333',
                  textDecoration: 'none',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: isMobile ? '14px' : '16px',
                  transition: 'all 0.2s ease',
                  border: '1px solid #e5e7eb'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f7e619';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#fff159';
                }}
              >
                VER EN MERCADOLIBRE
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
