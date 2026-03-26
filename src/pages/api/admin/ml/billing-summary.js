import { createClient } from '@supabase/supabase-js';
import { validateApiKey } from '../../../../lib/apiAuth';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAdmin = createClient(supabaseUrl, serviceKey);

const ML_API_URL = 'https://api.mercadolibre.com';

async function refreshToken() {
  const { data: refreshTokenData } = await supabaseAdmin
    .from('settings')
    .select('value')
    .eq('key', 'ml_refresh_token')
    .single();

  const refreshToken = refreshTokenData?.value;
  if (!refreshToken) return null;

  try {
    const tokenRes = await fetch('https://api.mercadolibre.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: process.env.MERCADOLIBRE_CLIENT_ID,
        client_secret: process.env.MERCADOLIBRE_CLIENT_SECRET,
        refresh_token: refreshToken,
      }),
    });

    if (!tokenRes.ok) return null;
    const tokenData = await tokenRes.json();

    await supabaseAdmin
      .from('settings')
      .upsert({ key: 'ml_access_token', value: tokenData.access_token }, { onConflict: 'key' });

    if (tokenData.refresh_token) {
      await supabaseAdmin
        .from('settings')
        .upsert({ key: 'ml_refresh_token', value: tokenData.refresh_token }, { onConflict: 'key' });
    }

    return tokenData.access_token;
  } catch {
    return null;
  }
}

async function getAccessToken() {
  const { data } = await supabaseAdmin
    .from('settings')
    .select('value')
    .eq('key', 'ml_access_token')
    .single();
  return data?.value;
}

export default async function handler(req, res) {
  if (!validateApiKey(req, res)) return;

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end();
  }

  const { year, month, refresh } = req.query;
  
  if (!year || !month) {
    return res.status(400).json({ error: 'year y month son requeridos (formato: YYYY-MM)' });
  }

  const periodKey = `${year}-${month}-01`;

  const { data: savedCharges } = await supabaseAdmin
    .from('ml_monthly_charges')
    .select('*')
    .eq('period_key', periodKey)
    .single();

  if (savedCharges && !refresh) {
    return res.status(200).json({
      period: savedCharges.period_key,
      totalCharges: savedCharges.total_charges,
      totalBonuses: savedCharges.total_bonuses,
      netBalance: savedCharges.net_balance,
      charges: savedCharges.charges,
      savedAt: savedCharges.updated_at,
    });
  }

  await refreshToken();
  const token = await getAccessToken();

  if (!token) {
    return res.status(401).json({ error: 'No connected to MercadoLibre' });
  }

  try {
    const summaryRes = await fetch(
      `${ML_API_URL}/billing/integration/periods/key/${periodKey}/summary/details?document_type=BILL`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!summaryRes.ok) {
      const errorText = await summaryRes.text();
      return res.status(summaryRes.status).json({ error: errorText });
    }

    const summary = await summaryRes.json();
    
    const charges = summary.period?.bill_includes?.charges || [];
    const bonuses = summary.period?.bill_includes?.bonuses || [];
    
    const totalCharges = charges.reduce((sum, c) => sum + (c.amount || 0), 0);
    const totalBonuses = bonuses.reduce((sum, b) => sum + (b.amount || 0), 0);

    const chargeTypes = {
      'CV': 'Ventas (Comisión)',
      'CXD': 'Envíos',
      'PADS': 'Publicidad',
      'OCUP': 'Ocupación',
      'MPL': 'Mercado Pago',
      'DIS': 'Descuentos',
      'OTHER': 'Otros',
    };

    const categorizedCharges = charges.map(c => ({
      label: c.label || chargeTypes[c.type] || 'Otro',
      amount: c.amount || 0,
      type: c.type || 'OTHER',
    }));

    await supabaseAdmin
      .from('ml_monthly_charges')
      .upsert({
        period_key: periodKey,
        year: parseInt(year),
        month: parseInt(month),
        total_charges: totalCharges,
        total_bonuses: totalBonuses,
        net_balance: totalBonuses - totalCharges,
        charges: categorizedCharges,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'period_key' });

    return res.status(200).json({
      period: periodKey,
      totalCharges,
      totalBonuses,
      netBalance: totalBonuses - totalCharges,
      charges: categorizedCharges,
      saved: true,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}