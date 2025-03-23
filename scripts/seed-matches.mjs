import {
  DeleteItemCommand,
  DynamoDBClient,
  PutItemCommand,
  ScanCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import csv from "csv-parser";
import fs from "fs";

const MATCH_TABLE = process.env.MATCH_TABLE || "EDH-Match-dev";
const DECKS_TABLE = process.env.DECKS_TABLE || "EDH-Deck-dev";
const REGION = process.env.AWS_REGION || "us-east-1";

const client = new DynamoDBClient({ region: REGION });

async function loadCSV(filePath) {
  const rows = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => rows.push(row))
      .on("end", () => resolve(rows))
      .on("error", reject);
  });
}

function groupParticipants(participants) {
  const grouped = {};
  for (const p of participants) {
    if (!grouped[p.matchId]) grouped[p.matchId] = [];
    grouped[p.matchId].push(p);
  }
  return grouped;
}

async function loadDeckOwnershipMap() {
  const deckMap = {};
  let lastKey;

  do {
    const result = await client.send(
      new ScanCommand({
        TableName: DECKS_TABLE,
        ExclusiveStartKey: lastKey,
      }),
    );

    for (const item of result.Items || []) {
      const unmarshalled = Object.fromEntries(
        Object.entries(item).map(([k, v]) => [k, Object.values(v)[0]]),
      );
      deckMap[unmarshalled.id] = unmarshalled.userId;
    }

    lastKey = result.LastEvaluatedKey;
  } while (lastKey);

  return deckMap;
}

async function deleteAllItems() {
  console.log("🧹 Deleting all existing match items...");
  let lastKey;

  do {
    const result = await client.send(
      new ScanCommand({
        TableName: MATCH_TABLE,
        ExclusiveStartKey: lastKey,
        ProjectionExpression: "PK, SK",
      }),
    );

    for (const item of result.Items || []) {
      await client.send(
        new DeleteItemCommand({
          TableName: MATCH_TABLE,
          Key: {
            PK: item.PK,
            SK: item.SK,
          },
        }),
      );
    }

    lastKey = result.LastEvaluatedKey;
  } while (lastKey);
}

async function seed() {
  await deleteAllItems();

  const matches = await loadCSV("./scripts/seed-data/matches.csv");
  const participants = await loadCSV(
    "./scripts/seed-data/match-participants.csv",
  );
  const groupedParticipants = groupParticipants(participants);
  const deckOwnershipMap = await loadDeckOwnershipMap();

  const unknownUsers = [];

  for (const match of matches) {
    const pk = `MATCH#${match.id}`;
    const timestamp = new Date().toISOString();

    const matchItem = {
      PK: pk,
      SK: "METADATA",
      id: match.id,
      winningDeckId: match.winningDeckId,
      formatId: match.formatId,
      archived: match.archived === "True" || match.archived === true,
      datePlayed: match.datePlayed,
      createdAt: match.createdAt,
      updatedAt: match.updatedAt,
    };

    await client.send(
      new PutItemCommand({
        TableName: MATCH_TABLE,
        Item: marshall(matchItem, { removeUndefinedValues: true }),
      }),
    );

    const related = groupedParticipants[match.id] || [];
    for (const p of related) {
      const userId = deckOwnershipMap[p.deckId];
      if (!userId) {
        unknownUsers.push({
          matchId: match.id,
          participantId: p.id,
          deckId: p.deckId,
        });
      }

      const participantItem = {
        PK: pk,
        SK: `PARTICIPANT#${p.id}`,
        id: p.id,
        matchId: p.matchId,
        deckId: p.deckId,
        userId: userId || "unknown",
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      };

      await client.send(
        new PutItemCommand({
          TableName: MATCH_TABLE,
          Item: marshall(participantItem, { removeUndefinedValues: true }),
        }),
      );
    }

    console.log(
      `✅ Seeded match ${match.id} with ${related.length} participants`,
    );
  }

  if (unknownUsers.length > 0) {
    console.warn(
      `⚠️  ${unknownUsers.length} participant(s) had missing userId:`,
    );
    for (const u of unknownUsers) {
      console.warn(
        `- matchId: ${u.matchId}, participantId: ${u.participantId}, deckId: ${u.deckId}`,
      );
    }
  }

  console.log("🎉 Match seed complete");
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
});
