export function PricingCard({ 
  product, 
  isMobile, 
  qty, 
  setQty, 
  priceStr, 
  precioMayoristaStr, 
  mlPriceStr, 
  descuentoMayorista, 
  waLink, 
  esMayorista, 
  cantidadMinimaMayorista 
}) {
  // Calcular valores para la barra de progreso
  const unidadesFaltantes = cantidadMinimaMayorista - qty;
  const progresoMayorista = Math.min(100, (qty / cantidadMinimaMayorista) * 100);

  return (
    <div style={{
      background: '#fff',
      padding: isMobile ? '20px' : '28px',
      borderRadius: '12px',
      height: 'fit-content',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      border: esMayorista ? '1px solid #10b981' : '1px solid #e5e7eb'
    }}>
      {/* Precios */}
      <div style={{ marginBottom: '20px' }}>
        {/* Línea 1: Precio normal */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span style={{ fontSize: isMobile ? '14px' : '16px', fontWeight: 600, color: '#374151', whiteSpace: 'nowrap' }}>
            Precio:
          </span>
          <span style={{ fontSize: isMobile ? '24px' : 'clamp(28px, 4vw, 32px)', fontWeight: 700, color: '#111827', whiteSpace: 'nowrap' }}>
            ${priceStr}
          </span>
        </div>

        {/* Línea 2: Precio mayorista */}
        {product.precio_mayorista && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            marginBottom: '6px',
            backgroundColor: esMayorista ? '#ecfdf5' : 'transparent',
            padding: esMayorista ? '8px 12px' : '0',
            borderRadius: '8px',
            marginLeft: esMayorista ? '-12px' : '0',
            marginRight: esMayorista ? '-12px' : '0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: isMobile ? '14px' : '16px', fontWeight: 600, color: '#374151', whiteSpace: 'nowrap' }}>
                Mayorista:
              </span>
              {esMayorista && (
                <span style={{
                  backgroundColor: '#10b981',
                  color: 'white',
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '2px 8px',
                  borderRadius: '12px'
                }}>
                  APLICADO
                </span>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ 
                fontSize: isMobile ? '20px' : 'clamp(22px, 3vw, 24px)', 
                fontWeight: esMayorista ? 700 : 600, 
                color: esMayorista ? '#10b981' : '#059669', 
                whiteSpace: 'nowrap' 
              }}>
                ${precioMayoristaStr}
              </span>
              <span style={{ fontSize: isMobile ? '12px' : '14px', fontWeight: 800, color: '#dc2626', backgroundColor: '#fee2e2', padding: '2px 8px', borderRadius: '4px', marginLeft: '4px' }}>
                -{descuentoMayorista}%
              </span>
            </div>
          </div>
        )}

        {/* Línea 3: Precio MercadoLibre */}
        {product.ml_price && product.mercadoLibreUrl && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ fontSize: isMobile ? '14px' : '16px', fontWeight: 600, color: '#374151', whiteSpace: 'nowrap' }}>
              Precio en MercadoLibre:
            </span>
            <a
              href={product.mercadoLibreUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: isMobile ? '14px' : '16px', fontWeight: 600, color: '#dc2626', whiteSpace: 'nowrap', textDecoration: 'none' }}
              onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
              onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
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
          <svg width={isMobile ? "16" : "18"} height={isMobile ? "16" : "18"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="3" width="15" height="13" rx="2" /><path d="M16 8h4l2 4v5h-2" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /><path d="M8 8h8" /><path d="M3 16h4" />
          </svg>
          <span style={{ fontSize: isMobile ? '12px' : '13px', fontWeight: 700 }}>ENVÍO GRATIS</span>
        </div>
      )}

      {/* Selector de cantidad */}
      <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '12px' : '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <label style={{ color: '#111827', fontSize: isMobile ? '14px' : '16px', fontWeight: 600 }}>Cantidad:</label>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', border: '1px solid #d1d5db', borderRadius: '8px', padding: '4px', backgroundColor: '#fff' }}>
          <button
            onClick={() => setQty(q => Math.max(1, q - 1))}
            style={{ width: isMobile ? '32px' : '36px', height: isMobile ? '32px' : '36px', border: 'none', background: 'transparent', borderRadius: '6px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#374151' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >−</button>
          <input
            type="number"
            value={qty}
            onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
            style={{ width: '40px', textAlign: 'center', border: 'none', fontSize: '16px', fontWeight: 600, color: '#111827', padding: 0 }}
          />
          <button
            onClick={() => setQty(q => q + 1)}
            style={{ width: isMobile ? '32px' : '36px', height: isMobile ? '32px' : '36px', border: 'none', background: 'transparent', borderRadius: '6px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#374151' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >+</button>
        </div>
      </div>

      {/* BARRA DE PROGRESO MAYORISTA */}
      {product.precio_mayorista && (
        <div style={{
          marginTop: '16px',
          padding: '16px',
          backgroundColor: '#f9fafb',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px'
          }}>
            <span style={{
              fontSize: '13px',
              fontWeight: 500,
              color: '#374151'
            }}>
              Progreso hacia precio mayorista
            </span>
            <span style={{
              fontSize: '13px',
              fontWeight: 600,
              color: esMayorista ? '#10b981' : '#6b7280'
            }}>
              {qty}/{cantidadMinimaMayorista} unidades
            </span>
          </div>

          {/* Barra de progreso */}
          <div style={{
            width: '100%',
            height: '6px',
            backgroundColor: '#e5e7eb',
            borderRadius: '3px',
            overflow: 'hidden',
            marginBottom: '8px'
          }}>
            <div style={{
              width: `${progresoMayorista}%`,
              height: '100%',
              background: esMayorista 
                ? '#10b981'
                : '#9ca3af',
              borderRadius: '3px',
              transition: 'width 0.3s ease'
            }} />
          </div>

          {/* Mensaje de estado */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px',
            color: esMayorista ? '#10b981' : '#6b7280',
            fontWeight: 500
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {esMayorista ? (
                <path d="M20 6L9 17l-5-5" />
              ) : (
                <circle cx="12" cy="12" r="10" />
              )}
              {!esMayorista && (
                <>
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </>
              )}
            </svg>
            {esMayorista ? (
              <span>¡Precio mayorista aplicado! Ahorras {descuentoMayorista}% por unidad.</span>
            ) : (
              <span>Faltan {unidadesFaltantes} {unidadesFaltantes === 1 ? 'unidad' : 'unidades'} para acceder al precio mayorista</span>
            )}
          </div>
        </div>
      )}

      {/* Botón de compra */}
      <a
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          width: '100%',
          padding: isMobile ? '14px' : '18px',
          background: 'linear-gradient(135deg, #25D366, #128C7E)',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '12px',
          fontSize: isMobile ? '16px' : '18px',
          fontWeight: 700,
          boxShadow: '0 4px 14px rgba(37, 211, 102, 0.3)',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(37, 211, 102, 0.4)';
          e.currentTarget.style.background = 'linear-gradient(135deg, #22c35e, #0e7b5e)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 14px rgba(37, 211, 102, 0.3)';
          e.currentTarget.style.background = 'linear-gradient(135deg, #25D366, #128C7E)';
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
        </svg>
        Pedir por WhatsApp
      </a>
    </div>
  );
}