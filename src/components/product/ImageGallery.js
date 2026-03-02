export function ImageGallery({ product, isMobile, currentImageIndex, goToPrevious, goToNext, esTopVenta, cantidadVendida }) {
  const images = product.image || [];
  const currentImage = images[currentImageIndex];
  
  if (!currentImage) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: isMobile ? '300px' : '450px',
        background: '#f3f4f6',
        borderRadius: '12px'
      }}>
        <p style={{ color: '#6b7280' }}>Imagen no disponible</p>
      </div>
    );
  }
  
  return (
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
          src={currentImage}
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

      {/* Badge de cantidad vendida en la imagen */}
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
      {images.length > 1 && (
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
  );
}
