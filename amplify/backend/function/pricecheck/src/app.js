const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  GetCommand,
  PutCommand,
  ScanCommand,
  BatchWriteCommand,
  DynamoDBDocumentClient,
} = require("@aws-sdk/lib-dynamodb");
const axios = require("axios");
const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");

const {
  BASIC_LAND_TYPES,
  LAND_CYCLES,
  ILLEGAL_SETS,
  CYCLE_LAND_LOOKUP,
} = require("./cardConstants");

const ddbClient = new DynamoDBClient({ region: process.env.TABLE_REGION });
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

let tableName = "CardPrices";
if (process.env.ENV && process.env.ENV !== "NONE") {
  tableName = tableName + "-" + process.env.ENV;
}

const app = express();
app.use(bodyParser.json());
app.use(cors());

const SCRYFALL_API_URL = "https://api.scryfall.com/cards/";
const MAX_BATCH_SIZE = 25;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const findLowestUsdPrice = (cards) => {
  let lowestPriceData = null;

  cards.forEach((card) => {
    // Check if the card has a valid USD price and is not included in an illegal set
    if (
      card.prices &&
      card.prices.usd &&
      !ILLEGAL_SETS.includes(card.set.toLowerCase())
    ) {
      const cardPrice = parseFloat(card.prices.usd);

      // Update the lowest price data if needed
      if (lowestPriceData === null || cardPrice < lowestPriceData.price) {
        lowestPriceData = {
          name: card.name,
          price: cardPrice,
          setCode: card.set.toLowerCase(),
          collectorNumber: card.collector_number.toLowerCase(),
        };
      }
    }
  });

  return lowestPriceData;
};

const fetchCheapestCardPrice = async (cardName) => {
  const apiUrl = `${SCRYFALL_API_URL}search?q=%21%22${encodeURIComponent(cardName)}%22&unique=prints`;

  try {
    const response = await axios.get(apiUrl);
    if (response.status !== 200) {
      return null;
    }

    return findLowestUsdPrice(response.data.data);
  } catch (error) {
    console.error(error, cardName);
    return null;
  }
};

