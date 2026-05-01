import { TOP_SELLER_THRESHOLD } from '../../../lib/supabase';
import { connectToDatabase } from '../../../lib/db';

export default async function handler(req, res) {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('products');

    const items = [];
    const cursor = collection.find({});
    while (await cursor.hasNext()) {
      const doc = await cursor.next();
      if (doc) items.push(doc);
    }

    const enriched = items.map(p => ({
      ...p,
      top_seller: ((p.cantidadVendida || p.soldQuantity || 0) > TOP_SELLER_THRESHOLD),
    }));

    res.status(200).json(enriched);
  } catch (error) {
    console.error('API error:', error.message);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
}
