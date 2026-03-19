import { createClient } from '@supabase/supabase-js';
import { validateApiKey } from '../../../../lib/apiAuth';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAdmin = createClient(supabaseUrl, serviceKey);

const ML_API_URL = 'https://api.mercadolibre.com';
const CLIENT_ID = process.env.MERCADOLIBRE_CLIENT_ID;
const CLIENT_SECRET = process.env.MERCADOLIBRE_CLIENT_SECRET;

async function refreshToken() {
  const { data: refreshTokenData } = await supabaseAdmin
    .from('settings')
    .select('value')
    .eq('key', 'ml_refresh_token')
    .single();

  const refreshToken = refreshTokenData?.value;
  if (!refreshToken) return false;

  try {
    const tokenRes = await fetch('https://api.mercadolibre.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        refresh_token: refreshToken,
      }),
    });

    if (!tokenRes.ok) return false;
    const tokenData = await tokenRes.json();

    await supabaseAdmin
      .from('settings')
      .upsert({ key: 'ml_access_token', value: tokenData.access_token }, { onConflict: 'key' });

    if (tokenData.refresh_token) {
      await supabaseAdmin
        .from('settings')
        .upsert({ key: 'ml_refresh_token', value: tokenData.refresh_token }, { onConflict: 'key' });
    }

    return true;
  } catch {
    return false;
  }
}

async function getAccessToken() {
  const { data } = await supabaseAdmin
    .from('settings')
    .select('value')
    .eq('key', 'ml_access_token')
    .single();
  return data?.value;
}

async function fetchAsJson(url, options = {}) {
  const res = await fetch(url, options);
  if (!res.ok) return { _httpStatus: res.status };
  const buffer = await res.arrayBuffer();
  const uint8 = new Uint8Array(buffer);
  let text = new TextDecoder('utf-8', { fatal: false }).decode(uint8);
  const brokenCount = (text.match(/\uFFFD/g) || []).length;
  if (brokenCount > 2) {
    text = new TextDecoder('latin1').decode(uint8);
  }
  return JSON.parse(text);
}

function sanitizeString(str) {
  if (typeof str !== 'string' || !str) return str;
  str = str.replace(/\uFFFD/g, '');
  str = str.replace(/[\uD800-\uDFFF]/g, '');
  return str;
}

