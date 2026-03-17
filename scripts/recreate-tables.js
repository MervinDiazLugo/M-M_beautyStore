// scripts/recreate-tables.js
const SUPABASE_URL = 'https://awljfaggwnvkemjrbcxv.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3bGpmYWdnd252a2VtanJiY3h2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTkzNTkyNiwiZXhwIjoyMDg3NTExOTI2fQ.tsDlmzU5t8CJTAbUzEcrNstph2ZwCG1A2a3XjQJ3mBU';

async function execSQL(sql) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`,
    },
    body: JSON.stringify({ sql }),
  });
  return response.json();
}

async function recreateTables() {
  console.log('Recreating tables...');

  // Add columns to products
  console.log('Adding cost column...');
  try {
    await execSQL(`ALTER TABLE products ADD COLUMN IF NOT EXISTS cost NUMERIC DEFAULT 0;`);
    console.log('✓ cost added');
  } catch(e) { console.log('cost:', e.message || 'ok'); }

  console.log('Adding packaging_cost column...');
  try {
    await execSQL(`ALTER TABLE products ADD COLUMN IF NOT EXISTS packaging_cost NUMERIC DEFAULT 1000;`);
    console.log('✓ packaging_cost added');
  } catch(e) { console.log('packaging_cost:', e.message || 'ok'); }

  // Drop and recreate sales table
  console.log('Dropping sales table if exists...');
  try {
    await execSQL(`DROP TABLE IF EXISTS sales CASCADE;`);
    console.log('✓ sales dropped');
  } catch(e) { console.log('drop:', e.message); }

  console.log('Creating sales table...');
  try {
    await execSQL(`
      CREATE TABLE sales (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        product_id TEXT NOT NULL,
        sale_price NUMERIC NOT NULL,
        quantity INTEGER DEFAULT 1,
        ml_order_id TEXT,
        ml_fees NUMERIC,
        net_received NUMERIC,
        profit NUMERIC,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    console.log('✓ sales created');
  } catch(e) {
    console.log('create sales:', e.message);
  }

  // Fix RLS
  console.log('Setting up RLS...');
  try {
    await execSQL(`ALTER TABLE sales ENABLE ROW LEVEL SECURITY;`);
    await execSQL(`CREATE POLICY "Allow all" ON sales FOR ALL USING (true) WITH CHECK (true);`);
    console.log('✓ RLS configured');
  } catch(e) {
    console.log('RLS:', e.message);
  }

  // Refresh schema cache
  console.log('Refreshing schema...');
  try {
    await execSQL(`NOTIFY pgrst, 'reload';`);
    console.log('✓ Schema refreshed');
  } catch(e) {
    console.log('refresh:', e.message);
  }

  console.log('Done!');
}

recreateTables().catch(console.error);
