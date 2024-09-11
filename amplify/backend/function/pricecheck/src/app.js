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

const BASIC_LAND_TYPES = [
  "plains",
  "island",
  "islands",
  "swamp",
  "swamps",
  "mountain",
  "mountains",
  "forest",
  "forests",
  "wastes",
  "snow-covered plains",
  "snow-covered island",
  "snow-covered islands",
  "snow-covered swamp",
  "snow-covered swamps",
  "snow-covered mountain",
  "snow-covered mountains",
  "snow-covered forest",
  "snow-covered forests",
  "snow-covered wastes",
];

const LAND_CYCLES = {
  "cycle-ody-filterland": [
    "skycloud expanse",
    "sunscorched divide",
    "darkwater catacombs",
    "viridescent bog",
    "mossfire valley",
    "ferrous lake",
    "desolate mire",
    "shadowblood ridge",
    "sungrass prairie",
    "overflowing basin",
  ],
  "cycle-checkland": [
    "glacial fortress",
    "clifftop retreat",
    "drowned catacomb",
    "woodland cemetery",
    "rootbound crag",
    "sulfur falls",
    "isolated chapel",
    "dragonskull summit",
    "sunpetal grove",
    "hinterland harbor",
  ],
  "cycle-bfz-tangoland": [
    "prairie stream",
    "sunken hollow",
    "cinder glade",
    "smoldering marsh",
    "canopy vista",
  ],
  "cycle-horizon-land": [
    "sunbaked canyon",
    "nurturing peatland",
    "fiery islet",
    "silent clearing",
    "horizon canopy",
    "waterlogged grove",
  ],
  "cycle-fastland": [
    "seachrome coast",
    "inspiring vantage",
    "darkslick shores",
    "blooming marsh",
    "copperline gorge",
    "spirebluff canal",
    "concealed courtyard",
    "blackcleave cliffs",
    "razorverge thicket",
    "botanical sanctum",
  ],
  "cycle-fetchland": [
    "flooded strand",
    "arid mesa",
    "polluted delta",
    "verdant catacombs",
    "wooded foothills",
    "scalding tarn",
    "marsh flats",
    "bloodstained mire",
    "windswept heath",
    "misty rainforest",
  ],
  "cycle-shm-filterland": [
    "mystic gate",
    "rugged prairie",
    "sunken ruins",
    "twilight mire",
    "fire-lit thicket",
    "cascade bluffs",
    "fetid heath",
    "graven cairns",
    "wooded bastion",
    "flooded grove",
  ],
  "cycle-pathway": [
    "hengegate pathway",
    "needleverge pathway",
    "clearwater pathway",
    "darkbore pathway",
    "cragcrown pathway",
    "riverglide pathway",
    "brightclimb pathway",
    "blightstep pathway",
    "branchloft pathway",
    "barkchannel pathway",
  ],
  "cycle-crowdland": [
    "sea of clouds",
    "spectator seating",
    "morphic pool",
    "undergrowth stadium",
    "spire garden",
    "training center",
    "vault of champions",
    "luxury suite",
    "bountiful promenade",
    "rejuvenating springs",
  ],
  "cycle-painland": [
    "adarkar wastes",
    "battlefield forge",
    "underground river",
    "llanowar wastes",
    "karplusan forest",
    "shivan reef",
    "caves of koilos",
    "sulfurous springs",
    "brushland",
    "yavimaya coast",
  ],
  "cycle-shockland": [
    "hallowed fountain",
    "sacred foundry",
    "watery grave",
    "overgrown tomb",
    "stomping ground",
    "steam vents",
    "godless shrine",
    "blood crypt",
    "temple garden",
    "breeding pool",
  ],
  "cycle-reveal-land": [
    "port town",
    "furycalm snarl",
    "choked estuary",
    "necroblossom snarl",
    "game trail",
    "frostboil snarl",
    "shineshadow snarl",
    "foreboding ruins",
    "fortified village",
    "vineglimmer snarl",
  ],
  "cycle-dual-surveil-land": [
    "meticulous archive",
    "elegant parlor",
    "undercity sewers",
    "underground mortuary",
    "commercial district",
    "thundering falls",
    "shadowy backstreet",
    "raucous theater",
    "lush portico",
    "hedge maze",
  ],
  "iko-triome": [
    "indatha triome",
    "ketria triome",
    "raugrin triome",
    "savai triome",
    "zagoth triome",
  ],
  "ala-shardland": [
    "arcane sanctum",
    "crumbling necropolis",
    "jungle shrine",
    "savage lands",
    "seaside citadel",
  ],
  "cycle-abu-dual-land": [
    "badlands",
    "bayou",
    "plateau",
    "savannah",
    "scrubland",
    "taiga",
    "tropical island",
    "tundra",
    "underground sea",
    "volcanic island",
  ],
};

