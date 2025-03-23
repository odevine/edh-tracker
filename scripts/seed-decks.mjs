// scripts/seed-decks.mjs
import {
  BatchWriteItemCommand,
  DynamoDBClient,
} from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import csv from "csv-parser";
import fs from "fs";

const TABLE_NAME = process.env.DECKS_TABLE || "EDH-Deck-dev";
const REGION = process.env.AWS_REGION || "us-east-1";

const client = new DynamoDBClient({ region: REGION });

function parseColorArray(jsonStr) {
  try {
    const parsed = JSON.parse(jsonStr);
    return parsed.map((colorObj) => colorObj.S);
  } catch {
    return [];
  }
}

function parseCSV(filePath) {
  return new Promise((resolve, reject) => {
    const items = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        const item = {
          id: row.id,
          userId: row.deckOwnerId, // renamed
          formatId: row.deckType, // renamed
          deckName: row.deckName,
          commanderName: row.commanderName,
          createdAt: row.createdAt,
          updatedAt: row.updatedAt,
        };

        if (row.commanderColors) {
          item.commanderColors = parseColorArray(row.commanderColors);
        }

        if (row.secondCommanderName)
          item.secondCommanderName = row.secondCommanderName;

        if (row.secondCommanderColors) {
          item.secondCommanderColors = parseColorArray(
            row.secondCommanderColors,
          );
        }

        if (row.link) item.link = row.link;
        if (row.cost) item.cost = parseFloat(row.cost);
        if (row.isInactive) item.inactive = row.isInactive === "True"; // renamed

        items.push(item);
      })
      .on("end", () => resolve(items))
      .on("error", reject);
  });
}

async function batchWrite(items) {
  const chunks = [];
  while (items.length) chunks.push(items.splice(0, 25));

  for (const chunk of chunks) {
    const params = {
      RequestItems: {
        [TABLE_NAME]: chunk.map((item) => ({
          PutRequest: {
            Item: marshall(item),
          },
        })),
      },
    };

    try {
      await client.send(new BatchWriteItemCommand(params));
      console.log(`✅ Inserted ${chunk.length} decks into ${TABLE_NAME}`);
    } catch (err) {
      console.error("❌ Error writing batch:", err);
    }
  }
}

(async () => {
  try {
    const decks = await parseCSV("./scripts/seed-data/decks.csv");
    await batchWrite(decks);
    console.log("🎉 Deck table seeded successfully.");
  } catch (err) {
    console.error("🚨 Failed to seed decks:", err);
  }
})();
