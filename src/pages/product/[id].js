import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { PRODUCTS } from '../product-data';

export default function ProductPage() {
  const { query } = useRouter()
  const product = PRODUCTS[query.id]

  // 1) No mostrar si no existe o published === false
  if (!product || product.published === false) {
    return (
      <main style={{
        padding: '60px 24px',
        textAlign: 'center',
        minHeight: '80vh',
        backgroundColor: '#f9fafb',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <h1 style={{
          fontSize: 'clamp(24px, 5vw, 36px)',
          color: '#111827',
          marginBottom: '16px'
        }}>
          Producto no disponible
        </h1>
        <p style={{
          fontSize: 'clamp(16px, 4vw, 18px)',
          color: '#6b7280',
          marginBottom: '32px',
          maxWidth: '500px'
        }}>
          Este producto no está publicado actualmente o no se encuentra en nuestro catálogo.
        </p>
        <Link
          href="/"
          style={{
            display: 'inline-block',
            padding: '14px 32px',
            background: 'linear-gradient(135deg, #7c3aed, #5b21b6)',
            color: 'white',
            borderRadius: '10px',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '16px',
            boxShadow: '0 4px 12px rgba(124, 58, 237, 0.2)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(124, 58, 237, 0.3)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(124, 58, 237, 0.2)'
          }}
        >
          Volver al inicio
        </Link>
      </main>
    )
  }

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

  // Calcular si es TOP VENTA
  const cantidadVendida = product.cantidad_vendida || product.sold_quantity || 0;
  const esTopVenta = cantidadVendida > 1000;

  // Calcular precio mayorista para la cantidad actual
  const precioMayorista = product.precio_mayorista || 0;
  const cantidadMinimaMayorista = product.cantidad_minima_mayorista || 12;
  const esMayorista = qty >= cantidadMinimaMayorista;
  const precioUnitarioFinal = esMayorista ? precioMayorista : product.price;
  const totalMayorista = (precioMayorista * qty).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const priceStr = product.price.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  const mlPriceStr = product.ml_price ? product.ml_price.toLocaleString('es-AR') : ''
  const total = (product.price * qty).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  const precioMayoristaStr = precioMayorista.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  const message = esMayorista
    ? `Hola, quiero comprar al MAYOR *${product.name}* (SKU: ${product.sku})\nCantidad: ${qty} unidades (Precio mayorista)\nPrecio unitario: $${precioMayoristaStr}\nTotal: $${totalMayorista}`
    : `Hola, quiero comprar *${product.name}* (SKU: ${product.sku})\nCantidad: ${qty}\nPrecio unitario: $${priceStr}\nTotal: $${total}`
  const waBase = "https://wa.me/5491178267112"
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

  // Calcular porcentaje de descuento mayorista
  const descuentoMayorista = Math.round((1 - precioMayorista / product.price) * 100);
  // Calcular ahorro vs MercadoLibre
  const ahorroVsML = product.ml_price ? product.ml_price - precioMayorista : 0;

  return (
    <main className="product-page" style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>

      {/* Header */}
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

        {/* Main Content Grid - IMAGEN A LA IZQUIERDA */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: isMobile ? '16px' : '24px',
          marginBottom: '32px',
        }}>

          {/* COLUMNA IZQUIERDA: Imagen del producto */}
          <div style={{
            position: 'relative',
            minHeight: isMobile ? '300px' : '450px'
          }}>
            <div style={{
              background: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: isMobile ? '8px' : '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              height: '100%',
              minHeight: isMobile ? '300px' : '450px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
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

            {/* Badge de TOP VENTA en la imagen */}
            {esTopVenta && (
              <div style={{
                position: 'absolute',
                top: isMobile ? '16px' : '20px',
                left: isMobile ? '16px' : '20px',
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: 'white',
                padding: isMobile ? '6px 12px' : '8px 16px',
                borderRadius: '20px',
                fontSize: isMobile ? '12px' : '14px',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4)',
                zIndex: 2,
                animation: 'topPulse 2s infinite'
              }}>
                <span>🔥</span>
                <span>TOP VENTA</span>
              </div>
            )}

            {/* 🔥 MODIFICADO: Badge de cantidad vendida en la imagen (no en el título) */}
            <div style={{
              position: 'absolute',
              top: isMobile ? '16px' : '20px',
              right: isMobile ? '16px' : '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: isMobile ? '8px 12px' : '10px 16px',
              background: esTopVenta ? '#fef3c7' : '#f9fafb',
              borderRadius: '20px',
              border: esTopVenta ? '2px solid #f59e0b' : '1px solid #e5e7eb',
              minWidth: 'fit-content',
              zIndex: 2
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <div style={{
                  width: '10px',
                  height: '10px',
                  background: esTopVenta ? '#f59e0b' : '#059669',
                  borderRadius: '50%',
                  animation: esTopVenta ? 'topDotPulse 1.5s infinite' : 'none'
                }}></div>
                <span style={{
                  fontSize: isMobile ? '14px' : '16px',
                  fontWeight: 700,
                  color: esTopVenta ? '#b45309' : '#374151',
                  whiteSpace: 'nowrap'
                }}>
                  {cantidadVendida.toLocaleString('es-AR')} vendidos
                </span>
              </div>
              {esTopVenta && (
                <span style={{
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  color: 'white',
                  padding: '3px 10px',
                  borderRadius: '12px',
                  fontSize: isMobile ? '10px' : '11px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  TOP
                </span>
              )}
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
                    background: 'rgba(255, 255, 255, 0.95)',
                    color: '#374151',
                    border: '1px solid #e5e7eb',
                    padding: isMobile ? '8px' : '12px',
                    cursor: 'pointer',
                    borderRadius: '50%',
                    width: isMobile ? '36px' : '48px',
                    height: isMobile ? '36px' : '48px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    transition: 'all 0.2s ease',
                    fontSize: isMobile ? '16px' : '18px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#fff'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.95)'}
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
                    background: 'rgba(255, 255, 255, 0.95)',
                    color: '#374151',
                    border: '1px solid #e5e7eb',
                    padding: isMobile ? '8px' : '12px',
                    cursor: 'pointer',
                    borderRadius: '50%',
                    width: isMobile ? '36px' : '48px',
                    height: isMobile ? '36px' : '48px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    transition: 'all 0.2s ease',
                    fontSize: isMobile ? '16px' : '18px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#fff'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.95)'}
                  onClick={goToNext}
                  aria-label="Siguiente imagen"
                >
                  →
                </button>
              </>
            )}
          </div>

          {/* COLUMNA DERECHA: Información del producto */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}>
            {/* Sección de información del producto */}
            <div style={{
              background: '#fff',
              padding: isMobile ? '20px' : '28px',
              borderRadius: '12px',
              height: 'fit-content',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}>
              <h1 style={{
                margin: '0 0 12px 0',
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

                {/* Info rápida de mayorista */}
                {product.precio_mayorista && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: isMobile ? '3px 8px' : '4px 10px',
                    backgroundColor: '#ecfdf5',
                    color: '#059669',
                    fontSize: isMobile ? '10px' : '12px',
                    borderRadius: '4px',
                    fontWeight: 600,
                    border: '1px solid #a7f3d0'
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                      <line x1="1" y1="10" x2="23" y2="10" />
                    </svg>
                    <span>MAYORISTA DISPONIBLE</span>
                  </div>
                )}
              </div>

              {/* 🔥 MODIFICADO: Precios en 3 líneas */}
              <div style={{
                marginBottom: '20px'
              }}>
                {/* Línea 1: Precio normal */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '6px'
                }}>
                  <span style={{
                    fontSize: isMobile ? '14px' : '16px',
                    fontWeight: 600,
                    color: '#374151',
                    whiteSpace: 'nowrap'
                  }}>
                    Precio:
                  </span>
                  <span style={{
                    fontSize: isMobile ? '24px' : 'clamp(28px, 4vw, 32px)',
                    fontWeight: 700,
                    color: '#111827',
                    whiteSpace: 'nowrap'
                  }}>
                    ${priceStr}
                  </span>
                </div>

                {/* Línea 2: Precio mayorista con descuento */}
                {product.precio_mayorista && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '6px'
                  }}>
                    <span style={{
                      fontSize: isMobile ? '14px' : '16px',
                      fontWeight: 600,
                      color: '#374151',
                      whiteSpace: 'nowrap'
                    }}>
                      Mayorista:
                    </span>
                    <span style={{
                      fontSize: isMobile ? '20px' : 'clamp(22px, 3vw, 24px)',
                      fontWeight: 700,
                      color: '#059669',
                      whiteSpace: 'nowrap'
                    }}>
                      ${precioMayoristaStr}
                    </span>
                    <span style={{
                      fontSize: isMobile ? '12px' : '14px',
                      fontWeight: 800,
                      color: '#dc2626',
                      backgroundColor: '#fee2e2',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      marginLeft: '4px'
                    }}>
                      -{descuentoMayorista}%
                    </span>
                  </div>
                )}

                {/* Línea 3: Precio MercadoLibre */}
                {product.ml_price && product.mercadoLibreUrl && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '6px'
                  }}>
                    <span style={{
                      fontSize: isMobile ? '14px' : '16px',
                      fontWeight: 600,
                      color: '#374151',
                      whiteSpace: 'nowrap'
                    }}>
                      Precio en MercadoLibre:
                    </span>
                    <a
                      href={product.mercadoLibreUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontSize: isMobile ? '14px' : '16px',
                        fontWeight: 600,
                        color: '#dc2626',
                        textDecoration: 'line-through',
                        whiteSpace: 'nowrap',
                        textDecoration: 'none'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.textDecoration = 'underline';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.textDecoration = 'none';
                      }}
                    >
                      ${mlPriceStr}
                    </a>
                  </div>
                )}
              </div>

              {/* Envío gratis */}
              {product.envioGratis && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: isMobile ? '6px 12px' : '8px 14px',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  borderRadius: '20px',
                  color: 'white',
                  fontSize: isMobile ? '11px' : '13px',
                  fontWeight: 700,
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                  whiteSpace: 'nowrap',
                  marginBottom: '20px',
                  width: 'fit-content'
                }}>
                  <svg
                    width={isMobile ? "16" : "18"}
                    height={isMobile ? "16" : "18"}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="1" y="3" width="15" height="13" rx="2" />
                    <path d="M16 8h4l2 4v5h-2" />
                    <circle cx="5.5" cy="18.5" r="2.5" />
                    <circle cx="18.5" cy="18.5" r="2.5" />
                    <path d="M8 8h8" />
                    <path d="M3 16h4" />
                  </svg>
                  <span style={{
                    fontSize: isMobile ? '12px' : '13px',
                    fontWeight: 700,
                  }}>
                    ENVÍO GRATIS
                  </span>
                </div>
              )}

              {/* Selector de cantidad */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: isMobile ? '12px' : '16px',
                marginBottom: isMobile ? '20px' : '28px',
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

                {/* Info de cantidad mayorista al lado */}
                {product.precio_mayorista && (
                  <div style={{
                    fontSize: isMobile ? '12px' : '13px',
                    color: esMayorista ? '#059669' : '#d97706',
                    fontWeight: 600,
                    padding: isMobile ? '6px 10px' : '8px 12px',
                    backgroundColor: esMayorista ? '#dcfce7' : '#fef3c7',
                    borderRadius: '6px',
                    border: esMayorista ? '1px solid #86efac' : '1px solid #fbbf24'
                  }}>
                    {esMayorista ? (
                      <span>✅ Precio mayorista aplicado</span>
                    ) : (
                      <span>📦 Mínimo {cantidadMinimaMayorista} unidades para mayorista</span>
                    )}
                  </div>
                )}
              </div>

              {/* Sección de Oferta Mayorista */}
              {product.precio_mayorista && (
                <div style={{
                  backgroundColor: '#f8fafc',
                  borderRadius: '10px',
                  padding: isMobile ? '16px' : '20px',
                  marginBottom: isMobile ? '20px' : '28px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '16px',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}>
                      <div style={{
                        width: isMobile ? '32px' : '36px',
                        height: isMobile ? '32px' : '36px',
                        backgroundColor: '#0ea5e9',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: isMobile ? '16px' : '18px'
                      }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="2" y="7" width="20" height="14" rx="2" />
                          <path d="M16 3V7" />
                          <path d="M8 3V7" />
                          <path d="M3 11h18" />
                        </svg>
                      </div>
                      <div>
                        <h3 style={{
                          margin: 0,
                          fontSize: isMobile ? '15px' : '16px',
                          fontWeight: 600,
                          color: '#0369a1'
                        }}>
                          Oferta Mayorista
                        </h3>
                      </div>
                    </div>

                    <div style={{
                      textAlign: 'center',
                      padding: isMobile ? '6px 10px' : '8px 12px',
                      backgroundColor: '#dcfce7',
                      borderRadius: '8px',
                      border: '1px solid #86efac'
                    }}>
                      <div style={{
                        fontSize: isMobile ? '11px' : '12px',
                        color: '#059669',
                        fontWeight: 600,
                        marginBottom: '4px'
                      }}>
                        Precio unitario
                      </div>
                      <div style={{
                        fontSize: isMobile ? '18px' : '20px',
                        fontWeight: 700,
                        color: '#065f46'
                      }}>
                        ${precioMayoristaStr}
                      </div>
                    </div>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
                    gap: isMobile ? '10px' : '12px',
                    marginBottom: '16px'
                  }}>
                    <div style={{
                      backgroundColor: 'white',
                      padding: isMobile ? '10px' : '12px',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                      textAlign: 'center'
                    }}>
                      <div style={{
                        fontSize: isMobile ? '11px' : '12px',
                        color: '#6b7280',
                        marginBottom: '6px',
                        fontWeight: 500
                      }}>
                        Cantidad mínima
                      </div>
                      <div style={{
                        fontSize: isMobile ? '16px' : '18px',
                        fontWeight: 600,
                        color: '#0ea5e9'
                      }}>
                        {cantidadMinimaMayorista}+ unidades
                      </div>
                    </div>

                    <div style={{
                      backgroundColor: 'white',
                      padding: isMobile ? '10px' : '12px',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                      textAlign: 'center'
                    }}>
                      <div style={{
                        fontSize: isMobile ? '11px' : '12px',
                        color: '#6b7280',
                        marginBottom: '6px',
                        fontWeight: 500
                      }}>
                        Ahorro por unidad
                      </div>
                      <div style={{
                        fontSize: isMobile ? '16px' : '18px',
                        fontWeight: 600,
                        color: '#059669'
                      }}>
                        ${(product.price - precioMayorista).toLocaleString('es-AR')}
                      </div>
                    </div>

                    <div style={{
                      backgroundColor: 'white',
                      padding: isMobile ? '10px' : '12px',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                      textAlign: 'center'
                    }}>
                      <div style={{
                        fontSize: isMobile ? '11px' : '12px',
                        color: '#6b7280',
                        marginBottom: '6px',
                        fontWeight: 500
                      }}>
                        Envío
                      </div>
                      <div style={{
                        fontSize: isMobile ? '14px' : '16px',
                        fontWeight: 600,
                        color: '#10b981'
                      }}>
                        GRATIS
                      </div>
                    </div>
                  </div>

                  <div style={{
                    padding: isMobile ? '10px' : '12px',
                    backgroundColor: esMayorista ? '#dcfce7' : '#fef3c7',
                    borderRadius: '8px',
                    border: esMayorista ? '1px solid #86efac' : '1px solid #fbbf24',
                    textAlign: 'center'
                  }}>
                    <div style={{
                      fontSize: isMobile ? '12px' : '13px',
                      fontWeight: 600,
                      color: esMayorista ? '#065f46' : '#92400e',
                      marginBottom: '8px'
                    }}>
                      {esMayorista ? (
                        '✅ ¡Ya calificas para precio mayorista!'
                      ) : (
                        `Faltan ${cantidadMinimaMayorista - qty} unidades para mayorista`
                      )}
                    </div>
                    <div style={{
                      width: '100%',
                      height: '6px',
                      backgroundColor: '#e5e7eb',
                      borderRadius: '3px',
                      overflow: 'hidden',
                      marginBottom: '6px'
                    }}>
                      <div style={{
                        width: `${Math.min(100, (qty / cantidadMinimaMayorista) * 100)}%`,
                        height: '100%',
                        background: esMayorista
                          ? '#10b981'
                          : '#f59e0b',
                        borderRadius: '3px',
                        transition: 'width 0.3s ease'
                      }}></div>
                    </div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: isMobile ? '10px' : '11px',
                      color: '#6b7280'
                    }}>
                      <span>Tú: {qty} unidades</span>
                      <span>Mínimo: {cantidadMinimaMayorista} unidades</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Botones de compra */}
            <div style={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              gap: isMobile ? '12px' : '16px',
              marginBottom: isMobile ? '24px' : '40px'
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
                  background: esMayorista
                    ? 'linear-gradient(135deg, #0ea5e9, #0284c7)'
                    : 'linear-gradient(135deg, #25D366, #128C7E)',
                  color: '#fff',
                  padding: isMobile ? '14px 16px' : '16px 24px',
                  borderRadius: '10px',
                  fontWeight: 600,
                  textDecoration: 'none',
                  fontSize: isMobile ? '14px' : 'clamp(14px, 2vw, 16px)',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  border: 'none',
                  cursor: 'pointer',
                  width: '100%',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {esMayorista && (
                  <div style={{
                    position: 'absolute',
                    top: '-6px',
                    right: isMobile ? '8px' : '12px',
                    background: '#f59e0b',
                    color: '#92400e',
                    padding: '3px 8px',
                    borderRadius: '12px',
                    fontSize: isMobile ? '10px' : '11px',
                    fontWeight: 800,
                    zIndex: 2
                  }}>
                    MAYORISTA
                  </div>
                )}

                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: isMobile ? '15px' : '16px' }}>
                    {esMayorista ? 'Comprar al MAYOR por WhatsApp' : 'Comprar por WhatsApp'}
                  </div>
                  <div style={{
                    fontSize: isMobile ? '13px' : '14px',
                    opacity: 0.9
                  }}>
                    Total: ${esMayorista ? totalMayorista : total}
                  </div>
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
                  border: '1px solid #e5e7eb',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  width: '100%'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.borderColor = '#d1d5db';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = '#e5e7eb';
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                Seguir comprando
              </Link>
            </div>
          </div>
        </div>

        {/* Características y Especificaciones */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : product.features.length <= 3 ? '1fr 1fr' : '1fr',
          gap: isMobile ? '16px' : '24px',
          marginBottom: '32px'
        }}>
          {/* Características principales - se muestra si hay pocas */}
          {product.features.length <= 3 && (
            <div style={{
              background: '#fff',
              padding: isMobile ? '20px' : '28px',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}>
              <h3 style={{
                margin: '0 0 16px 0',
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
          )}

          {/* Especificaciones */}
          <div style={{
            background: '#fff',
            padding: isMobile ? '20px' : '28px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}>
            <h3 style={{
              margin: '0 0 16px 0',
              fontSize: isMobile ? '16px' : '18px',
              fontWeight: 600,
              color: '#111827'
            }}>
              Especificaciones
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
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

          {/* Características principales - se muestra en columna completa si hay muchas */}
          {product.features.length > 3 && (
            <div style={{
              background: '#fff',
              padding: isMobile ? '20px' : '28px',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              gridColumn: isMobile ? '1' : '1 / span 2'
            }}>
              <h3 style={{
                margin: '0 0 16px 0',
                fontSize: isMobile ? '16px' : '18px',
                fontWeight: 600,
                color: '#111827'
              }}>
                Características principales
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
                gap: isMobile ? '12px' : '16px'
              }}>
                {product.features.map((feature, index) => (
                  <div key={index} style={{
                    padding: isMobile ? '10px' : '12px',
                    backgroundColor: '#f9fafb',
                    borderRadius: '8px'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px'
                    }}>
                      <div style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: '#7c3aed',
                        marginTop: '6px',
                        flexShrink: 0
                      }}></div>
                      <span style={{
                        fontSize: isMobile ? '14px' : '15px',
                        color: '#374151',
                        lineHeight: 1.5
                      }}>
                        {feature}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Product Description */}
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

            {/* 🔥 MODIFICADO: Sección de MercadoLibre reorganizada */}
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
                  {/* Información de MercadoLibre */}
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
                          fontSize: isMobile ? '16px' : '18px',
                          fontWeight: 600,
                          color: '#ef4444',
                          textDecoration: 'line-through'
                        }}>
                          ${mlPriceStr}
                        </div>
                      </div>

                      <div style={{
                        fontSize: isMobile ? '20px' : '24px',
                        color: '#d1d5db',
                        fontWeight: 300
                      }}>
                        →
                      </div>

                      <div style={{ textAlign: 'center' }}>
                        <div style={{
                          fontSize: isMobile ? '11px' : '12px',
                          color: '#6b7280',
                          marginBottom: '4px',
                          fontWeight: 500
                        }}>
                          Nuestro precio
                        </div>
                        <div style={{
                          fontSize: isMobile ? '16px' : '18px',
                          fontWeight: 600,
                          color: '#059669'
                        }}>
                          ${priceStr}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 🔥 NUEVO: Oferta Exclusiva como sección aparte */}
                  <div style={{
                    backgroundColor: '#f0f9ff',
                    borderRadius: '10px',
                    padding: isMobile ? '16px' : '20px',
                    border: '2px solid #bae6fd',
                    marginTop: '12px'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '12px',
                      flexWrap: 'wrap',
                      gap: '12px'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                      }}>
                        <div style={{
                          width: isMobile ? '40px' : '48px',
                          height: isMobile ? '40px' : '48px',
                          backgroundColor: '#0ea5e9',
                          borderRadius: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: isMobile ? '18px' : '20px'
                        }}>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="2" y="7" width="20" height="14" rx="2" />
                            <path d="M16 3V7" />
                            <path d="M8 3V7" />
                            <path d="M3 11h18" />
                          </svg>
                        </div>
                        <div>
                          <h5 style={{
                            margin: 0,
                            fontSize: isMobile ? '15px' : '16px',
                            fontWeight: 600,
                            color: '#0369a1'
                          }}>
                            Oferta Exclusiva: Precio al Mayor
                          </h5>
                          <p style={{
                            margin: '4px 0 0 0',
                            fontSize: isMobile ? '12px' : '13px',
                            color: '#0ea5e9',
                            fontWeight: 500
                          }}>
                            Aprovecha nuestro precio especial para revendedores
                          </p>
                        </div>
                      </div>

                      <div style={{
                        textAlign: 'center',
                        padding: isMobile ? '8px 12px' : '10px 16px',
                        backgroundColor: '#dcfce7',
                        borderRadius: '8px',
                        border: '2px solid #86efac'
                      }}>
                        <div style={{
                          fontSize: isMobile ? '11px' : '12px',
                          color: '#059669',
                          fontWeight: 600,
                          marginBottom: '4px'
                        }}>
                          Precio mayorista
                        </div>
                        <div style={{
                          fontSize: isMobile ? '18px' : '20px',
                          fontWeight: 700,
                          color: '#065f46'
                        }}>
                          ${precioMayoristaStr}
                        </div>
                      </div>
                    </div>

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
                      gap: isMobile ? '10px' : '12px',
                      marginTop: '12px'
                    }}>
                      <div style={{
                        backgroundColor: 'white',
                        padding: isMobile ? '10px' : '12px',
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb',
                        textAlign: 'center'
                      }}>
                        <div style={{
                          fontSize: isMobile ? '11px' : '12px',
                          color: '#6b7280',
                          marginBottom: '6px',
                          fontWeight: 500
                        }}>
                          Mínimo de compra
                        </div>
                        <div style={{
                          fontSize: isMobile ? '16px' : '18px',
                          fontWeight: 600,
                          color: '#0ea5e9'
                        }}>
                          {cantidadMinimaMayorista} unidades
                        </div>
                      </div>

                      <div style={{
                        backgroundColor: 'white',
                        padding: isMobile ? '10px' : '12px',
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb',
                        textAlign: 'center'
                      }}>
                        <div style={{
                          fontSize: isMobile ? '11px' : '12px',
                          color: '#6b7280',
                          marginBottom: '6px',
                          fontWeight: 500
                        }}>
                          Ahorro vs. MercadoLibre
                        </div>
                        <div style={{
                          fontSize: isMobile ? '16px' : '18px',
                          fontWeight: 600,
                          color: '#059669'
                        }}>
                          ${ahorroVsML.toLocaleString('es-AR')}
                        </div>
                      </div>

                      <div style={{
                        backgroundColor: 'white',
                        padding: isMobile ? '10px' : '12px',
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb',
                        textAlign: 'center'
                      }}>
                        <div style={{
                          fontSize: isMobile ? '11px' : '12px',
                          color: '#6b7280',
                          marginBottom: '6px',
                          fontWeight: 500
                        }}>
                          Beneficio adicional
                        </div>
                        <div style={{
                          fontSize: isMobile ? '14px' : '16px',
                          fontWeight: 600,
                          color: '#10b981',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px'
                        }}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="1" y="3" width="15" height="13" rx="2" />
                            <path d="M16 8h4l2 4v5h-2" />
                            <circle cx="5.5" cy="18.5" r="2.5" />
                            <circle cx="18.5" cy="18.5" r="2.5" />
                          </svg>
                          <span>ENVÍO GRATIS</span>
                        </div>
                      </div>
                    </div>

                    {/* 🔥 NUEVO: Nota sobre el 50% de seña */}
                    <div style={{
                      marginTop: '16px',
                      padding: isMobile ? '10px' : '12px',
                      backgroundColor: '#fef3c7',
                      borderRadius: '8px',
                      border: '1px solid #fbbf24'
                    }}>
                      <p style={{
                        margin: 0,
                        fontSize: isMobile ? '12px' : '13px',
                        color: '#92400e',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '8px'
                      }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="12" y1="16" x2="12" y2="12" />
                          <line x1="12" y1="8" x2="12.01" y2="8" />
                        </svg>
                        <span>
                          <strong>IMPORTANTE:</strong> TODAS LAS COMPRAS AL MAYOR REQUIEREN 50% DE SEÑA AL MOMENTO DEL PEDIDO
                        </span>
                      </p>
                    </div>

                    {/* Nota informativa */}
                    <div style={{
                      marginTop: '12px',
                      padding: isMobile ? '10px' : '12px',
                      backgroundColor: '#fef3c7',
                      borderRadius: '8px',
                      border: '1px solid #fbbf24'
                    }}>
                      <p style={{
                        margin: 0,
                        fontSize: isMobile ? '12px' : '13px',
                        color: '#92400e',
                        fontWeight: 500,
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '8px'
                      }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="12" y1="16" x2="12" y2="12" />
                          <line x1="12" y1="8" x2="12.01" y2="8" />
                        </svg>
                        <span>
                          <strong>Consejo para revendedores:</strong> Comprando al por mayor no solo ahorras ${ahorroVsML.toLocaleString('es-AR')} por unidad vs. MercadoLibre,
                          sino que también recibes <strong>envío gratis</strong> y atención personalizada directa con nosotros.
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Link a MercadoLibre */}
                  <div style={{ width: '100%' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '12px',
                      marginBottom: '8px'
                    }}>
                      <span style={{
                        fontSize: isMobile ? '13px' : '14px',
                        color: '#64748b',
                        fontWeight: 500
                      }}>
                        Enlace al producto en MercadoLibre:
                      </span>
                      <span style={{
                        fontSize: isMobile ? '12px' : '13px',
                        color: '#94a3b8',
                        fontStyle: 'italic'
                      }}>
                        (Para comparar precios y ver reviews)
                      </span>
                    </div>

                    <a
                      href={product.mercadoLibreUrl}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '10px',
                        color: '#0284c7',
                        textDecoration: 'none',
                        fontWeight: 500,
                        fontSize: isMobile ? '13px' : '14px',
                        wordBreak: 'break-all',
                        padding: isMobile ? '12px' : '14px 16px',
                        backgroundColor: '#f0f9ff',
                        borderRadius: '8px',
                        border: '1px solid #bae6fd',
                        width: '100%',
                        boxSizing: 'border-box',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.backgroundColor = '#e0f2fe';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.backgroundColor = '#f0f9ff';
                      }}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={product.mercadoLibreUrl}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                      <span style={{
                        flex: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {isMobile ? shortenUrl(product.mercadoLibreUrl) : product.mercadoLibreUrl}
                      </span>
                      <span style={{
                        fontSize: isMobile ? '12px' : '13px',
                        color: '#64748b',
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        Abrir ↗
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes topPulse {
          0%, 100% {
            box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
            transform: scale(1);
          }
          50% {
            box-shadow: 0 6px 16px rgba(245, 158, 11, 0.5);
            transform: scale(1.05);
          }
        }
        
        @keyframes topDotPulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.2);
          }
        }
        
        /* Mejora visual para el input de cantidad */
        input[type="number"]::-webkit-outer-spin-button,
        input[type="number"]::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        
        input[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>
    </main>
  )
}