async function fetchDescription(itemId, token) {
  try {
    const data = await fetchAsJson(`${ML_API_URL}/items/${itemId}/description`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (data._httpStatus) return '';
    let text = data.plain_text || data.text || '';
    return sanitizeString(text.trim());
  } catch {
    return '';
  }
}

async function fetchProduct(itemId, token) {
  const ATTRIBUTES = 'id,title,price,original_price,condition,permalink,thumbnail,pictures,shipping,attributes,sold_quantity,available_quantity,status';
  const url = `${ML_API_URL}/items/${itemId}?attributes=${ATTRIBUTES}`;

  const data = await fetchAsJson(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (data._httpStatus) {
    throw new Error(`ML API ${data._httpStatus} para ${itemId}`);
  }

  const fullDescription = await fetchDescription(itemId, token);

  let descShort;
  if (fullDescription) {
    const match = fullDescription.match(/^(.+?[.!?])\s*\n?/s);
    descShort = match ? match[1].trim() : fullDescription.slice(0, 150).trim();
  } else {
    descShort = (data.title || '').trim();
  }

  const specs = {};
  for (const attr of data.attributes || []) {
    if (attr.value_name) specs[attr.name] = sanitizeString(attr.value_name);
  }

  const pictures = data.pictures || [];
  let images = pictures
    .map((p) => p.secure_url)
    .filter(Boolean)
    .slice(0, 8);
  if (images.length === 0 && data.thumbnail) {
    images = [data.thumbnail.replace('I.jpg', 'O.jpg').replace('http://', 'https://')];
  }

  const brand = specs['Marca'] || 'Desconocida';
  const mlPrice = data.price || 0;
  let priceNeto = 0;
  if (mlPrice > 0) {
    const comision = mlPrice * 0.055;
    priceNeto = Math.round(Math.max(mlPrice - (comision + 600), 0));
  }

  const precioMayorista = priceNeto > 0 ? Math.round(priceNeto * 0.8) : 0;
  const cantidadMinima = priceNeto <= 2999 ? 50 : priceNeto <= 5999 ? 36 : priceNeto <= 8999 ? 18 : 12;
  const envioGratis = priceNeto > 60000;
  const soldQuantityReal = data.sold_quantity || 0;
  const cantidadVendida = soldQuantityReal + Math.floor(Math.random() * 201) + 800;
  const status = data.status;
  const published = status === 'active';
  const permalink = data.permalink || `https://articulo.mercadolibre.com.ar/${itemId}`;

  return {
    id: itemId,
    name: sanitizeString(data.title || ''),
    ml_price: mlPrice,
    price: priceNeto,
    precio_mayorista: precioMayorista,
    cantidad_minima_mayorista: cantidadMinima,
    cantidad_vendida: cantidadVendida,
    sold_quantity_real: soldQuantityReal,
    desc: sanitizeString(descShort),
    sku: itemId,
    image: images,
    envio_gratis: envioGratis,
    description: sanitizeString(fullDescription || 'Descripción no disponible.'),
    features: [],
    specifications: specs,
    mercado_libre_url: permalink,
    brand: sanitizeString(brand),
    condition: data.condition || 'new',
    sold_quantity: cantidadVendida,
    available_quantity: data.available_quantity || 0,
    published,
    permalink,
  };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!validateApiKey(req, res)) return;

  try {
    await refreshToken();
    const token = await getAccessToken();
    if (!token) {
      return res.status(401).json({ error: 'No connected to MercadoLibre' });
    }

    const userRes = await fetchAsJson(`${ML_API_URL}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (userRes._httpStatus || !userRes.id) {
      return res.status(401).json({ error: 'Failed to get ML user info' });
    }

    const userId = userRes.id;
    const itemIds = [];

    let offset = 0;
    const limit = 100;
    const statuses = ['active', 'paused', 'closed'];
    
    for (const status of statuses) {
      let statusOffset = 0;
      while (true) {
        const searchRes = await fetchAsJson(
          `${ML_API_URL}/users/${userId}/items/search?status=${status}&limit=${limit}&offset=${statusOffset}`,
          { headers: { Authorization: `Bearer ${token}` }
        });

        if (searchRes._httpStatus || !searchRes.results) break;

        itemIds.push(...searchRes.results);

        if (!searchRes.paging || searchRes.results.length < limit) break;
        statusOffset += limit;
      }
    }

    if (itemIds.length === 0) {
      return res.status(200).json({ success: true, message: 'No items found', imported: 0 });
    }

    const results = { total: itemIds.length, success: 0, failed: 0, errors: [] };

    for (let i = 0; i < itemIds.length; i += 5) {
      const batch = itemIds.slice(i, i + 5);
      const batchResults = await Promise.allSettled(
        batch.map(async (itemId) => {
          const product = await fetchProduct(itemId, token);

          const { data: existing } = await supabaseAdmin
            .from('products')
            .select('cost, packaging_cost, instagram_reel')
            .eq('id', itemId)
            .single();

          if (existing) {
            product.cost = existing.cost;
            product.packaging_cost = existing.packaging_cost;
            if (existing.instagram_reel) product.instagram_reel = existing.instagram_reel;
          }

          const { error } = await supabaseAdmin
            .from('products')
            .upsert(product, { onConflict: 'id' });

          if (error) throw error;
          return product;
        })
      );

      for (const result of batchResults) {
        if (result.status === 'fulfilled') {
          results.success++;
        } else {
          results.failed++;
          results.errors.push(result.reason?.message || 'Unknown error');
        }
      }
    }

    return res.status(200).json({
      success: true,
      message: `Sincronizados ${results.success}/${results.total} productos`,
      ...results,
    });
  } catch (err) {
    console.error('Error syncing ML items:', err);
    return res.status(500).json({ error: err.message });
  }
}
