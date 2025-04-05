// scripts/seed-all.mjs
import { execSync } from "child_process";

const env = process.env.SEED_ENV || "dev";

process.env.AWS_REGION = "us-east-1";
process.env.FORMATS_TABLE = `EDH-Format-${env}`;
process.env.USERS_TABLE = `EDH-User-${env}`;
process.env.DECKS_TABLE = `EDH-Deck-${env}`;
process.env.MATCH_TABLE = `EDH-Match-${env}`;

console.log(`🌱 Seeding environment: ${env}\n`);

try {
  execSync(`node scripts/seed-formats.mjs`, { stdio: "inherit" });
  execSync(`node scripts/seed-users.mjs`, { stdio: "inherit" });
  execSync(`node scripts/seed-decks.mjs`, { stdio: "inherit" });
  execSync(`node scripts/seed-matches.mjs`, { stdio: "inherit" });

  console.log("\n✅ All seed scripts completed successfully.");
} catch (err) {
  console.error("\n❌ Seeding failed:", err);
  process.exit(1);
}
