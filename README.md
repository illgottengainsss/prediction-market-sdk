# prediction-market-sdk

[![npm version](https://img.shields.io/npm/v/prediction-market-sdk)](https://www.npmjs.com/package/prediction-market-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**TypeScript SDK for the Prediction Market Data API** — unified access to Polymarket & Kalshi markets, arbitrage detection, cross-platform matching, and strategy signals.

> Since Dome (the previous prediction market aggregator) was acquired by Polymarket in early 2026, there is no unified API for both major prediction market platforms. This SDK fills that gap.

## Install

```bash
npm install prediction-market-sdk
```

## Quick Start

```typescript
import { PredictionMarketClient } from "prediction-market-sdk";

const client = new PredictionMarketClient({
  apiKey: "your-rapidapi-key",
});

// Search markets
const markets = await client.listMarkets({
  category: "Sports",
  platform: "polymarket",
  limit: 10,
});

// Find arbitrage opportunities
const arbs = await client.getArbitrage({ minSpread: 0.02 });

// Cross-platform arbitrage (same event, different prices)
const crossArbs = await client.getCrossPlatformArbitrage({ arbOnly: true });

// Strategy signals from 759K+ forward-tested triggers
const strategies = await client.getTopStrategies({ minWinRate: 0.8 });
```

## Get an API Key

1. Go to [Prediction Market Data on RapidAPI](https://rapidapi.com/illgottengainsss/api/prediction-market-data)
2. Subscribe to the free plan (50 requests/day)
3. Copy your `X-RapidAPI-Key` from the dashboard

## API Methods

### Markets

#### `listMarkets(params?)`

List active prediction markets from Polymarket and Kalshi, sorted by 24h volume.

```typescript
const markets = await client.listMarkets({
  platform: "polymarket",  // or "kalshi"
  category: "Politics",
  q: "Trump",              // search by question text
  minVolume: 10000,
  limit: 50,
  offset: 0,
});
```

#### `getMarket(id)`

Get a single market by Polymarket `conditionId` (0x...) or Kalshi ticker.

```typescript
const market = await client.getMarket("0xe492ad95...");
```

#### `listCategories()`

List all categories with per-platform market counts.

```typescript
const categories = await client.listCategories();
// [{ name: "Sports", polymarketCount: 824, kalshiCount: 612, totalCount: 1436 }, ...]
```

### Arbitrage

#### `getArbitrage(params?)`

Find single-platform arbitrage opportunities where YES + NO < $1.

```typescript
const arbs = await client.getArbitrage({
  platform: "kalshi",
  minSpread: 0.01,
  shares: 100,
  limit: 20,
});
```

#### `getCrossPlatformArbitrage(params?)`

Find the same market priced differently on Polymarket vs Kalshi. Uses NLP-powered matching with question type detection, entity extraction, and predicate analysis.

```typescript
const crossArbs = await client.getCrossPlatformArbitrage({
  minMatchScore: 0.7, // 0-1 confidence threshold
  arbOnly: true,      // only profitable opportunities
  limit: 50,
});

for (const match of crossArbs.data) {
  console.log(`${match.polymarket.question} — ${match.matchScore * 100}% match`);
  console.log(`Buy YES on ${match.bestStrategy.buyYesOn} → ROI: ${match.bestStrategy.roi}%`);
}
```

#### `calculateArbitrage(params)`

Calculate exact profit for a YES/NO price pair with platform-specific fee breakdown.

```typescript
const calc = await client.calculateArbitrage({
  yes: 0.45,
  no: 0.52,
  shares: 100,
  platform: "polymarket",
  feeType: "us",
});
// { netProfit: 1.93, roi: 1.99, isProfitable: true, fees: { taker: 0.01, settlement: 1, ... } }
```

### Signals

#### `getTopStrategies(params?)`

Top-performing strategy combinations from a 24/7 forward-testing engine evaluating 864 combos against live Polymarket data ~8,640 times per day.

```typescript
const strategies = await client.getTopStrategies({
  minWinRate: 0.8,
  minTriggers: 1000,
  limit: 10,
});
// [{ comboId: 24, winRate: 0.8268, totalNetProfit: 286140, totalTriggers: 759253, ... }]
```

#### `getRecentTriggers(params?)`

Recent trigger events — each represents a real market opportunity detected and evaluated.

```typescript
const triggers = await client.getRecentTriggers({
  profitable: true,
  category: "Sports",
  limit: 20,
});
```

## Data Coverage

| Platform | Markets | Type |
|----------|---------|------|
| **Polymarket** | ~1,400+ | Crypto-native, largest by volume |
| **Kalshi** | ~3,400+ | CFTC-regulated US exchange |

## Pricing

| Plan | Price | Requests |
|------|-------|----------|
| Basic | Free | 50/day |
| Pro | $14.99/mo | 1,000/day |
| Ultra | $49.99/mo | 10,000/day |
| Mega | $149.99/mo | 100,000/mo |

[Subscribe on RapidAPI →](https://rapidapi.com/illgottengainsss/api/prediction-market-data)

## License

MIT
