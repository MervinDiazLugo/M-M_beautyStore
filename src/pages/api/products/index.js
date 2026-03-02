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
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('API proxy error:', error.message);
    res.status(500).json({ error: 'Failed to fetch from API' });
  }
}
