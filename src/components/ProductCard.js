import Link from 'next/link'

export default function ProductCard({ product }) {
  if (!product.published) return null;

  const message = `Hola, quiero comprar: ${product.name} (SKU: ${product.sku}) - $${(product.price || 0).toLocaleString('es-AR', {minimumFractionDigits: 2,maximumFractionDigits: 2})}`
  const waBase = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`
  const waLink = `${waBase}?text=${encodeURIComponent(message)}`
  const mlLink = product.mercadoLibreUrl || product.permalink;
  const esTopVenta = product.top_seller || false;

  return (
    <div style={{ 
      width: '100%', 
      height: '100%',
      display: 'flex', 
      justifyContent: 'center' 
    }}>
      {/* ✅ CONTENEDOR CON BORDE FINO */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        width: '100%',
        minHeight: '600px',
        padding: '16px', // ✅ ESPACIADO INTERNO
        background: '#ffffff',
        border: '1px solid #e5e7eb', // ✅ LÍNEA FINA
        borderRadius: '16px', // ✅ ESQUINAS REDONDEADAS
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)' // ✅ SOMBRA SUTIL
      }}>
        {/* Imagen - ALTURA FIJA */}
        <div style={{
          height: 200,
          background: '#f8fafc',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 16,
          borderRadius: '12px',
          overflow: 'hidden',
          border: '1px solid #e5e7eb'
        }}>
          {product.image && product.image[0] ? (
            <img
              src={product.image[0]}
              alt={product.name}
              style={{
                maxHeight: '100%',
                maxWidth: '100%',
                objectFit: 'contain',
                padding: '8px'
              }}
            />
          ) : (
            <span style={{ color: '#9ca3af', fontSize: '14px' }}>Sin imagen</span>
          )}
        </div>
        
        {/* Título - PEGADO A DESCRIPCIÓN */}
        <div style={{ 
          marginBottom: 4, // ✅ MUY CERCA (era 8px)
          height: '72px',
          overflow: 'hidden'
        }}>
          <h3 style={{
            margin: 0,
            fontSize: '16px',
            fontWeight: 700,
            color: '#111827',
            lineHeight: '1.4',
            height: '72px',
            display: '-webkit-box',
            WebkitLineClamp: 4,
            WebkitBoxOrient: 'vertical'
          }}>
            {product.name || 'Sin nombre'}
          </h3>
        </div>
        
        {/* Descripción - PEGADA A TÍTULO */}
        <div style={{
          margin: '0 0 12px 0', // ✅ SIN MARGEN ARRIBA
          color: '#6b7280',
          fontSize: '14px',
          lineHeight: '1.4',
          height: '40px',
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical'
        }}>
          {product.desc || 'Sin descripción disponible'}
        </div>
        
        {/* Precio con "Precio:" + Envío */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '12px',
          minHeight: '32px',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '12px', color: '#6b7280', marginBottom: '2px' }}>Precio:</span>
            <p style={{
              margin: '0',
              fontWeight: 700,
              fontSize: '22px',
              color: '#059669',
              whiteSpace: 'nowrap'
            }}>
              ${(product.price || 0).toLocaleString('es-AR', {minimumFractionDigits: 2,maximumFractionDigits: 2})}
            </p>
          </div>
          
          {product.envioGratis && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px 6px 12px',
              background: 'linear-gradient(135deg, #f97316, #fbbf24)',
              borderRadius: '20px',
              color: 'white',
              fontSize: '12px',
              fontWeight: 700,
              boxShadow: '0 4px 12px rgba(249, 115, 22, 0.3)',
              whiteSpace: 'nowrap',
              animation: 'envioPulse 2s infinite'
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'envioMove 1.8s ease-in-out infinite' }}>
                <rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l2 4v5h-2"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/><path d="M8 8h8"/><path d="M3 16h4"/>
              </svg>
              <span style={{ fontSize: '13px', fontWeight: 800 }}>ENVÍO GRATIS</span>
            </div>
          )}
        </div>

        {/* Vendidas ARRIBA + ML ABAJO */}
        <div style={{
          marginBottom: '20px',
          minHeight: '56px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          {/* Cantidad Vendidas PRIMERO */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 12px',
            background: esTopVenta ? '#fef3c7' : '#f9fafb',
            borderRadius: '20px',
            border: esTopVenta ? '2px solid #f59e0b' : '1px solid  rgb(5, 150, 105)',
            width: 'fit-content',
            marginBottom: '4px'
          }}>
            <div style={{
              width: '10px',
              height: '10px',
              background: esTopVenta ? '#f59e0b' : '#059669',
              borderRadius: '50%'
            }}></div>
            <span style={{
              fontSize: '16px',
              fontWeight: 700,
              color: esTopVenta ? '#b45309' : '#37513a'
            }}>
              {cantidadVendida.toLocaleString('es-AR')} vendidas
            </span>
            {esTopVenta && (
              <span style={{
                background: '#f59e0b',
                color: 'white',
                padding: '3px 8px',
                borderRadius: '12px',
                fontSize: '10px',
                fontWeight: 700,
                textTransform: 'uppercase'
              }}>
                🔥 TOP
              </span>
            )}
          </div>
          
          {/* Precio MercadoLibre ABAJO */}
          {product.ml_price && product.mercadoLibreUrl && (
            <p style={{
              margin: 0,
              fontSize: '13px',
              color: '#6b7280',
              fontStyle: 'italic'
            }}>
              Precio en MercadoLibre:{' '}
              <a
                href={product.mercadoLibreUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: '#0284c7',
                  textDecoration: 'underline',
                  fontStyle: 'normal',
                  fontWeight: 500
                }}
              >
                ${(product.ml_price || 0).toLocaleString('es-AR')}
              </a>
            </p>
          )}
        </div>

        {/* Botones */}
        <div style={{ 
          display: 'flex', 
          gap: '12px',
          marginTop: '8px',
          height: '64px',
          minHeight: '64px'
        }}>
          <a href={waLink} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', flex: 1 }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '8px', background: 'linear-gradient(135deg, #25D366, #128C7E)',
              color: '#fff', padding: '12px 16px', borderRadius: '10px',
              fontWeight: 600, fontSize: '14px', border: 'none',
              transition: 'all 0.3s ease', cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)',
              textAlign: 'center', whiteSpace: 'nowrap'
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
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
              </svg>
              Lo quiero
            </div>
          </a>
          
          <Link href={`/product/${product.id}`} style={{ textDecoration: 'none', flex: 1 }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '8px', background: '#fff', color: '#374151',
              padding: '12px 16px', borderRadius: '8px', fontSize: '14px',
              fontWeight: 500, border: '2px solid #e5e7eb',
              transition: 'all 0.3s ease', cursor: 'pointer',
              textAlign: 'center'
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
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
              </svg>
              Detalles
            </div>
          </Link>
        </div>
        
        <style jsx>{`
          @keyframes envioPulse {
            0%, 100% { box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3); }
            50% { box-shadow: 0 4px 20px rgba(249, 115, 22, 0.5); }
          }
          @keyframes envioMove {
            0%, 100% { transform: translateX(0); }
            50% { transform: translateX(3px); }
          }
        `}</style>
      </div>
    </div>
  )
}
