// scripts/seed-formats.mjs
import {
  BatchWriteItemCommand,
  DynamoDBClient,
} from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import csv from "csv-parser";
import fs from "fs";

const TABLE_NAME = process.env.FORMATS_TABLE || "EDH-Format-dev";
const REGION = process.env.AWS_REGION || "us-east-1";

const client = new DynamoDBClient({ region: REGION });

function parseCSV(filePath) {
  return new Promise((resolve, reject) => {
    const items = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        const item = {
          id: row.id === "none" ? "unranked" : row.id,
          name: row.name,
          createdAt: row.createdAt,
          updatedAt: row.updatedAt,
          inactive: row.inactive,
        };
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
      const command = new BatchWriteItemCommand(params);
      await client.send(command);
      console.log(`✅ Inserted ${chunk.length} items into ${TABLE_NAME}`);
    } catch (err) {
      console.error("❌ Error inserting batch:", err);
    }
  }
}

(async () => {
  try {
    const items = await parseCSV("./scripts/seed-data/formats.csv");
    await batchWrite(items);
    console.log("🎉 Formats table seeded successfully.");
  } catch (err) {
    console.error("🚨 Failed to seed table:", err);
  }
})();
