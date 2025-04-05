import {
  DynamoDBClient,
  ScanCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

const TABLE_NAME = process.env.DECKS_TABLE || "EDH-Deck-dev";
const REGION = process.env.AWS_REGION || "us-east-1";

const client = new DynamoDBClient({ region: REGION });

const oldFormatId = process.argv[2];
const newFormatId = process.argv[3];

if (!oldFormatId || !newFormatId) {
  console.error(
    "Usage: node update-deck-format-id.mjs <oldFormatId> <newFormatId>",
  );
  process.exit(1);
}

async function updateDeckFormatIds() {
  console.log(`🔍 Scanning for decks with formatId = "${oldFormatId}"...`);

  const decksToUpdate = [];

  let ExclusiveStartKey;
  do {
    const scanCommand = new ScanCommand({
      TableName: TABLE_NAME,
      FilterExpression: "#fid = :oldFormatId",
      ExpressionAttributeNames: { "#fid": "formatId" },
      ExpressionAttributeValues: { ":oldFormatId": { S: oldFormatId } },
      ExclusiveStartKey,
    });

    const { Items, LastEvaluatedKey } = await client.send(scanCommand);
    ExclusiveStartKey = LastEvaluatedKey;

    decksToUpdate.push(...Items.map(unmarshall));
  } while (ExclusiveStartKey);

  console.log(`🛠 Found ${decksToUpdate.length} deck(s) to update.`);

  for (const deck of decksToUpdate) {
    const command = new UpdateItemCommand({
      TableName: TABLE_NAME,
      Key: marshall({ id: deck.id }),
      UpdateExpression: "SET formatId = :newId",
      ExpressionAttributeValues: {
        ":newId": { S: newFormatId },
      },
    });

    try {
      await client.send(command);
      console.log(`✅ Updated deck ${deck.id}`);
    } catch (err) {
      console.error(`❌ Failed to update deck ${deck.id}:`, err);
    }
  }

  console.log("🎉 Format ID update complete.");
}

updateDeckFormatIds();
