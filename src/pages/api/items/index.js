import { connectToDatabase } from '../../../lib/db';
import { validateSecurityKey } from '../../../lib/auth';
import { TOP_SELLER_THRESHOLD } from '../../../lib/supabase';

function sanitizeString(str) {
  if (typeof str !== 'string' || !str) return str;
  str = str.replace(/�/g, '');
  str = str.replace(/[\uD800-\uDFFF]/g, '');
  return str;
}

function sanitizeObject(obj, depth = 0) {
  if (depth > 50) return obj;
  if (obj === null || obj === undefined) return obj;

  if (Array.isArray(obj)) {
    return obj
      .filter((v) => v !== null && v !== undefined)
      .map((v) => sanitizeObject(v, depth + 1));
  }

  if (typeof obj === 'string') return sanitizeString(obj);

  if (typeof obj === 'object') {
    if (obj instanceof Date) return obj.toISOString();
    if (obj.$oid) return obj.$oid;
    const out = {};
    for (const [k, v] of Object.entries(obj)) {
      if (k === '_id') continue;
      const cleanValue = sanitizeObject(v, depth + 1);
      if (cleanValue !== null && cleanValue !== undefined) {
        out[k] = cleanValue;
      }
    }
    return out;
  }

  return obj;
}

export default async function handler(req, res) {
  const { db } = await connectToDatabase();
  const collection = db.collection('products');

  if (req.method === 'GET') {
    const out = [];
    try {
      const cursor = collection.find({});
      while (await cursor.hasNext()) {
        try {
          const doc = await cursor.next();
          if (doc) out.push(sanitizeObject(doc));
        } catch (docErr) {
          console.warn('Skipping corrupt document:', docErr.message);
        }
      }
    } catch (err) {
      console.warn('find() failed:', err.message);
    }

    const enriched = out.map(p => ({
      ...p,
      top_seller: ((p.cantidadVendida || p.soldQuantity || 0) > TOP_SELLER_THRESHOLD),
    }));

    return res.status(200).json(enriched);
  }

  if (req.method === 'POST') {
    const auth = validateSecurityKey(req, res);
    if (!auth.valid) return res.status(401).json({ error: auth.error });

    const body = req.body;
    if (!body || !body.id) return res.status(400).json({ error: 'id requerido' });
    const exists = await collection.findOne({ id: body.id });
    if (exists) return res.status(409).json({ error: 'id ya existe' });
    const cleaned = sanitizeObject(body);
    await collection.insertOne(cleaned);
    return res.status(201).json(cleaned);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
