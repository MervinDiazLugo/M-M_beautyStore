import Link from 'next/link'

export default function ProductCard({ product }) {
  const message = `Hola, quiero comprar: ${product.name} (SKU: ${product.sku}) - $${product.price.toLocaleString('es-AR', {minimumFractionDigits: 2,maximumFractionDigits: 2})}`
  const waLink = `https://wa.me/?text=${encodeURIComponent(message)}`

  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%' 
      }}>
        <div style={{
          height: 200,
          background: '#f8fafc',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 16,
          borderRadius: '8px',
          overflow: 'hidden'
        }}>
          <img
            src={product.image[0]}
            alt={product.name}
            style={{
              maxHeight: '100%',
              maxWidth: '100%',
              objectFit: 'contain'
            }}
          />
        </div>
        <h3 style={{
          margin: '0 0 8px 0',
          fontSize: '18px',
          fontWeight: 600,
          color: '#111827'
        }}>{product.name}</h3>
        <p style={{
          margin: '0 0 8px 0',
          color: '#6b7280',
          fontSize: '14px',
          lineHeight: '1.4'
        }}>{product.desc}</p>
        <p style={{
          margin: '0 0 16px 0',
          fontWeight: 700,
          fontSize: '20px',
          color: '#111827'
        }}>${product.price.toLocaleString('es-AR', {minimumFractionDigits: 2,maximumFractionDigits: 2})}</p>
        <div style={{ display: 'flex', gap: 10 }}>
          <a
            href={waLink}
            target="_blank"
            rel="noreferrer"
            style={{
              textDecoration: 'none',
              flex: 1
            }}
          >
            <button
              type="button"
              style={{
                width: '100%',
                background: '#25D366',
                color: 'white',
                border: 'none',
                padding: '10px',
                borderRadius: '6px',
                fontWeight: 600,
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              Comprar
            </button>
          </a>
          <Link
            href={`/product/${product.id}`}
            style={{
              textDecoration: 'none',
              flex: 1
            }}
          >
            <button
              type="button"
              style={{
                width: '100%',
                background: 'transparent',
                color: '#374151',
                border: '1px solid #d1d5db',
                padding: '10px',
                borderRadius: '6px',
                fontWeight: 500,
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              Ver detalles
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}