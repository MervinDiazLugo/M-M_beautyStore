// scripts/create-admin-tables.js
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

async function createTables() {
  console.log('Creating tables...');

  // Add columns to products table
  console.log('Adding cost column to products...');
  try {
    await execSQL(`ALTER TABLE products ADD COLUMN IF NOT EXISTS cost NUMERIC DEFAULT 0;`);
    console.log('✓ cost column added');
  } catch (e) {
    console.log('cost:', e.message);
  }

  console.log('Adding packaging_cost column to products...');
  try {
    await execSQL(`ALTER TABLE products ADD COLUMN IF NOT EXISTS packaging_cost NUMERIC DEFAULT 1000;`);
    console.log('✓ packaging_cost column added');
  } catch (e) {
    console.log('packaging_cost:', e.message);
  }

  // Create sales table
  console.log('Creating sales table...');
  try {
    await execSQL(`
      CREATE TABLE IF NOT EXISTS sales (
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
    console.log('✓ sales table created');
  } catch (e) {
    console.log('sales table:', e.message);
  }

  // Enable RLS on sales
  try {
    await execSQL(`ALTER TABLE sales ENABLE ROW LEVEL SECURITY;`);
    console.log('✓ RLS enabled on sales');
  } catch (e) {
    console.log('RLS:', e.message);
  }

  console.log('Done!');
}

createTables().catch(console.error);
