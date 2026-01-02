import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { PRODUCTS } from '../product-data'

export default function ProductPage() {
  const { query } = useRouter()
  const product = PRODUCTS[query.id]
  const [qty, setQty] = useState(1)
  const [buttonFontSize, setButtonFontSize] = useState('16px');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 600) {
        setButtonFontSize('14px');
      } else {
        setButtonFontSize('16px');
      }
    };

    // Set initial size
    handleResize();

    // Listen for resize events
    window.addEventListener('resize', handleResize);

    // Clean up the event listener
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  if (!product) return (
    <main style={{ padding: 24 }}>
      <p>Producto no encontrado — <Link href='/'>Volver</Link></p>
    </main>
  )

  const priceStr = product.price.toLocaleString('es-AR', {minimumFractionDigits: 2,maximumFractionDigits: 2})
  const total = (product.price * qty).toLocaleString('es-AR', {minimumFractionDigits: 2,maximumFractionDigits: 2})
  const message = `Hola, quiero comprar *${product.name}* (SKU: ${product.sku})\nCantidad: ${qty}\nPrecio unitario: $${priceStr}\nTotal: $${total}`
  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ''
  const waBase = waNumber ? `https://wa.me/${waNumber}` : 'https://wa.me/'
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


  return (
    <main className="product-page" style={{ padding: '20px 0', margin: '0 auto' }}>
      <div style={{ padding: '0 20px' }}>
        <nav style={{ color: '#6b7280', marginBottom: 20, fontSize: '14px' }}>
          <Link href="/" style={{ textDecoration: 'none', color: '#6b7280' }}>Inicio</Link>
          <span style={{ margin: '0 8px' }}>/</span>
          <span style={{ color: '#111827' }}>{product.name}</span>
        </nav>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 40,
        padding: '0 20px',
        width: '80%',
        margin: '0 auto'
      }}>
        {/* Sección de imagen */}
        <div style={{ marginBottom: '20px', position: 'relative', height: '500px' }}>
          <div style={{
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: 12,
            padding: 30,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            height: '100%'
          }}>
            <img
              src={product.image[currentImageIndex]}
              alt={product.name}
              style={{
                maxWidth: '500px',
                maxHeight: '500px',
                objectFit: 'contain',
                transition: 'opacity 0.5s ease-in-out'
              }}
            />
          </div>
          <button
            style={{
              position: 'absolute',
              top: '50%',
              left: '10px',
              transform: 'translateY(-50%)',
              background: 'rgba(0, 0, 0, 0.5)',
              color: '#fff',
              border: 'none',
              padding: '10px',
              cursor: 'pointer'
            }}
            onClick={goToPrevious}
          >
            &lt;
          </button>
          <button
            style={{
              position: 'absolute',
              top: '50%',
              right: '10px',
              transform: 'translateY(-50%)',
              background: 'rgba(0, 0, 0, 0.5)',
              color: '#fff',
              border: 'none',
              padding: '10px',
              cursor: 'pointer'
            }}
            onClick={goToNext}
          >
            &gt;
          </button>
        </div>

        {/* Sección de información */}
        <div style={{height: '100%'}}>
          <div style={{ background: '#fff', padding: 30, borderRadius: 12, height: '100%' }}>
            <h1 style={{
              margin: '0 0 10px 0',
              fontSize: '28px',
              fontWeight: 700,
              color: '#111827'
            }}>
              {product.name}
            </h1>

            <p style={{
              margin: '0 0 15px 0',
              color: '#6b7280',
              fontSize: '14px',
              fontWeight: 500
            }}>
              SKU: <span style={{ color: '#111827' }}>{product.sku}</span>
            </p>

            <p style={{
              fontSize: '32px',
              fontWeight: 700,
              margin: '20px 0',
              color: '#111827'
            }}>
              ${priceStr}
            </p>

            {/* Características principales */}
            <div style={{ marginBottom: 25 }}>
              <h3 style={{
                margin: '0 0 12px 0',
                fontSize: '16px',
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
                    marginBottom: '8px',
                    paddingLeft: '20px',
                    position: 'relative'
                  }}>
                    <span style={{
                      position: 'absolute',
                      left: 0,
                      top: '6px',
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: '#25D366'
                    }}></span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Especificaciones */}
            <div>
              <h3 style={{
                margin: '0 0 12px 0',
                fontSize: '16px',
                fontWeight: 600,
                color: '#111827'
              }}>
                Especificaciones
              </h3>
              <ul style={{
                margin: 0,
                padding: 0,
                listStyle: 'none',
                color: '#374151'
              }}>
                {Object.entries(product.specifications).map(([key, value]) => (
                  <li key={key} style={{
                    marginBottom: '8px',
                    paddingLeft: '20px',
                    position: 'relative'
                  }}>
                    <span style={{
                      position: 'absolute',
                      left: 0,
                      top: '6px',
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: '#25D366'
                    }}></span>
                    {key}: {value}
                  </li>
                ))}
              </ul>
            </div>

            {/* Selector de cantidad */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 15,
              marginBottom: 25
            }}>
              <label style={{
                color: '#111827',
                fontSize: '16px',
                fontWeight: 600,
                minWidth: '80px'
              }}>
                Cantidad
              </label>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <button
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  style={{
                    width: 40,
                    height: 40,
                    border: '1px solid #d1d5db',
                    background: '#f9fafb',
                    borderRadius: '6px',
                    fontSize: '18px',
                    fontWeight: 'bold'
                  }}
                >
                  −
                </button>
                <input
                  type="number"
                  value={qty}
                  min="1"
                  onChange={e => setQty(Math.max(1, Number(e.target.value || 1)))}
                  style={{
                    width: 60,
                    textAlign: 'center',
                    padding: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '16px'
                  }}
                />
                <button
                  onClick={() => setQty(q => q + 1)}
                  style={{
                    width: 40,
                    height: 40,
                    border: '1px solid #d1d5db',
                    background: '#f9fafb',
                    borderRadius: '6px',
                    fontSize: '18px',
                    fontWeight: 'bold'
                  }}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botones de acción - Contenedor */}
      <div style={{
        display: 'flex',
        gap: 12,
        marginBottom: 30,
        padding: '0 20px',
        margin: '20px auto',
        width: '80%',
        justifyContent: 'center'
      }}>
        <a
          href={waLink}
          target="_blank"
          rel="noreferrer"
          style={{
            display: 'inline-block',
            background: '#25D366',
            color: '#fff',
            padding: '15px 24px',
            borderRadius: '8px',
            fontWeight: 600,
            textDecoration: 'none',
            fontSize: buttonFontSize,
            flex: 1,
            textAlign: 'center'
          }}
        >
          Comprar por WhatsApp — ${total}
        </a>
        <Link
          href="/"
          style={{
            textDecoration: 'none',
            color: '#374151',
            padding: '15px 20px',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            textAlign: 'center',
            fontSize: buttonFontSize,
            fontWeight: 500
          }}
        >
          Seguir comprando
        </Link>
      </div>

      {/* Descripción detallada */}
      <div style={{
        background: '#fff',
        padding: 30,
        borderRadius: 12,
        marginTop: 20,
        padding: '0 20px',
        margin: '0 auto',
        width: '80%'
      }}>
        <h3 style={{
          margin: '0 0 15px 0',
          fontSize: '20px',
          fontWeight: 600,
          color: '#111827',
          textAlign: 'center'
        }}>
          Descripción del producto
        </h3>
        <div style={{
          color: '#374151',
          lineHeight: '1.6',
          fontSize: '16px'
        }}>
          {product.description.split('\n').map((paragraph, index) => (
            <p key={index} style={{ margin: '0 0 15px 0' }}>
              {paragraph}
            </p>
          ))}
          <div style={{
            backgroundColor: '#f0f0f0',
            borderRadius: '8px',
            padding: '10px',
            display: 'flex',
            alignItems: 'center'
          }}>
            <img
              src="/mercado-libre-logo.svg"
              alt="MercadoLibre Logo"
              style={{
                height: '20px',
                marginRight: '10px'
              }}
            />
            <p style={{ margin: 0 }}>Puedes conseguir este mismo producto en MercadoLibre.com aunque a un precio un poco mayor, te dejamos un link por si deseas hacer la compra usando Mercadolibre: <a href={product.mercadoLibreUrl}>{product.mercadoLibreUrl}</a></p>
          </div>
        </div>
      </div>
    </main>
  )
}