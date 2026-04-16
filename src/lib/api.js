const API_CONFIG = {
  get baseUrl() {
    if (typeof window !== 'undefined') {
      return '/api/products';
    }
    return process.env.NEXT_PUBLIC_API_URL || 'https://m-m-beauty-store-api.vercel.app';
  },
  get itemsUrl() {
    return this.baseUrl;
  },
  getItemUrl(id) {
    return `${this.baseUrl}/${id}`;
  }
};

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
    createdAt: product.createdAt,
    instagramReel: product.instagramReel || null,
    top_seller: product.top_seller || false,
  };
}

export async function getProducts() {
  console.log('getProducts called, URL:', API_CONFIG.itemsUrl);
  
  try {
    const response = await fetch(API_CONFIG.itemsUrl, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });
    
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Data received:', Array.isArray(data) ? data.length : 0, 'items');
    return Array.isArray(data) ? data.map(normalizeProduct) : [];
  } catch (error) {
    console.error('getProducts error:', error.message);
    return [];
  }
}

export async function getProductById(id) {
  if (!id) return null;
  
  try {
    const response = await fetch(API_CONFIG.getItemUrl(id), {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    return normalizeProduct(data);
  } catch (error) {
    console.error('getProductById error:', error.message);
    return null;
  }
}
