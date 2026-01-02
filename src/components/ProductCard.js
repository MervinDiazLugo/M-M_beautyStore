import Link from 'next/link'

export default function ProductCard({ product }) {
  const message = `Hola, quiero comprar: ${product.name} (SKU: ${product.sku}) - $${product.price.toLocaleString('es-AR', {minimumFractionDigits: 2,maximumFractionDigits: 2})}`
  const waBase = "https://wa.me/5491123942598"
  const waLink = `${waBase}?text=${encodeURIComponent(message)}`

  return (
    <div style={{ 
      width: '100%', 
      display: 'flex', 
      justifyContent: 'center' 
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        width: '100%'
      }}>
        {/* Imagen del producto */}
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
        </div>
        
        {/* Información del producto */}
        <h3 style={{
          margin: '0 0 8px 0',
          fontSize: '18px',
          fontWeight: 700,
          color: '#111827',
          lineHeight: '1.3'
        }}>{product.name}</h3>
        
        <p style={{
          margin: '0 0 8px 0',
          color: '#6b7280',
          fontSize: '14px',
          lineHeight: '1.4',
          minHeight: '40px'
        }}>{product.desc}</p>
        
        {/* Precio y Envío gratis en la misma línea */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <p style={{
            margin: '0',
            fontWeight: 700,
            fontSize: '22px',
            color: '#111827',
            whiteSpace: 'nowrap'
          }}>
            ${product.price.toLocaleString('es-AR', {minimumFractionDigits: 2,maximumFractionDigits: 2})}
          </p>
          
          {/* Indicador de envío gratis AL LADO DEL PRECIO */}
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
              {/* SVG de camión SIMPLIFICADO y más limpio */}
              <svg 
                width="18" 
                height="18" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  animation: 'envioMove 1.8s ease-in-out infinite'
                }}
              >
                {/* Versión simplificada del camión */}
                <rect x="1" y="3" width="15" height="13" rx="2"/>
                <path d="M16 8h4l2 4v5h-2"/>
                <circle cx="5.5" cy="18.5" r="2.5"/>
                <circle cx="18.5" cy="18.5" r="2.5"/>
                <path d="M8 8h8"/>
                <path d="M3 16h4"/>
              </svg>
              <span style={{ fontSize: '13px', fontWeight: 800 }}>ENVÍO GRATIS</span>
            </div>
          )}
        </div>
        
        {/* Botones - Con carrito y ojito */}
        <div style={{ 
          display: 'flex', 
          gap: '12px',
          marginTop: 'auto'
        }}>
          {/* Botón Comprar - Con ícono de carrito */}
          <a
            href={waLink}
            target="_blank"
            rel="noreferrer"
            style={{
              textDecoration: 'none',
              flex: 1
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              background: 'linear-gradient(135deg, #25D366, #128C7E)',
              color: '#fff',
              padding: '12px 16px',
              borderRadius: '10px',
              fontWeight: 600,
              fontSize: '14px',
              border: 'none',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)',
              textAlign: 'center'
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
              {/* Ícono de carrito */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"/>
                <circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              Comprar
            </div>
          </a>
          
          {/* Botón Ver detalles - CON EL OJITO QUE TE GUSTABA */}
          <Link
            href={`/product/${product.id}`}
            style={{
              textDecoration: 'none',
              flex: 1
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              background: '#fff',
              color: '#374151',
              padding: '12px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 500,
              border: '2px solid #e5e7eb',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
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
              {/* Ojito icon*/}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              Detalles
            </div>
          </Link>
        </div>
        
        {/* Estilos CSS para animaciones */}
        <style jsx>{`
          @keyframes envioPulse {
            0% {
              transform: scale(1);
              box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);
            }
            50% {
              transform: scale(1.03);
              box-shadow: 0 6px 16px rgba(249, 115, 22, 0.4);
            }
            100% {
              transform: scale(1);
              box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);
            }
          }
          
          @keyframes envioMove {
            0% {
              transform: translateX(0) rotate(0deg);
            }
            25% {
              transform: translateX(2px) rotate(3deg);
            }
            50% {
              transform: translateX(4px) rotate(0deg);
            }
            75% {
              transform: translateX(2px) rotate(-3deg);
            }
            100% {
              transform: translateX(0) rotate(0deg);
            }
          }
        `}</style>
      </div>
    </div>
  )
}