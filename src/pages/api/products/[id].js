import { TOP_SELLER_THRESHOLD } from '../../../lib/supabase';
import { connectToDatabase } from '../../../lib/db';

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Product ID required' });
  }

  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('products');
    const item = await collection.findOne({ id });

    if (!item) return res.status(404).json({ error: 'Not found' });

    item.top_seller = ((item.cantidadVendida || item.soldQuantity || 0) > TOP_SELLER_THRESHOLD);

    res.status(200).json(item);
  } catch (error) {
    console.error('API error:', error.message);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
}
