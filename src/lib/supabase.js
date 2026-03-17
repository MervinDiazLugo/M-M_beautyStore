import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const ML_COMMISSION_RATE = 0.34;
export const DEFAULT_PACKAGING_COST = 1000;

export function calculateProfit(salePrice, productCost, packagingCost = DEFAULT_PACKAGING_COST) {
  const mlFees = salePrice * ML_COMMISSION_RATE;
  const netReceived = salePrice - mlFees;
  const profit = netReceived - productCost - packagingCost;
  return {
    salePrice,
    mlFees,
    netReceived,
    productCost,
    packagingCost,
    profit,
    profitMargin: (profit / salePrice) * 100,
  };
}

export function calculateNetReceived(salePrice) {
  return salePrice - (salePrice * ML_COMMISSION_RATE);
}
