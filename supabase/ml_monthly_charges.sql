-- Table to store ML billing charges by month
CREATE TABLE IF NOT EXISTS ml_monthly_charges (
  id SERIAL PRIMARY KEY,
  period_key TEXT NOT NULL UNIQUE,
  year INTEGER NOT NULL,
  month INTEGER NOT NULL,
  total_charges NUMERIC DEFAULT 0,
  total_bonuses NUMERIC DEFAULT 0,
  net_balance NUMERIC DEFAULT 0,
  charges JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_ml_monthly_charges_period ON ml_monthly_charges(period_key);
CREATE INDEX IF NOT EXISTS idx_ml_monthly_charges_year_month ON ml_monthly_charges(year, month);