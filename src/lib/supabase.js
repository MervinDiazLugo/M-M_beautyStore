import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Business constants — change here to update everywhere
export const ML_COMMISSION_RATE = 0.34;
export const ML_STORE_PRICE_FACTOR = 0.9;
export const DEFAULT_PACKAGING_COST = 1000;
export const MIN_MARGIN = 0.20;
export const TOP_SELLER_THRESHOLD = 1000;

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

export function calculateSuggestedPrice(cost, packagingCost = DEFAULT_PACKAGING_COST, targetMargin = MIN_MARGIN) {
  return Math.round((cost + packagingCost) / (1 - ML_COMMISSION_RATE - targetMargin));
}

export function calculateMinimumPrice(cost, packagingCost = DEFAULT_PACKAGING_COST) {
  return Math.round((cost + packagingCost) / (1 - ML_COMMISSION_RATE));
}

export function getMarginStatus(margin) {
  if (margin < 0) return 'negative';
  if (margin < MIN_MARGIN * 100) return 'low';
  return 'ok';
}
