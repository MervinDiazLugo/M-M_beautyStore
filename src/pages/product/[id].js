import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { PRODUCTS } from '../product-data';

export default function ProductPage() {
  const { query } = useRouter()
  const product = PRODUCTS[query.id]
  const [qty, setQty] = useState(1)
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!product) return (
    <main style={{ padding: 24 }}>
      <p>Producto no encontrado — <Link href='/'>Volver</Link></p>
    </main>
  )

  const priceStr = product.price.toLocaleString('es-AR', {minimumFractionDigits: 2,maximumFractionDigits: 2})
  const total = (product.price * qty).toLocaleString('es-AR', {minimumFractionDigits: 2,maximumFractionDigits: 2})
  const message = `Hola, quiero comprar *${product.name}* (SKU: ${product.sku})\nCantidad: ${qty}\nPrecio unitario: $${priceStr}\nTotal: $${total}`
  const waBase = "https://wa.me/5491122503272"
  const waLink = `${waBase}?text=${encodeURIComponent(message)}`

  const goToPrevious = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? product.image.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentImageIndex((nextIndex) =>
      nextIndex === product.image.length - 1 ? 0 : nextIndex + 1
    );
  };

  // Función para acortar la URL para display
  const shortenUrl = (url) => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname + urlObj.pathname.slice(0, 30) + '...';
    } catch {
      return url.length > 40 ? url.substring(0, 40) + '...' : url;
    }
  };

  return (
    <main className="product-page" style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      
      {/* Header - NO ES STICKY y NO TAPA NADA */}
      <header style={{
        backgroundColor: '#fff',
        borderBottom: '1px solid #e5e7eb',
        padding: isMobile ? '12px 16px' : '16px 5%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{
          width: '100%',
          maxWidth: '1200px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {/* LOGO CON ENLACE - NO SE TAPA */}
          <Link href="/" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            textDecoration: 'none',
            cursor: 'pointer'
          }}>
            <div style={{
              width: isMobile ? '32px' : '40px',
              height: isMobile ? '32px' : '40px',
              backgroundColor: '#7c3aed',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: isMobile ? '14px' : '18px',
              cursor: 'pointer'
            }}>
              M&M
            </div>
            <span style={{
              fontSize: isMobile ? '14px' : '18px',
              fontWeight: 600,
              color: '#111827'
            }}>
              Beauty and Skincare
            </span>
          </Link>
          
          <Link href="/" style={{
            textDecoration: 'none',
            color: '#6b7280',
            fontSize: isMobile ? '12px' : '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            ← {isMobile ? 'Volver' : 'Volver a productos'}
          </Link>
        </div>
      </header>

      <div style={{ 
        padding: isMobile ? '0 16px' : '0 5%', 
        maxWidth: '1200px', 
        margin: '0 auto', 
        paddingTop: isMobile ? '16px' : '24px' 
      }}>
        
        {/* Breadcrumb */}
        <nav style={{ 
          color: '#6b7280', 
          marginBottom: isMobile ? '16px' : '24px', 
          fontSize: isMobile ? '12px' : '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          flexWrap: 'wrap'
        }}>
          <Link href="/" style={{ textDecoration: 'none', color: '#6b7280' }}>
            Inicio
          </Link>
          <span>/</span>
          <span style={{ 
            color: '#111827', 
            fontWeight: 500,
            maxWidth: '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {isMobile ? product.name.substring(0, 30) + (product.name.length > 30 ? '...' : '') : product.name}
          </span>
        </nav>

        {/* Main Content Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: isMobile ? '5px' : '5px',
          marginBottom: isMobile ? '5px' : '5px',
        }}>
          {/* Image Carousel Section */}
          <div style={{ 
            position: 'relative',
            minHeight: isMobile ? '300px' : '450px'
          }}>
            <div style={{
              background: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '1px',
              padding: isMobile ? '1px' : '2px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              height: '95%',
              minHeight: isMobile ? '300px' : '450px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <img
                src={product.image[currentImageIndex]}
                alt={product.name}
                style={{
                  maxWidth: '100%',
                  maxHeight: isMobile ? '300px' : '450px',
                  objectFit: 'contain',
                  transition: 'opacity 0.3s ease-in-out'
                }}
              />
            </div>
            
            {/* Carousel Controls */}
            {product.image.length > 1 && (
              <>
                <button
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: isMobile ? '8px' : '20px',
                    transform: 'translateY(-50%)',
                    background: 'rgba(255, 255, 255, 0.9)',
                    color: '#374151',
                    border: '1px solid #e5e7eb',
                    padding: isMobile ? '8px' : '12px',
                    cursor: 'pointer',
                    borderRadius: '50%',
                    width: isMobile ? '32px' : '44px',
                    height: isMobile ? '32px' : '44px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    transition: 'all 0.2s ease',
                    fontSize: isMobile ? '14px' : '16px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)'}
                  onClick={goToPrevious}
                  aria-label="Imagen anterior"
                >
                  ←
                </button>
                <button
                  style={{
                    position: 'absolute',
                    top: '50%',
                    right: isMobile ? '8px' : '20px',
                    transform: 'translateY(-50%)',
                    background: 'rgba(255, 255, 255, 0.9)',
                    color: '#374151',
                    border: '1px solid #e5e7eb',
                    padding: isMobile ? '8px' : '12px',
                    cursor: 'pointer',
                    borderRadius: '50%',
                    width: isMobile ? '32px' : '44px',
                    height: isMobile ? '32px' : '44px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    transition: 'all 0.2s ease',
                    fontSize: isMobile ? '14px' : '16px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)'}
                  onClick={goToNext}
                  aria-label="Siguiente imagen"
                >
                  →
                </button>
              </>
            )}
          </div>

          {/* Product Info Section */}
          <div style={{
            background: '#fff',
            padding: isMobile ? '20px' : '32px',
            borderRadius: '12px',
            height: 'fit-content',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h1 style={{
              margin: '0 0 8px 0',
              fontSize: isMobile ? '20px' : 'clamp(24px, 3vw, 28px)',
              fontWeight: 700,
              color: '#111827',
              lineHeight: 1.3
            }}>
              {product.name}
            </h1>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: isMobile ? '12px' : '20px',
              flexWrap: 'wrap'
            }}>
              <span style={{
                backgroundColor: '#f3f4f6',
                color: '#6b7280',
                fontSize: isMobile ? '10px' : '12px',
                padding: isMobile ? '3px 6px' : '4px 8px',
                borderRadius: '4px',
                fontWeight: 500
              }}>
                SKU: {product.sku}
              </span>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '8px',
              marginBottom: isMobile ? '16px' : '24px'
            }}>
              <span style={{
                fontSize: isMobile ? '24px' : 'clamp(28px, 4vw, 32px)',
                fontWeight: 700,
                color: '#111827'
              }}>
                ${priceStr}
              </span>
            </div>

            {/* Características principales */}
            <div style={{ marginBottom: isMobile ? '20px' : '28px' }}>
              <h3 style={{
                margin: '0 0 12px 0',
                fontSize: isMobile ? '16px' : '18px',
                fontWeight: 600,
                color: '#111827'
              }}>
                Características principales
              </h3>
              <ul style={{
                margin: 0,
                padding: 0,
                listStyle: 'none',
                color: '#374151'
              }}>
                {product.features.map((feature, index) => (
                  <li key={index} style={{
                    marginBottom: isMobile ? '8px' : '12px',
                    paddingLeft: isMobile ? '20px' : '24px',
                    position: 'relative',
                    fontSize: isMobile ? '14px' : '15px',
                    lineHeight: 1.5
                  }}>
                    <div style={{
                      position: 'absolute',
                      left: 0,
                      top: isMobile ? '7px' : '8px',
                      width: isMobile ? '6px' : '8px',
                      height: isMobile ? '6px' : '8px',
                      borderRadius: '50%',
                      backgroundColor: '#7c3aed'
                    }}></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Especificaciones */}
            <div style={{ marginBottom: isMobile ? '20px' : '28px' }}>
              <h3 style={{
                margin: '0 0 12px 0',
                fontSize: isMobile ? '16px' : '18px',
                fontWeight: 600,
                color: '#111827'
              }}>
                Especificaciones
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: isMobile ? '8px' : '12px'
              }}>
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} style={{
                    padding: isMobile ? '10px' : '12px',
                    backgroundColor: '#f9fafb',
                    borderRadius: '8px'
                  }}>
                    <div style={{
                      fontSize: isMobile ? '11px' : '12px',
                      color: '#6b7280',
                      fontWeight: 500,
                      marginBottom: '4px'
                    }}>
                      {key}
                    </div>
                    <div style={{
                      fontSize: isMobile ? '13px' : '14px',
                      color: '#374151',
                      fontWeight: 500,
                      wordBreak: 'break-word'
                    }}>
                      {value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Selector de cantidad */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: isMobile ? '12px' : '16px',
              marginBottom: isMobile ? '24px' : '32px',
              flexWrap: 'wrap'
            }}>
              <label style={{
                color: '#111827',
                fontSize: isMobile ? '14px' : '16px',
                fontWeight: 600
              }}>
                Cantidad:
              </label>
              <div style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '8px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                padding: '4px',
                backgroundColor: '#fff'
              }}>
                <button
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  style={{
                    width: isMobile ? '32px' : '36px',
                    height: isMobile ? '32px' : '36px',
                    border: 'none',
                    background: 'transparent',
                    borderRadius: '6px',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#374151',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  aria-label="Reducir cantidad"
                >
                  −
                </button>
                <input
                  type="number"
                  value={qty}
                  min="1"
                  onChange={e => setQty(Math.max(1, Number(e.target.value || 1)))}
                  style={{
                    width: isMobile ? '50px' : '60px',
                    textAlign: 'center',
                    padding: isMobile ? '6px' : '8px',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: isMobile ? '14px' : '16px',
                    backgroundColor: 'transparent',
                    outline: 'none'
                  }}
                  aria-label="Cantidad"
                />
                <button
                  onClick={() => setQty(q => q + 1)}
                  style={{
                    width: isMobile ? '32px' : '36px',
                    height: isMobile ? '32px' : '36px',
                    border: 'none',
                    background: 'transparent',
                    borderRadius: '6px',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#374151',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  aria-label="Aumentar cantidad"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons - Con ícono de carrito */}
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? '12px' : '16px',
          marginBottom: isMobile ? '24px' : '40px',
          alignItems: 'stretch'
        }}>
          <a
            href={waLink}
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: isMobile ? '8px' : '12px',
              background: 'linear-gradient(135deg, #25D366, #128C7E)',
              color: '#fff',
              padding: isMobile ? '14px 16px' : '16px 24px',
              borderRadius: '10px',
              fontWeight: 600,
              textDecoration: 'none',
              fontSize: isMobile ? '14px' : 'clamp(14px, 2vw, 16px)',
              textAlign: 'center',
              boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)',
              transition: 'all 0.3s ease',
              border: 'none',
              cursor: 'pointer',
              width: '100%'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(37, 211, 102, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 211, 102, 0.3)';
            }}
          >
            {/* Ícono de carrito SVG - IGUAL que en ProductCard */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"/>
              <circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: isMobile ? '15px' : '16px' }}>Comprar por WhatsApp</div>
              <div style={{ fontSize: isMobile ? '13px' : '14px', opacity: 0.9 }}>Total: ${total}</div>
            </div>
          </a>
          
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: isMobile ? '6px' : '10px',
              background: '#fff',
              color: '#374151',
              padding: isMobile ? '14px 16px' : '16px 24px',
              borderRadius: '10px',
              textDecoration: 'none',
              fontSize: isMobile ? '14px' : 'clamp(14px, 2vw, 16px)',
              textAlign: 'center',
              fontWeight: 500,
              border: '2px solid #e5e7eb',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              width: '100%'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.borderColor = '#d1d5db';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = '#e5e7eb';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <span style={{ fontSize: isMobile ? '18px' : '20px' }}>←</span>
            Seguir comprando
          </Link>
        </div>

        {/* Product Description */}
        <div style={{
          background: '#fff',
          padding: isMobile ? '20px' : '32px',
          borderRadius: '12px',
          marginBottom: isMobile ? '24px' : '40px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{
            margin: '0 0 16px 0',
            fontSize: isMobile ? '18px' : 'clamp(20px, 3vw, 24px)',
            fontWeight: 700,
            color: '#111827',
            paddingBottom: isMobile ? '12px' : '16px',
            borderBottom: '2px solid #f3f4f6'
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
            
            {/* MercadoLibre Banner - REORGANIZADO con logo debajo del título */}
            <div style={{
              backgroundColor: '#f8fafc',
              borderRadius: '12px',
              padding: isMobile ? '20px' : '24px',
              marginTop: isMobile ? '20px' : '28px',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: isMobile ? '16px' : '20px',
                flexDirection: 'column'
              }}>
                {/* Título y logo en columna */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: isMobile ? '12px' : '16px',
                  width: '100%'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: isMobile ? '10px' : '12px'
                  }}>
                    <h4 style={{
                      margin: 0,
                      fontSize: isMobile ? '16px' : '18px',
                      fontWeight: 600,
                      color: '#374151'
                    }}>
                      También en MercadoLibre
                    </h4>
                  </div>
                  
                  {/* LOGO SVG DE MERCADOLIBRE - MÁS GRANDE */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: isMobile ? '12px' : '16px',
                    backgroundColor: '#f0f9ff',
                    borderRadius: '8px',
                    border: '1px solid #bae6fd',
                    width: '100%'
                  }}>
                    <img 
                      src="/mercado-libre-logo.svg" 
                      alt="MercadoLibre Logo"
                      style={{
                        width: isMobile ? '32px' : '40px',
                        height: isMobile ? '32px' : '40px',
                        objectFit: 'contain'
                      }}
                    />
                    <div style={{
                      fontSize: isMobile ? '12px' : '14px',
                      color: '#64748b',
                      lineHeight: 1.5
                    }}>
                      Disponible también en MercadoLibre, aunque con un precio ligeramente mayor.
                    </div>
                  </div>
                </div>
                
                <div style={{ 
                  width: '100%'
                }}>
                  <a 
                    href={product.mercadoLibreUrl}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: '#0284c7',
                      textDecoration: 'none',
                      fontWeight: 500,
                      fontSize: isMobile ? '12px' : '14px',
                      wordBreak: 'break-all',
                      padding: isMobile ? '10px 12px' : '12px 16px',
                      backgroundColor: '#f0f9ff',
                      borderRadius: '8px',
                      border: '1px solid #bae6fd',
                      width: '100%',
                      boxSizing: 'border-box'
                    }}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={product.mercadoLibreUrl}
                  >
                    <span style={{ 
                      fontSize: isMobile ? '14px' : '16px',
                      flexShrink: 0
                    }}>🔗</span>
                    <span style={{
                      flex: 1,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {isMobile ? shortenUrl(product.mercadoLibreUrl) : product.mercadoLibreUrl}
                    </span>
                  </a>
                  
                  <div style={{
                    marginTop: '12px',
                    fontSize: isMobile ? '11px' : '13px',
                    color: '#94a3b8',
                    fontStyle: 'italic'
                  }}>
                    (Precio más alto debido a comisiones de la plataforma)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}