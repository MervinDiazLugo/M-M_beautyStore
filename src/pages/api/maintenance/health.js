import { connectToDatabase } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('products');

    const totalCount = await collection.countDocuments();
    const sampleDoc = await collection.findOne({});
    const sampleFieldCount = sampleDoc ? Object.keys(sampleDoc).length : 0;

    let readableCount = 0;
    let errorCount = 0;

    try {
      const cursor = collection.find({});
      while (await cursor.hasNext()) {
        try {
          await cursor.next();
          readableCount++;
        } catch (e) {
          errorCount++;
        }
      }
    } catch (e) {
      console.error('Error leyendo cursor:', e.message);
    }

    return res.status(200).json({
      status: 'healthy',
      database: {
        totalDocuments: totalCount,
        readableDocuments: readableCount,
        corruptDocuments: errorCount,
        sampleFieldCount
      },
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      message: err.message,
      timestamp: new Date().toISOString()
    });
  }
}