const ILLEGAL_SETS = [
  "30a",
  "cei",
  "ced",
  "wc97",
  "wc98",
  "wc99",
  "wc00",
  "wc01",
  "wc02",
  "wc03",
  "wc04",
  "hhO12",
  "hhO13",
  "ugl",
  "unh",
  "ust",
  "unf",
];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const findLowestUsdPrice = (cards) => {
  let lowestPrice = null;

  cards.forEach((card) => {
    // Check if the card has a valid USD price and is not included in an illegal set
    if (
      card.prices &&
      card.prices.usd &&
      !ILLEGAL_SETS.includes(card.set.toLowerCase())
    ) {
      const cardPrice = parseFloat(card.prices.usd);

      // Update the lowest price if needed
      if (lowestPrice === null || cardPrice < lowestPrice) {
        lowestPrice = cardPrice;
      }
    }
  });

  return lowestPrice;
};

const fetchCheapestCardPrice = async (cardName, delayMs = 100) => {
  const apiUrl = `${SCRYFALL_API_URL}search?q=name%3A${encodeURIComponent(cardName)}&order=usd&dir=asc&unique=prints`;

  try {
    // Make the API request using axios
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
  const apiUrl = `${SCRYFALL_API_URL}search?q=oracletag:${encodeURIComponent(oracleTag)}+type:land&order=usd&dir=asc&unique=prints`;

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
  for (const oracleTag in LAND_CYCLES) {
    if (LAND_CYCLES[oracleTag].includes(cardName)) {
      return oracleTag;
    }
  }
  return null;
};

const getCheapestCycleLandPrice = async (cardName) => {
  const oracleTag = findOracleTag(cardName);

  if (!oracleTag) {
    return null;
  }

  // Fetch data for all lands in the cycle based on the oracle tag
  const cycleCardsData = await fetchCycleCardsByOracleTag(oracleTag);

  // Return the lowest usd price of results
  return findLowestUsdPrice(cycleCardsData);
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
      return data.Item.price;
    }
  } catch (error) {
    console.error(`Error querying DynamoDB for ${cardName}:`, error);
  }
  return null;
};

// Function to save price to DynamoDB
const savePriceToDynamoDB = async (cardName, price) => {
  const params = {
    TableName: tableName,
    Item: {
      cardName,
      price,
      timestamp: Date.now(),
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
  // Expect { "cards": [ "1 CardName", "2 CardName" ] }
  if (!cards || !Array.isArray(cards)) {
    return res.status(400).json({
      error:
        "Invalid input: 'cards' should be an array of card names with quantities.",
    });
  }

  // Counter to track the number of API calls made
  let apiCallCounter = 0;

  // Array to hold all the promises for card lookups
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
      };
    }

    // Check price in DynamoDB first
    let cardPrice = await getPriceFromDynamoDB(cardName);

    if (cardPrice === null) {
      // Delay only for Scryfall API calls, staggered by 100ms per API call made
      await delay(apiCallCounter * 100);

      // Check if the card belongs to a land cycle
      const isCycleLand = await getCheapestCycleLandPrice(cardName);
      if (isCycleLand !== null) {
        cardPrice = isCycleLand;
      } else {
        // Otherwise, fetch the cheapest printing of the card from Scryfall
        cardPrice = await fetchCheapestCardPrice(cardName);
      }

      // Increment the API call counter only after an actual API call is made
      apiCallCounter++;

      // Save the fetched price to DynamoDB, if a valid price was found
      if (cardPrice !== null) {
        await savePriceToDynamoDB(cardName, cardPrice);
      } else {
        // Handle cases where price could not be fetched
        cardPrice = null;
      }
    }

    // Return the result object for this card
    return {
      name: cardName,
      quantity: cardQty,
      price: cardPrice,
    };
  });

  // Wait for all promises to resolve
  const cardResults = await Promise.all(promises);

  // Return the final results
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
