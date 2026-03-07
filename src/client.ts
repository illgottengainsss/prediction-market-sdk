import type {
  ClientConfig,
  ListMarketsParams,
  ListMarketsResponse,
  Market,
  Category,
  GetArbitrageParams,
  ArbitrageOpportunity,
  GetCrossPlatformParams,
  CrossPlatformMatch,
  CalculateParams,
  ArbitrageCalculation,
  GetTopStrategiesParams,
  TopStrategy,
  GetTriggersParams,
  TriggerEvent,
  IntelligenceParams,
  EntityResult,
  ThemeResult,
  SourceResult,
  ApiResponse,
} from "./types";

const DEFAULT_BASE_URL = "https://prediction-market-data.p.rapidapi.com";
const DEFAULT_HOST = "prediction-market-data.p.rapidapi.com";

export class PredictionMarketClient {
  private apiKey: string;
  private baseUrl: string;
  private host: string;

  constructor(config: ClientConfig) {
    if (!config.apiKey) throw new Error("apiKey is required");
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || DEFAULT_BASE_URL;
    this.host = config.host || DEFAULT_HOST;
  }

  private async request<T>(path: string, params?: Record<string, unknown>): Promise<T> {
    const url = new URL(path, this.baseUrl);
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null) {
          url.searchParams.set(key, String(value));
        }
      }
    }

    const res = await fetch(url.toString(), {
      headers: {
        "x-rapidapi-key": this.apiKey,
        "x-rapidapi-host": this.host,
      },
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      const msg = (body as any)?.error?.message || `HTTP ${res.status}`;
      throw new Error(`PredictionMarketAPI: ${msg}`);
    }

    return res.json() as Promise<T>;
  }

  /** List active prediction markets from Polymarket and Kalshi */
  async listMarkets(params?: ListMarketsParams): Promise<ListMarketsResponse> {
    return this.request<ListMarketsResponse>("/api/v1/markets", params as any);
  }

  /** Get a single market by Polymarket conditionId or Kalshi ticker */
  async getMarket(id: string): Promise<ApiResponse<Market>> {
    return this.request<ApiResponse<Market>>(`/api/v1/markets/${encodeURIComponent(id)}`);
  }

  /** List all market categories with per-platform counts */
  async listCategories(): Promise<ApiResponse<Category[]>> {
    return this.request<ApiResponse<Category[]>>("/api/v1/categories");
  }

  /** Find single-platform arbitrage opportunities (YES + NO < $1) */
  async getArbitrage(params?: GetArbitrageParams): Promise<ApiResponse<ArbitrageOpportunity[]>> {
    return this.request("/api/v1/arbitrage", params as any);
  }

  /** Find cross-platform arbitrage (same market priced differently on Polymarket vs Kalshi) */
  async getCrossPlatformArbitrage(params?: GetCrossPlatformParams): Promise<ApiResponse<CrossPlatformMatch[]>> {
    return this.request("/api/v1/arbitrage/cross-platform", params as any);
  }

  /** Calculate exact profit for a YES/NO price pair with fee breakdown */
  async calculateArbitrage(params: CalculateParams): Promise<ApiResponse<ArbitrageCalculation>> {
    return this.request("/api/v1/arbitrage/calculate", params as any);
  }

  /** Get top-performing strategy combinations from 24/7 forward-testing engine */
  async getTopStrategies(params?: GetTopStrategiesParams): Promise<ApiResponse<TopStrategy[]>> {
    return this.request("/api/v1/signals/top-strategies", params as any);
  }

  /** Get recent trigger events from the strategy forward-testing engine */
  async getRecentTriggers(params?: GetTriggersParams): Promise<ApiResponse<TriggerEvent[]>> {
    return this.request("/api/v1/signals/triggers", params as any);
  }

  /** Get top people and organizations mentioned alongside a topic in 250K+ news sources */
  async getEntities(params: IntelligenceParams): Promise<ApiResponse<EntityResult>> {
    return this.request("/api/v1/intelligence/entities", params as any);
  }

  /** Get GDELT themes co-occurring with a topic — reveals narrative context */
  async getThemes(params: IntelligenceParams): Promise<ApiResponse<ThemeResult>> {
    return this.request("/api/v1/intelligence/themes", params as any);
  }

  /** Get top media sources covering a topic with per-source sentiment scores */
  async getSources(params: IntelligenceParams): Promise<ApiResponse<SourceResult>> {
    return this.request("/api/v1/intelligence/sources", params as any);
  }
}
