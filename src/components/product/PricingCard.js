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
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.284l-.569 2.112 2.141-.571c.822.439 1.891.737 2.991.738 3.182 0 5.767-2.587 5.768-5.766 0-3.181-2.585-5.763-5.782-5.763zm3.808 8.221c-.15.422-.741.774-1.025.822-.247.045-.568.077-1.132-.153a5.59 5.59 0 0 1-1.961-1.353 6.12 6.12 0 0 1-1.318-1.907c-.15-.307-.468-.813-.468-1.317 0-.503.264-.751.359-.858.095-.106.211-.133.285-.133.074 0 .15.002.214.004.068.002.161-.027.251.191.096.232.327.794.359.859.032.065.053.14.01.223-.042.083-.063.136-.127.21-.064.075-.133.167-.191.226-.065.064-.132.134-.057.264.074.13.333.55.714.89.49.436.903.57 1.035.635.132.065.21.053.287-.035.077-.088.332-.385.42-.517.087-.132.175-.11.294-.065.119.044.756.357.887.422.13.066.218.098.249.152.031.054.031.313-.12.735z" />
          <path d="M19.057 4.298c-1.883-1.884-4.386-2.922-7.047-2.922C6.444 1.376 1.932 5.89 1.93 11.458c0 1.779.466 3.515 1.348 5.044L1 23l6.648-1.742c1.479.807 3.141 1.233 4.838 1.233h.005c5.562 0 10.074-4.512 10.077-10.081 0-2.698-1.05-5.232-2.933-7.116zM12.484 20.841h-.004c-1.516 0-3.003-.407-4.3-.1.177L3.435 21.68l.847-3.15-.19-.303c-.882-1.405-1.348-3.025-1.348-4.689 0-4.707 3.829-8.537 8.536-8.537 2.28 0 4.424.888 6.035 2.5 1.611 1.612 2.498 3.756 2.498 6.037 0 4.708-3.83 8.538-8.538 8.538z" />
        </svg>
        PEDIR POR WHATSAPP
      </a>
    </div>
  );
}