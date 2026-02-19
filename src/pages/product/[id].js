import { useRouter } from 'next/router';
import Link from 'next/link';
import { PRODUCTS } from '../product-data';
import { useProduct } from '../../hooks/useProduct';
import { ProductHeader } from '../../components/product/ProductHeader';
import { Breadcrumb } from '../../components/product/Breadcrumb';
import { ImageGallery } from '../../components/product/ImageGallery';
import { ProductInfo } from '../../components/product/ProductInfo';
import { PricingCard } from '../../components/product/PricingCard';
import { ProductDescription } from '../../components/product/ProductDescription';

export default function ProductPage() {
  const { query } = useRouter();
  const product = PRODUCTS[query.id];

  const productData = useProduct(product);

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
    );
  }

  const {
    qty,
    setQty,
    currentImageIndex,
    isMobile,
    cantidadVendida,
    esTopVenta,
    precioMayoristaStr,
    cantidadMinimaMayorista,
    esMayorista,
    priceStr,
    mlPriceStr,
    waLink,
    goToPrevious,
    goToNext,
    descuentoMayorista,
    shortenUrl
  } = productData;

  return (
    <main className="product-page" style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>

      <ProductHeader isMobile={isMobile} />

      <div style={{
        padding: isMobile ? '0 16px' : '0 5%',
        maxWidth: '1200px',
        margin: '0 auto',
        paddingTop: isMobile ? '16px' : '24px'
      }}>

        <Breadcrumb product={product} isMobile={isMobile} />

        {/* Main Content Grid - ORDEN CORREGIDO CON GRID AREAS */}
        <div style={{
          display: 'grid',
          gap: isMobile ? '16px' : '24px',
          marginBottom: '32px',
          // Mobile: info arriba, imagen abajo
          // Desktop: imagen izquierda, info derecha  
          gridTemplateAreas: isMobile 
            ? '"info" "gallery"' 
            : '"gallery info"',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gridTemplateRows: isMobile ? 'auto 1fr' : '1fr'
        }}>

          {/* COLUMNA INFO - SIEMPRE EN ÁREA "info" (arriba mobile, derecha desktop) */}
          <div style={{ 
            gridArea: 'info',
            display: 'flex', 
            flexDirection: 'column', 
            gap: '20px'
          }}>
            <ProductInfo product={product} isMobile={isMobile} />

            <PricingCard 
              product={product}
              isMobile={isMobile}
              qty={qty}
              setQty={setQty}
              priceStr={priceStr}
              precioMayoristaStr={precioMayoristaStr}
              mlPriceStr={mlPriceStr}
              descuentoMayorista={descuentoMayorista}
              waLink={waLink}
              esMayorista={esMayorista}
              cantidadMinimaMayorista={cantidadMinimaMayorista}
            />
          </div>

          {/* COLUMNA IMAGEN - SIEMPRE EN ÁREA "gallery" (abajo mobile, izquierda desktop) */}
          <ImageGallery 
            product={product}
            isMobile={isMobile}
            currentImageIndex={currentImageIndex}
            goToPrevious={goToPrevious}
            goToNext={goToNext}
            esTopVenta={esTopVenta}
            cantidadVendida={cantidadVendida}
          />
        </div>

        {/* Product Features Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: isMobile ? '12px' : '20px',
          marginBottom: isMobile ? '24px' : '40px'
        }}>
          {product.features && product.features.map((feature, index) => (
            <div key={index} style={{
              background: '#fff',
              padding: isMobile ? '16px' : '20px',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
            }}>
              <div style={{ color: '#7c3aed', marginTop: '2px' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div>
                <span style={{ fontSize: isMobile ? '14px' : '15px', color: '#374151', lineHeight: 1.5 }}>
                  {feature}
                </span>
              </div>
            </div>
          ))}
        </div>

        <ProductDescription 
          product={product}
          isMobile={isMobile}
          mlPriceStr={mlPriceStr}
        />

        {/* Especificaciones */}
        <div style={{
          background: '#fff',
          padding: isMobile ? '20px' : '28px',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          marginBottom: '32px'
        }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: isMobile ? '16px' : '18px', fontWeight: 600, color: '#111827' }}>
            Especificaciones
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: isMobile ? '8px' : '12px' }}>
            {Object.entries(product.specifications).map(([key, value]) => (
              <div key={key} style={{ padding: isMobile ? '10px' : '12px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
                <div style={{ fontSize: isMobile ? '11px' : '12px', color: '#6b7280', fontWeight: 500, marginBottom: '4px' }}>{key}</div>
                <div style={{ fontSize: isMobile ? '13px' : '14px', color: '#374151', fontWeight: 500, wordBreak: 'break-word' }}>{value}</div>
              </div>
            ))}
          </div>
        </div>

      </div>

      <style jsx>{`
        @keyframes topPulse {
         0%, 100% { box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3); transform: scale(1); }
         50% { box-shadow: 0 6px 16px rgba(245, 158, 11, 0.5); transform: scale(1.05); }
        }
        @keyframes topDotPulse {
         0%, 100% { opacity: 1; transform: scale(1); }
         50% { opacity: 0.7; transform: scale(1.2); }
        }
        input[type="number"]::-webkit-outer-spin-button,
        input[type="number"]::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        input[type="number"] { -moz-appearance: textfield; }
      `}</style>
    </main>
  );
}
