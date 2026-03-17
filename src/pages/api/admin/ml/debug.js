// pages/api/admin/ml/debug.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAdmin = createClient(supabaseUrl, serviceKey);

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const results = { steps: [] };

    // Step 1: Check tokens in DB
    const { data: tokenData } = await supabaseAdmin
      .from('settings')
      .select('key, value')
      .in('key', ['ml_access_token', 'ml_refresh_token', 'ml_user_id']);

    results.steps.push({ step: 'tokens_in_db', found: tokenData?.length || 0, tokens: tokenData });
    results.tokenData = tokenData;

    // Step 2: Check if token exists and is valid format
    const accessToken = tokenData?.find(t => t.key === 'ml_access_token')?.value;
    results.steps.push({ step: 'access_token', exists: !!accessToken, length: accessToken?.length || 0 });

    if (accessToken) {
      // Step 3: Test API call
      try {
        const testRes = await fetch('https://api.mercadolibre.com/users/me', {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        results.steps.push({ step: 'api_test', status: testRes.status });
        results.userInfo = await testRes.json();
      } catch (e) {
        results.steps.push({ step: 'api_test', error: e.message });
      }

      // Step 4: Get orders
      const userId = tokenData?.find(t => t.key === 'ml_user_id')?.value;
      results.steps.push({ step: 'user_id', exists: !!userId, value: userId });

      if (userId) {
        const ordersRes = await fetch(`https://api.mercadolibre.com/orders/search?seller=${userId}&limit=100`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        results.steps.push({ step: 'orders_api', status: ordersRes.status });
        results.ordersInfo = await ordersRes.json();
      }
    }

    // Step 5: Check sales in DB
    const { data: sales } = await supabaseAdmin.from('sales').select('*').limit(10);
    results.salesInDb = sales;
    results.salesCount = sales?.length || 0;

    return res.status(200).json(results);
  }

  res.setHeader('Allow', ['GET']);
  res.status(405).end();
}
