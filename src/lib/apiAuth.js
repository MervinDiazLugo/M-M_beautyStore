const API_KEYS = (process.env.KEY_SECURITY_LIST || process.env.NEXT_PUBLIC_API_KEY || '').split(',').filter(Boolean);

export function validateApiKey(req, res) {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey) {
    res.status(401).json({ error: 'API key required' });
    return false;
  }
  
  if (!API_KEYS.includes(apiKey)) {
    res.status(401).json({ error: 'Invalid API key' });
    return false;
  }
  
  return true;
}
