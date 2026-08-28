#!/usr/bin/env tsx
/**
 * Pull fixtures from the LitreGre prediction API and upsert into Postgres.
 * Requires PREDICTION_API_PHONE + PREDICTION_API_PIN (or PREDICTION_API_TOKEN).
 */
import { syncEventsFromPredictions } from "../lib/sync/prediction-events";
import { prisma } from "../lib/db";

async function main() {
  const result = await syncEventsFromPredictions();
  console.log(JSON.stringify(result, null, 2));
  await prisma.$disconnect();
  if (!result.ok) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
