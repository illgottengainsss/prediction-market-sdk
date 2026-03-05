// --- Common ---

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: Record<string, unknown>;
}

// --- Markets ---

export interface Market {
  id: string;
  platform: "polymarket" | "kalshi";
  question: string;
  category: string;
  yesPrice: number;
  noPrice: number;
  spread: number;
  volume24h: number;
  liquidity: number;
  endDate: string;
  url: string;
  lastUpdated: string;
}

export interface ListMarketsParams {
  platform?: "polymarket" | "kalshi";
  category?: string;
  q?: string;
  minVolume?: number;
  limit?: number;
  offset?: number;
}

export interface ListMarketsResponse {
  success: boolean;
  meta: { total: number; limit: number; offset: number };
  data: Market[];
}

// --- Categories ---

export interface Category {
  name: string;
  polymarketCount: number;
  kalshiCount: number;
  totalCount: number;
}

// --- Arbitrage ---

export interface ArbitrageMarket {
  id: string;
  platform: "polymarket" | "kalshi";
  question: string;
  category: string;
  yesPrice: number;
  noPrice: number;
  spread: number;
}

export interface Fees {
  taker: number;
  settlement: number;
  gas: number;
  total: number;
}

export interface ArbitrageOpportunity {
  market: ArbitrageMarket;
  spread: number;
  profitPerShare: number;
  fees: Fees;
  netProfit: number;
  roi: number;
  isProfitable: boolean;
  shares: number;
}

export interface GetArbitrageParams {
  platform?: "polymarket" | "kalshi";
  shares?: number;
  minSpread?: number;
  includeUnprofitable?: boolean;
  limit?: number;
}

// --- Cross-Platform ---

export interface CrossPlatformMatch {
  polymarket: Market;
  kalshi: Market;
  matchScore: number;
  confidence: "high" | "medium" | "low";
  bestStrategy: {
    buyYesOn: "polymarket" | "kalshi";
    buyNoOn: "polymarket" | "kalshi";
    combinedCost: number;
    netProfit: number;
    roi: number;
  };
}

export interface GetCrossPlatformParams {
  minMatchScore?: number;
  arbOnly?: boolean;
  limit?: number;
}

// --- Calculator ---

export interface ArbitrageCalculation {
  platform: string;
  feeType: string;
  yesPrice: number;
  noPrice: number;
  shares: number;
  grossSpread: number;
  grossProfit: number;
  fees: Fees;
  netProfit: number;
  roi: number;
  isProfitable: boolean;
  minProfitableShares: number;
}

export interface CalculateParams {
  yes: number;
  no: number;
  shares?: number;
  platform?: "polymarket" | "kalshi";
  feeType?: "us" | "global";
}

// --- Signals ---

export interface Strategy {
  minSpread: number;
  positionSize: number;
  platform: string;
  minLiquidity: number;
}

export interface TopStrategy {
  rank: number;
  comboId: number;
  strategy: Strategy;
  totalNetProfit: number;
  totalTriggers: number;
  winCount: number;
  winRate: number;
  avgProfitPerTrigger: number;
  lastUpdated: string;
}

export interface GetTopStrategiesParams {
  limit?: number;
  minWinRate?: number;
  minTriggers?: number;
}

export interface TriggerEvent {
  timestamp: string;
  comboId: number;
  market: {
    id: string;
    question: string;
    yesPrice: number;
    noPrice: number;
    spread: number;
    category: string;
    liquidity: number;
  };
  result: {
    netProfit: number;
    totalCost: number;
    isProfitable: boolean;
    roi: number;
  };
}

export interface GetTriggersParams {
  limit?: number;
  category?: string;
  profitable?: boolean;
}

// --- Client Config ---

export interface ClientConfig {
  apiKey: string;
  baseUrl?: string;
  host?: string;
}
