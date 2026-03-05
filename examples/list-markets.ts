import { PredictionMarketClient } from "prediction-market-sdk";

const client = new PredictionMarketClient({
  apiKey: process.env.RAPIDAPI_KEY!,
});

async function main() {
  // List top sports markets by volume
  const markets = await client.listMarkets({
    category: "Sports",
    platform: "polymarket",
    limit: 10,
  });

  console.log(`Total markets: ${markets.meta.total}\n`);

  for (const m of markets.data) {
    console.log(`  ${m.question}`);
    console.log(`  YES: $${m.yesPrice} | NO: $${m.noPrice} | Vol: $${m.volume24h.toLocaleString()}`);
    console.log();
  }

  // List categories
  const cats = await client.listCategories();
  console.log("Categories:");
  for (const c of cats.data) {
    console.log(`  ${c.name}: ${c.totalCount} markets (Poly: ${c.polymarketCount}, Kalshi: ${c.kalshiCount})`);
  }
}

main().catch(console.error);
