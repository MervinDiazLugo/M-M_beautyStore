import Link from 'next/link';
import { useProduct } from '../../hooks/useProduct';
import { ProductHeader } from '../../components/product/ProductHeader';
import { Breadcrumb } from '../../components/product/Breadcrumb';
import { ImageGallery } from '../../components/product/ImageGallery';
import { ProductInfo } from '../../components/product/ProductInfo';
import { PricingCard } from '../../components/product/PricingCard';
import { ProductDescription } from '../../components/product/ProductDescription';
import { InstagramReelEmbed } from '../../components/product/InstagramReelEmbed';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://m-m-beauty-store-api.vercel.app';

function normalizeProduct(product) {
  if (!product) return null;
  
  return {
    id: product.id,
    name: product.name,
    ml_price: product.mlPrice,
    price: product.price,
    precio_mayorista: product.precioMayorista,
    cantidad_minima_mayorista: product.cantidadMinimaMayorista,
    cantidad_vendida: product.cantidadVendida,
    sold_quantity_real: product.soldQuantityReal,
    desc: product.desc,
    sku: product.sku,
    image: product.image,
    envioGratis: product.envioGratis,
    description: product.description,
    features: product.features,
    specifications: product.specifications,
    mercadoLibreUrl: product.mercadoLibreUrl,
    brand: product.brand,
    condition: product.condition,
    sold_quantity: product.soldQuantity,
    available_quantity: product.availableQuantity,
    published: product.published,
    permalink: product.permalink,
    instagramReel: product.instagramReel,
  };
}

export async function getServerSideProps({ params }) {
  try {
    const response = await fetch(`${API_URL}/api/items/${params.id}`);
    
    if (!response.ok) {
      return { notFound: true };
    }
    
    const product = await response.json();
    
    return {
      props: {
        product: normalizeProduct(product)
      }
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    return { notFound: true };
  }
}

export default function ProductPage({ product }) {
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

        {/* MOBILE vs DESKTOP */}
        {isMobile ? (
          /* ================= MOBILE: Título + Galería + SKU+Venta Mayorista ================= */
          <div style={{
            background: '#fff',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            marginBottom: '24px'
          }}>
            {/* TÍTULO PEQUEÑO */}
            <h1 style={{
              fontSize: '18px',
              fontWeight: 700,
              color: '#111827',
              margin: '0 0 12px 0',
              lineHeight: '1.3'
            }}>
              {product.name}
            </h1>

            {/* SKU + VENTA MAYORISTA → UNA LÍNEA FORZADA - SIEMPRE VISIBLE */}
            <div style={{
              display: 'flex',
              flexWrap: 'nowrap',
              gap: '12px',
              alignItems: 'center',
              height: '28px',
              marginBottom: '20px',
              fontSize: '14px',
              overflow: 'hidden'
            }}>
              {product.sku && (
                <span style={{
                  color: '#6b7280',
                  background: '#f3f4f6',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 500,
                  whiteSpace: 'nowrap',
                  flexShrink: 0
                }}>
                  SKU: {product.sku}
                </span>
              )}
              {precioMayoristaStr && (
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 10px',
                  backgroundColor: '#ecfdf5',
                  color: '#059669',
                  fontSize: '10px',
                  fontWeight: 600,
                  borderRadius: '4px',
                  border: '1px solid #a7f3d0',
                  whiteSpace: 'nowrap',
                  flexShrink: 0
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                    <line x1="1" y1="10" x2="23" y2="10"></line>
                  </svg>
                  Venta Mayorista
                </div>
              )}
            </div>

            {/* GALERÍA GRANDE */}
            <div style={{ minHeight: '280px' }}>
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
          </div>
        ) : (
          /* ================= DESKTOP: Grid original ================= */
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '24px',
            marginBottom: '32px',
          }}>
            <ImageGallery
              product={product}
              isMobile={isMobile}
              currentImageIndex={currentImageIndex}
              goToPrevious={goToPrevious}
              goToNext={goToNext}
              esTopVenta={esTopVenta}
              cantidadVendida={cantidadVendida}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <ProductInfo product={product} isMobile={isMobile} />
              
              {/* PricingCard con toda la funcionalidad de mayorista */}
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
          </div>
        )}

        {/* PRECIO - SOLO MOBILE */}
        {isMobile && (
          <div style={{ marginBottom: '32px' }}>
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
        )}

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

        {/* Product Description */}
        <ProductDescription
          product={product}
          isMobile={isMobile}
          mlPriceStr={mlPriceStr}
        />

        {/* Specifications + Instagram Reel - Side by side if specs exist */}
        {(() => {
          const hasSpecs = product.specifications && Object.keys(product.specifications).length > 0;
          const hasReel = product.instagramReel && product.instagramReel.trim() !== '';
          
          if (!hasSpecs && !hasReel) return null;
          
          if (hasSpecs && hasReel) {
            // Both: side by side columns
            return (
              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                gap: isMobile ? '16px' : '24px',
                marginBottom: '32px'
              }}>
                {/* Specifications */}
                <div style={{
                  background: '#fff',
                  padding: isMobile ? '20px' : '28px',
                  borderRadius: '12px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
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
                
                {/* Instagram Reel */}
                <InstagramReelEmbed product={product} isMobile={isMobile} />
              </div>
            );
          }
          
          if (hasReel) {
            // Only reel - smaller and centered
            return (
              <div style={{ marginBottom: '32px', maxWidth: '400px', margin: '0 auto 32px auto' }}>
                <InstagramReelEmbed product={product} isMobile={isMobile} />
              </div>
            );
          }
          
          // Only specs
          return (
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
          );
        })()}

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