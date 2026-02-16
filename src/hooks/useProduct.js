import { useState, useEffect } from 'react';

export function useProduct(product) {
  const [qty, setQty] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!product) {
    return { isMobile };
  }

  // Calcular si es TOP VENTA
  const cantidadVendida = product.cantidad_vendida || product.sold_quantity || 0;
  const esTopVenta = cantidadVendida > 1000;

  // Calcular precio mayorista para la cantidad actual
  const precioMayorista = product.precio_mayorista || 0;
  const cantidadMinimaMayorista = product.cantidad_minima_mayorista || 12;
  const esMayorista = qty >= cantidadMinimaMayorista;
  const precioUnitarioFinal = esMayorista ? precioMayorista : product.price;
  
  const totalMayoristaNum = precioMayorista * qty;
  const totalMayorista = totalMayoristaNum.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const priceStr = product.price.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const mlPriceStr = product.ml_price ? product.ml_price.toLocaleString('es-AR') : '';
  
  const totalNum = product.price * qty;
  const total = totalNum.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  
  const precioMayoristaStr = precioMayorista.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const message = esMayorista
    ? `Hola, quiero comprar al MAYOR *${product.name}* (SKU: ${product.sku})\nCantidad: ${qty} unidades (Precio mayorista)\nPrecio unitario: $${precioMayoristaStr}\nTotal: $${totalMayorista}`
    : `Hola, quiero comprar *${product.name}* (SKU: ${product.sku})\nCantidad: ${qty}\nPrecio unitario: $${priceStr}\nTotal: $${total}`;
  
  const waBase = "https://wa.me/5491178267112";
  const waLink = `${waBase}?text=${encodeURIComponent(message)}`;

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

  const shortenUrl = (url) => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname + urlObj.pathname.slice(0, 30) + '...';
    } catch {
      return url.length > 40 ? url.substring(0, 40) + '...' : url;
    }
  };

  const descuentoMayorista = Math.round((1 - precioMayorista / product.price) * 100);
  const ahorroVsML = product.ml_price ? product.ml_price - precioMayorista : 0;

  return {
    qty,
    setQty,
    currentImageIndex,
    setCurrentImageIndex,
    isMobile,
    cantidadVendida,
    esTopVenta,
    precioMayorista,
    cantidadMinimaMayorista,
    esMayorista,
    precioUnitarioFinal,
    totalMayorista,
    priceStr,
    mlPriceStr,
    total,
    precioMayoristaStr,
    waLink,
    goToPrevious,
    goToNext,
    shortenUrl,
    descuentoMayorista,
    ahorroVsML
  };
}
