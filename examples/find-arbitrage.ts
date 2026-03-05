import { PredictionMarketClient } from "prediction-market-sdk";

const client = new PredictionMarketClient({
  apiKey: process.env.RAPIDAPI_KEY!,
});

async function main() {
  // Find single-platform arb opportunities
  const arbs = await client.getArbitrage({ minSpread: 0.01, limit: 5 });
  console.log(`Found ${arbs.data.length} arbitrage opportunities:\n`);

  for (const arb of arbs.data) {
    console.log(`  ${arb.market.question}`);
    console.log(`  Platform: ${arb.market.platform}`);
    console.log(`  YES: $${arb.market.yesPrice} | NO: $${arb.market.noPrice}`);
    console.log(`  Spread: ${(arb.spread * 100).toFixed(1)}% | Net profit: $${arb.netProfit.toFixed(2)} | ROI: ${arb.roi.toFixed(1)}%`);
    console.log();
  }

  // Find cross-platform arbs
  const crossArbs = await client.getCrossPlatformArbitrage({ arbOnly: true, limit: 5 });
  console.log(`\nFound ${crossArbs.data.length} cross-platform opportunities:\n`);

  for (const match of crossArbs.data) {
    console.log(`  Polymarket: "${match.polymarket.question}" YES=$${match.polymarket.yesPrice}`);
    console.log(`  Kalshi:     "${match.kalshi.question}" YES=$${match.kalshi.yesPrice}`);
    console.log(`  Match: ${(match.matchScore * 100).toFixed(0)}% | ROI: ${match.bestStrategy.roi.toFixed(1)}%`);
    console.log();
  }
}

main().catch(console.error);