const fetchCycleCardsByOracleTag = async (oracleTag) => {
  const apiUrl = `${SCRYFALL_API_URL}search?q=oracletag:${encodeURIComponent(oracleTag)}+type:land&unique=prints`;

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`Error fetching cycle cards: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data; // Contains the card objects for the cycle
  } catch (error) {
    console.error("Error fetching cycle cards:", error);
    return [];
  }
};

const findOracleTag = (cardName) => {
  return CYCLE_LAND_LOOKUP[cardName.toLowerCase()] || null;
};

const getCheapestCycleLandPrice = async (cardName) => {
  const oracleTag = findOracleTag(cardName);

  if (!oracleTag) {
    return null;
  }

  // Fetch data for all lands in the cycle based on the oracle tag
  const cycleCardsData = await fetchCycleCardsByOracleTag(oracleTag);

  // Return the lowest usd price of results
  return {
    tag: oracleTag,
    ...findLowestUsdPrice(cycleCardsData),
  };
};

// Helper function to check if data is within 24 hours
const isWithin24Hours = (timestamp) => {
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;
  return Date.now() - timestamp < ONE_DAY_MS;
};

// Function to get price from DynamoDB
const getPriceFromDynamoDB = async (cardName) => {
  const params = {
    TableName: tableName,
    Key: {
      cardName: cardName,
    },
  };

  try {
    const data = await ddbDocClient.send(new GetCommand(params));
    if (data.Item && isWithin24Hours(data.Item.timestamp)) {
      return {
        price: data.Item.price,
        setCode: data.Item.setCode,
        collectorNumber: data.Item.collectorNumber,
        altName: data.Item.altName,
        priceNote: data.Item.priceNote,
      };
    }
  } catch (error) {
    console.error(`Error querying DynamoDB for ${cardName}:`, error);
  }
  return null;
};

// Function to save price to DynamoDB
const savePriceToDynamoDB = async (cardName, priceData) => {
  // 24hr expiry
  const expirationTime = Math.floor(Date.now() / 1000) + 24 * 60 * 60;
  const params = {
    TableName: tableName,
    Item: {
      cardName,
      altName: priceData.altName ?? priceData.name,
      price: priceData.price,
      setCode: priceData.setCode,
      collectorNumber: priceData.collectorNumber,
      priceNote: priceData.priceNote,
      timestamp: Date.now(),
      expiry: expirationTime,
    },
  };

  try {
    await ddbDocClient.send(new PutCommand(params));
  } catch (error) {
    console.error(`Error saving price for ${cardName} to DynamoDB:`, error);
  }
};

// Parse card input ("2 Underground Sea") to extract quantity and card name
const parseCardInput = (cardInput) => {
  // Regular expression to match the quantity at the beginning and capture the rest as the card name
  const match = cardInput.match(/^(\d+)\s+(.+)$/);

  if (!match) {
    console.error(`Invalid decklist line format: ${cardInput}`);
    return { cardQty: null, cardName: null };
  }

  const cardQty = parseInt(match[1], 10);
  const cardName = match[2].trim().toLowerCase();

  return { cardQty, cardName };
};

const purgeCache = async () => {
  try {
    // Scan the table to get all items
    const scanParams = {
      TableName: tableName,
    };

    let items;
    let scannedItems = [];

    do {
      const data = await ddbDocClient.send(new ScanCommand(scanParams));
      items = data.Items;
      scannedItems = scannedItems.concat(items);

      // If there's more data to be retrieved (pagination), update the ExclusiveStartKey
      scanParams.ExclusiveStartKey = data.LastEvaluatedKey;
    } while (typeof scanParams.ExclusiveStartKey !== "undefined");

    // Batch delete items in chunks of 25 (max for DynamoDB batch operations)
    const deletePromises = [];
    for (let i = 0; i < scannedItems.length; i += MAX_BATCH_SIZE) {
      const batchItems = scannedItems.slice(i, i + MAX_BATCH_SIZE);
      const deleteParams = {
        RequestItems: {
          [tableName]: batchItems.map((item) => ({
            DeleteRequest: {
              Key: {
                cardName: item.cardName, // Assuming cardName is the partition key
              },
            },
          })),
        },
      };

      // Add the batch write to promises
      deletePromises.push(
        ddbDocClient.send(new BatchWriteCommand(deleteParams)),
      );
    }

    // Execute all batch delete promises
    await Promise.all(deletePromises);

    console.log(`Successfully deleted all items from table ${tableName}`);
  } catch (error) {
    console.error(
      `Error purging cache from DynamoDB table: ${tableName}`,
      error,
    );
    throw error; // Let the error bubble up for proper HTTP response handling
  }
};

app.options("*", cors());

// Main route to handle card price check
app.post("/priceCheck", async function (req, res) {
  const { cards } = req.body;
  if (!cards || !Array.isArray(cards)) {
    return res.status(400).json({
      error:
        "Invalid input: 'cards' should be an array of card names with quantities.",
    });
  }

  let apiCallCounter = 0;
  const promises = cards.map(async (cardInput) => {
    const { cardQty, cardName } = parseCardInput(cardInput);

    if (cardName === null) {
      return res.status(400).json({
        error: `Invalid input: '${cardInput}' did not match required line formatting.`,
      });
    }

    // Ignore basic lands
    if (BASIC_LAND_TYPES.includes(cardName)) {
      return {
        name: cardName,
        quantity: cardQty,
        price: 0,
        setCode: null,
        collectorNumber: null,
        priceNote: "basic land",
      };
    }

    // Check if price is already cached in DynamoDB
    let cardData = await getPriceFromDynamoDB(cardName);
    let alternateCardName = null;

    if (cardData === null) {
      // Add delay to prevent rate limiting when calling the API
      await delay(apiCallCounter * 100);

      // Check if the card is part of a land cycle
      const isCycleLand = await getCheapestCycleLandPrice(cardName);
      if (isCycleLand !== null) {
        const { tag, name, ...rest } = isCycleLand;
        cardData = {
          ...rest,
          priceNote: `cheapest land in cycle '${tag}'`,
        };

        alternateCardName = name.toLowerCase();
        if (alternateCardName !== cardName) {
          cardData.altName = alternateCardName;
        }
      } else {
        // If it's not part of a cycle, fetch the cheapest version of the card itself
        cardData = await fetchCheapestCardPrice(cardName);
      }

      apiCallCounter++;
      if (cardData !== null) {
        await savePriceToDynamoDB(cardName, cardData);
      }
    }

    return {
      name: cardName,
      quantity: cardQty,
      ...cardData,
    };
  });

  const cardResults = await Promise.all(promises);
  res.json(cardResults);
});

// Route to purge all data in the DynamoDB table
app.delete("/purgeCache", async (_req, res) => {
  try {
    await purgeCache();
    res.status(200).json({
      message: `all items successfully deleted from table ${tableName}`,
    });
  } catch (error) {
    console.error("error purging table:", error);
    res.status(500).json({
      error: "failed to purge the table. see logs for details.",
    });
  }
});

// Export the app object for Lambda
module.exports = app;
