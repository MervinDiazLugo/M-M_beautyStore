// pages/api/admin/ml/auth.js
export default function handler(req, res) {
  const { method } = req;
  const CLIENT_ID = process.env.MERCADOLIBRE_CLIENT_ID;
  const REDIRECT_URI = process.env.ML_REDIRECT_URI || 'http://localhost:3000/api/admin/ml/callback';

  if (method === 'GET') {
    const authUrl = `https://auth.mercadolibre.com.ar/authorization?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
    return res.status(200).json({ authUrl });
  }

  res.setHeader('Allow', ['GET']);
  res.status(405).end(`Method ${method} Not Allowed`);
}
