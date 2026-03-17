// scripts/fix-rls.js
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

async function fixRLS() {
  console.log('Fixing RLS policies...');

  // Products table - allow read
  try {
    await execSQL(`DROP POLICY IF EXISTS "Allow all access to products" ON products;`);
    await execSQL(`CREATE POLICY "Allow all access to products" ON products FOR SELECT USING (true);`);
    console.log('✓ Products RLS fixed');
  } catch (e) {
    console.log('Products RLS:', e.message);
  }

  // Sales table - allow all
  try {
    await execSQL(`DROP POLICY IF EXISTS "Allow all access to sales" ON sales;`);
    await execSQL(`CREATE POLICY "Allow all access to sales" ON sales FOR ALL USING (true) WITH CHECK (true);`);
    console.log('✓ Sales RLS fixed');
  } catch (e) {
    console.log('Sales RLS:', e.message);
  }

  console.log('Done!');
}

fixRLS().catch(console.error);
