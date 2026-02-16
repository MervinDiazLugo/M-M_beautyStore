export function ProductInfo({ product, isMobile }) {
  return (
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
            Venta Mayorista
          </div>
        )}
      </div>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
        marginTop: '12px'
      }}>
        {product.tags && product.tags.map(tag => (
          <span key={tag} style={{
            backgroundColor: '#f5f3ff',
            color: '#7c3aed',
            fontSize: '11px',
            padding: '4px 12px',
            borderRadius: '100px',
            fontWeight: 600,
            border: '1px solid #ddd6fe',
            textTransform: 'uppercase',
            letterSpacing: '0.3px'
          }}>
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
