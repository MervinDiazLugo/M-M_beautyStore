function normalizeProduct(product) {
  if (!product) return null;

  return {
    id: product.id,
    name: product.name,
    ml_price: product.mlPrice ?? product.ml_price,
    price: product.price,
    precio_mayorista: product.precioMayorista ?? product.precio_mayorista,
    cantidad_minima_mayorista: product.cantidadMinimaMayorista ?? product.cantidad_minima_mayorista,
    cantidad_vendida: product.cantidadVendida ?? product.cantidad_vendida,
    sold_quantity_real: product.soldQuantityReal ?? product.sold_quantity_real,
    desc: product.desc,
    sku: product.sku,
    image: product.image,
    envioGratis: product.envioGratis ?? product.envio_gratis,
    description: product.description,
    features: product.features,
    specifications: product.specifications,
    mercadoLibreUrl: product.mercadoLibreUrl ?? product.mercado_libre_url,
    brand: product.brand,
    condition: product.condition,
    sold_quantity: product.soldQuantity ?? product.sold_quantity,
    available_quantity: product.availableQuantity ?? product.available_quantity,
    published: product.published,
    permalink: product.permalink,
    createdAt: product.createdAt,
    instagramReel: product.instagramReel ?? product.instagram_reel ?? null,
    top_seller: product.top_seller || false,
  };
}

export async function getProducts() {
  try {
    const response = await fetch('/api/products', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    return Array.isArray(data) ? data.map(normalizeProduct) : [];
  } catch (error) {
    console.error('getProducts error:', error.message);
    return [];
  }
}

export async function getProductById(id) {
  if (!id) return null;

  try {
    const response = await fetch(`/api/products/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });

    if (!response.ok) return null;

    const data = await response.json();
    return normalizeProduct(data);
  } catch (error) {
    console.error('getProductById error:', error.message);
    return null;
  }
}
