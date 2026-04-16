import { TOP_SELLER_THRESHOLD } from '../../../lib/supabase';

const API_CONFIG = {
  baseUrl: (process.env.NEXT_PUBLIC_API_URL || 'https://m-m-beauty-store-api.vercel.app').replace(/\/$/, ''),
  get itemsUrl() {
    return `${this.baseUrl}/api/items`;
  }
};

export default async function handler(req, res) {
  try {
    const response = await fetch(API_CONFIG.itemsUrl, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await response.json();

    const enriched = Array.isArray(data)
      ? data.map(p => ({
          ...p,
          top_seller: ((p.cantidadVendida || p.soldQuantity || 0) > TOP_SELLER_THRESHOLD),
        }))
      : data;

    res.status(response.status).json(enriched);
  } catch (error) {
    console.error('API proxy error:', error.message);
    res.status(500).json({ error: 'Failed to fetch from API' });
  }
}
