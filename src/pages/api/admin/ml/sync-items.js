import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAdmin = createClient(supabaseUrl, serviceKey);

const ML_API_URL = 'https://api.mercadolibre.com';

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

async function fetchProduct(itemId, token) {
  const ATTRIBUTES = 'id,title,price,original_price,condition,permalink,thumbnail,pictures,shipping,attributes,sold_quantity,available_quantity,status';
  const url = `${ML_API_URL}/items/${itemId}?attributes=${ATTRIBUTES}`;

  const data = await fetchAsJson(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (data._httpStatus) {
    throw new Error(`ML API ${data._httpStatus} para ${itemId}`);
  }

  const pictures = data.pictures || [];
  let images = pictures
    .map((p) => p.secure_url)
    .filter(Boolean)
    .slice(0, 8);
  if (images.length === 0 && data.thumbnail) {
    images = [data.thumbnail.replace('I.jpg', 'O.jpg').replace('http://', 'https://')];
  }

  const mlPrice = data.price || 0;
  let priceNeto = 0;
  if (mlPrice > 0) {
    const comision = mlPrice * 0.055;
    priceNeto = Math.round(Math.max(mlPrice - (comision + 600), 0));
  }

  return {
    id: itemId,
    name: sanitizeString(data.title || ''),
    price: priceNeto,
    image: images,
    permalink: data.permalink || `https://articulo.mercadolibre.com.ar/${itemId}`,
    ml_price: mlPrice,
    sold_quantity: data.sold_quantity || 0,
    available_quantity: data.available_quantity || 0,
    status: data.status || 'active',
  };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
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
    while (true) {
      const searchRes = await fetchAsJson(
        `${ML_API_URL}/users/${userId}/items/search?status=active&limit=${limit}&offset=${offset}`,
        { headers: { Authorization: `Bearer ${token}` }
      });

      if (searchRes._httpStatus || !searchRes.results) break;

      itemIds.push(...searchRes.results);

      if (!searchRes.paging || searchRes.results.length < limit) break;
      offset += limit;
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
            .select('cost, packaging_cost, instagramReel')
            .eq('id', itemId)
            .single();
          
          if (existing) {
            product.cost = existing.cost;
            product.packaging_cost = existing.packaging_cost;
            if (existing.instagramReel) product.instagramReel = existing.instagramReel;
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
