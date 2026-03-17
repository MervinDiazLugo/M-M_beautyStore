const { Pool } = require('pg');

const pool = new Pool({
  host: 'aws-1-us-east-1.pooler.supabase.com',
  port: 6543,
  database: 'postgres',
  user: 'postgres.awljfaggwnvkemjrbcxv',
  password: 'hUdbt9VyKWELnc2f',
  ssl: { rejectUnauthorized: false }
});

async function createSettingsTable() {
  const client = await pool.connect();
  
  try {
    console.log('Creating settings table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);
    console.log('✓ settings table created');
    
    console.log('Setting up RLS...');
    await client.query(`ALTER TABLE settings ENABLE ROW LEVEL SECURITY`);
    await client.query(`CREATE POLICY "Allow all" ON settings FOR ALL USING (true) WITH CHECK (true)`);
    console.log('✓ RLS configured');
    
    console.log('\n✅ All done!');
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    client.release();
    await pool.end();
  }
}

createSettingsTable();
