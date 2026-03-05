import { PredictionMarketClient } from "prediction-market-sdk";

const client = new PredictionMarketClient({
  apiKey: process.env.RAPIDAPI_KEY!,
});

async function main() {
  // Find high-confidence cross-platform matches
  const matches = await client.getCrossPlatformArbitrage({
    minMatchScore: 0.8,
    arbOnly: false,
    limit: 20,
  });

  console.log(`Found ${matches.data.length} cross-platform matches:\n`);

  for (const m of matches.data) {
    const profitable = m.bestStrategy.netProfit > 0;
    console.log(`  [${m.confidence.toUpperCase()}] Match score: ${(m.matchScore * 100).toFixed(0)}%`);
    console.log(`  Polymarket: "${m.polymarket.question}" YES=$${m.polymarket.yesPrice}`);
    console.log(`  Kalshi:     "${m.kalshi.question}" YES=$${m.kalshi.yesPrice}`);
    console.log(`  Strategy: Buy YES on ${m.bestStrategy.buyYesOn}, Buy NO on ${m.bestStrategy.buyNoOn}`);
    console.log(`  ${profitable ? "PROFITABLE" : "Not profitable"} — ROI: ${m.bestStrategy.roi.toFixed(1)}%`);
    console.log();
  }

  // Calculate exact profit for a specific pair
  const calc = await client.calculateArbitrage({
    yes: 0.45,
    no: 0.52,
    shares: 100,
    platform: "polymarket",
  });

  console.log("Arbitrage Calculator:");
  console.log(`  YES: $${calc.data.yesPrice} + NO: $${calc.data.noPrice} = $${(calc.data.yesPrice + calc.data.noPrice).toFixed(2)}`);
  console.log(`  Gross profit: $${calc.data.grossProfit.toFixed(2)}`);
  console.log(`  Fees: $${calc.data.fees.total.toFixed(2)}`);
  console.log(`  Net profit: $${calc.data.netProfit.toFixed(2)} (${calc.data.roi.toFixed(1)}% ROI)`);
}

main().catch(console.error);
