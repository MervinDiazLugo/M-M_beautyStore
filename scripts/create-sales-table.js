// scripts/create-sales-table.js
const SUPABASE_URL = 'https://awljfaggwnvkemjrbcxv.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3bGpmYWdnd252a2VtanJiY3h2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTkzNTkyNiwiZXhwIjoyMDg3NTExOTI2fQ.tsDlmzU5t8CJTAbUzEcrNstph2ZwCG1A2a3XjQJ3mBU';

async function createSalesTable() {
  console.log('Creating sales table via management API...');
  
  // Create table using SQL directly
  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/create_sales_table`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`,
    },
    body: JSON.stringify({}),
  });

  console.log('Response:', response.status, await response.text());
}

createSalesTable().catch(console.error);
