import {
  DeleteItemCommand,
  DynamoDBClient,
  PutItemCommand,
  ScanCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
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
  let deletedCount = 0;
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
      deletedCount++;
      if (deletedCount % 50 === 0) {
        console.log(`🗑️  Deleted ${deletedCount} items...`);
      }
    }

    lastKey = result.LastEvaluatedKey;
  } while (lastKey);

  console.log(`✅ Deleted a total of ${deletedCount} items`);
}

async function updateStatsFromMatch(match) {
  const formatId = match.formatId;
  const winningDeckId = match.winningDeckId;
  const participants = match.matchParticipants || [];

  for (const p of participants) {
    const isWinner = p.deckId === winningDeckId;

    // update deck formatStats
    const deckResult = await client.send(
      new ScanCommand({
        TableName: DECKS_TABLE,
        FilterExpression: "#id = :deckId",
        ExpressionAttributeNames: { "#id": "id" },
        ExpressionAttributeValues: { ":deckId": { S: p.deckId } },
      }),
    );

    const deckItem = deckResult.Items?.[0];
    if (deckItem) {
      const deck = unmarshall(deckItem);
      deck.formatStats ??= {};
      deck.formatStats[formatId] ??= { gamesPlayed: 0, gamesWon: 0 };

      deck.formatStats[formatId].gamesPlayed += 1;
      if (isWinner) {
        deck.formatStats[formatId].gamesWon += 1;
      }

      await client.send(
        new PutItemCommand({
          TableName: DECKS_TABLE,
          Item: marshall(deck, { removeUndefinedValues: true }),
        }),
      );
    }

    // update user formatStats
    if (p.userId && p.userId !== "unknown") {
      const userResult = await client.send(
        new ScanCommand({
          TableName: "EDH-User-dev",
          FilterExpression: "#id = :userId",
          ExpressionAttributeNames: { "#id": "id" },
          ExpressionAttributeValues: { ":userId": { S: p.userId } },
        }),
      );

      const userItem = userResult.Items?.[0];
      if (userItem) {
        const user = unmarshall(userItem);
        user.formatStats ??= {};
        user.formatStats[formatId] ??= { gamesPlayed: 0, gamesWon: 0 };

        user.formatStats[formatId].gamesPlayed += 1;
        if (isWinner) {
          user.formatStats[formatId].gamesWon += 1;
        }

        await client.send(
          new PutItemCommand({
            TableName: "EDH-User-dev",
            Item: marshall(user, { removeUndefinedValues: true }),
          }),
        );
      }
    }
  }
}

async function runStatsBackfill() {
  console.log("📊 Running stats backfill...");

  const result = await client.send(new ScanCommand({ TableName: MATCH_TABLE }));
  const grouped = {};

  for (const item of result.Items || []) {
    const unmarshalled = Object.fromEntries(
      Object.entries(item).map(([k, v]) => [k, Object.values(v)[0]]),
    );

    const pk = unmarshalled.PK;
    const matchId = pk.split("#")[1];

    if (!grouped[matchId]) {
      grouped[matchId] = { matchParticipants: [] };
    }

    if (unmarshalled.SK === "METADATA") {
      grouped[matchId] = { ...grouped[matchId], ...unmarshalled };
    } else if (unmarshalled.SK.startsWith("PARTICIPANT#")) {
      grouped[matchId].matchParticipants.push(unmarshalled);
    }
  }

  let count = 0;
  const total = Object.keys(grouped).length;

  for (const match of Object.values(grouped)) {
    await updateStatsFromMatch(match);
    count++;
    if (count % 25 === 0 || count === total) {
      console.log(`📈 Processed ${count} / ${total} matches for stats`);
    }
  }

  console.log("✅ Stats backfill complete");
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
  await runStatsBackfill();
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
});
