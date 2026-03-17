const { Pool } = require('pg');

const pool = new Pool({
  host: 'aws-1-us-east-1.pooler.supabase.com',
  port: 6543,
  database: 'postgres',
  user: 'postgres.awljfaggwnvkemjrbcxv',
  password: 'hUdbt9VyKWELnc2f',
  ssl: { rejectUnauthorized: false }
});

async function createTables() {
  const client = await pool.connect();
  
  try {
    // Add columns to products
    console.log('Adding columns to products...');
    await client.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS cost NUMERIC DEFAULT 0`);
    console.log('✓ cost column added');
    
    await client.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS packaging_cost NUMERIC DEFAULT 1000`);
    console.log('✓ packaging_cost column added');
    
    // Create sales table
    console.log('Creating sales table...');
    await client.query(`
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
      )
    `);
    console.log('✓ sales table created');
    
    // Set up RLS
    console.log('Setting up RLS...');
    await client.query(`ALTER TABLE sales ENABLE ROW LEVEL SECURITY`);
    await client.query(`CREATE POLICY "Allow all" ON sales FOR ALL USING (true) WITH CHECK (true)`);
    console.log('✓ RLS configured');
    
    // Grant permissions
    console.log('Granting permissions...');
    await client.query(`GRANT ALL ON sales TO anon, authenticated`);
    await client.query(`GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated`);
    console.log('✓ Permissions granted');
    
    console.log('\n✅ All done!');
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    client.release();
    await pool.end();
  }
}

createTables();
