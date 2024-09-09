const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  GetCommand,
  PutCommand,
  DynamoDBDocumentClient,
} = require("@aws-sdk/lib-dynamodb");
const axios = require("axios");
const express = require("express");
const bodyParser = require("body-parser");

const ddbClient = new DynamoDBClient({ region: process.env.TABLE_REGION });
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

let tableName = "CardPrices";
if (process.env.ENV && process.env.ENV !== "NONE") {
  tableName = tableName + "-" + process.env.ENV;
}

const app = express();
app.use(bodyParser.json());

const SCRYFALL_API_URL = "https://api.scryfall.com/cards/";

// Basic land types and their snow-covered variants
const BASIC_LAND_TYPES = [
  "Plains",
  "Island",
  "Swamp",
  "Mountain",
  "Forest",
  "Wastes",
  "Snow-Covered Plains",
  "Snow-Covered Island",
  "Snow-Covered Swamp",
  "Snow-Covered Mountain",
  "Snow-Covered Forest",
  "Snow-Covered Wastes",
];

const LAND_CYCLES = {
  "cycle-ody-filterland": [
    "Skycloud Expanse",
    "Sunscorched Divide",
    "Darkwater Catacombs",
    "Viridescent Bog",
    "Mossfire Valley",
    "Ferrous Lake",
    "Desolate Mire",
    "Shadowblood Ridge",
    "Sungrass Prairie",
    "Overflowing Basin",
  ],
  "cycle-checkland": [
    "Glacial Fortress",
    "Clifftop Retreat",
    "Drowned Catacomb",
    "Woodland Cemetery",
    "Rootbound Crag",
    "Sulfur Falls",
    "Isolated Chapel",
    "Dragonskull Summit",
    "Sunpetal Grove",
    "Hinterland Harbor",
  ],
  "cycle-bfz-tangoland": [
    "Prairie Stream",
    "Sunken Hollow",
    "Cinder Glade",
    "Smoldering Marsh",
    "Canopy Vista",
  ],
  "cycle-horizon-land": [
    "Sunbaked Canyon",
    "Nurturing Peatland",
    "Fiery Islet",
    "Silent Clearing",
    "Horizon Canopy",
    "Waterlogged Grove",
  ],
  "cycle-fastland": [
    "Seachrome Coast",
    "Inspiring Vantage",
    "Darkslick Shores",
    "Blooming Marsh",
    "Copperline Gorge",
    "Spirebluff Canal",
    "Concealed Courtyard",
    "Blackcleave Cliffs",
    "Razorverge Thicket",
    "Botanical Sanctum",
  ],
  "cycle-fetchland": [
    "Flooded Strand",
    "Arid Mesa",
    "Polluted Delta",
    "Verdant Catacombs",
    "Wooded Foothills",
    "Scalding Tarn",
    "Marsh Flats",
    "Bloodstained Mire",
    "Windswept Heath",
    "Misty Rainforest",
  ],
  "cycle-shm-filterland": [
    "Mystic Gate",
    "Rugged Prairie",
    "Sunken Ruins",
    "Twilight Mire",
    "Fire-Lit Thicket",
    "Cascade Bluffs",
    "Fetid Heath",
    "Graven Cairns",
    "Wooded Bastion",
    "Flooded Grove",
  ],
  "cycle-pathway": [
    "Hengegate Pathway",
    "Needleverge Pathway",
    "Clearwater Pathway",
    "Darkbore Pathway",
    "Cragcrown Pathway",
    "Riverglide Pathway",
    "Brightclimb Pathway",
    "Blightstep Pathway",
    "Branchloft Pathway",
    "Barkchannel Pathway",
  ],
  "cycle-crowdland": [
    "Sea of Clouds",
    "Spectator Seating",
    "Morphic Pool",
    "Undergrowth Stadium",
    "Spire Garden",
    "Training Center",
    "Vault of Champions",
    "Luxury Suite",
    "Bountiful Promenade",
    "Rejuvenating Springs",
  ],
  "cycle-painland": [
    "Adarkar Wastes",
    "Battlefield Forge",
    "Underground River",
    "Llanowar Wastes",
    "Karplusan Forest",
    "Shivan Reef",
    "Caves of Koilos",
    "Sulfurous Springs",
    "Brushland",
    "Yavimaya Coast",
  ],
  "cycle-shockland": [
    "Hallowed Fountain",
    "Sacred Foundry",
    "Watery Grave",
    "Overgrown Tomb",
    "Stomping Ground",
    "Steam Vents",
    "Godless Shrine",
    "Blood Crypt",
    "Temple Garden",
    "Breeding Pool",
  ],
  "cycle-reveal-land": [
    "Port Town",
    "Furycalm Snarl",
    "Choked Estuary",
    "Necroblossom Snarl",
    "Game Trail",
    "Frostboil Snarl",
    "Shineshadow Snarl",
    "Foreboding Ruins",
    "Fortified Village",
    "Vineglimmer Snarl",
  ],
  "cycle-dual-surveil-land": [
    "Meticulous Archive",
    "Elegant Parlor",
    "Undercity Sewers",
    "Underground Mortuary",
    "Commercial District",
    "Thundering Falls",
    "Shadowy Backstreet",
    "Raucous Theater",
    "Lush Portico",
    "Hedge Maze",
  ],
  "iko-triome": [
    "Indatha Triome",
    "Ketria Triome",
    "Raugrin Triome",
    "Savai Triome",
    "Zagoth Triome",
  ],
  "ala-shardland": [
    "Arcane Sanctum",
    "Crumbling Necropolis",
    "Jungle Shrine",
    "Savage Lands",
    "Seaside Citadel",
  ],
};

const findOracleTag = (cardName) => {
  for (const oracleTag in LAND_CYCLES) {
    if (LAND_CYCLES[oracleTag].includes(cardName)) {
      return oracleTag;
    }
  }
  return null;
};

const fetchCheapestCardPrice = async (cardName, delayMs = 100) => {
  const apiUrl = `${SCRYFALL_API_URL}named?exact=${encodeURIComponent(cardName)}&order=usd&dir=asc&unique=prints`;

  try {
    // Wait for the delay before making the API call
    await delay(delayMs);

    // Make the API request using axios
    const response = await axios.get(apiUrl);

    if (!response.ok) {
      return null;
    }

    return findLowestUsdPrice(response.data);
  } catch (error) {
    console.error(error, cardName);
    return null;
  }
};

const fetchCycleCardsByOracleTag = async (oracleTag) => {
  const apiUrl = `${SCRYFALL_API_URL}search?q=oracletag:${encodeURIComponent(oracleTag)}+type:land&order=usd&dir=asc&unique=cards`;

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

const getCheapestCycleLandPrice = async (cardName) => {
  const oracleTag = findOracleTag(cardName);

  if (!oracleTag) {
    console.error("Card does not belong to any known cycle.");
    return null;
  }

  // Fetch data for all lands in the cycle based on the oracle tag
  const cycleCardsData = await fetchCycleCardsByOracleTag(oracleTag);

  // Sort by price.usd (ascending)
  const sortedByPrice = cycleCardsData
    .filter((card) => card.prices && card.prices.usd) // Only include cards with a USD price
    .sort((a, b) => parseFloat(a.prices.usd) - parseFloat(b.prices.usd));

  // Return the lowest price, if any
  if (sortedByPrice.length > 0) {
    return parseFloat(sortedByPrice[0].prices.usd);
  } else {
    return null;
  }
};

// Helper function to check if data is within 24 hours
const isWithin24Hours = (timestamp) => {
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;
  return Date.now() - timestamp < ONE_DAY_MS;
};

const findLowestUsdPrice = (cards) => {
  let lowestPrice = null;

  cards.forEach((card) => {
    // Check if the card has a valid USD price
    if (card.prices && card.prices.usd) {
      const cardPrice = parseFloat(card.prices.usd);

      // Update the lowest price if needed
      if (lowestPrice === null || cardPrice < lowestPrice) {
        lowestPrice = cardPrice;
      }
    }
  });

  return lowestPrice;
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
    console.log(`Saved price for ${cardName} to DynamoDB`);
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

  const cardQty = parseInt(match[1], 10); // Quantity is the first capture group
  const cardName = match[2].trim();

  return { cardQty, cardName };
};

// Main route to handle card price check
app.post("/priceCheck", async function (req, res) {
  const { cards } = req.body; // Expect { "cards": [ "1 CardName", "2 CardName" ] }
  if (!cards || !Array.isArray(cards)) {
    return res.status(400).json({
      error:
        "Invalid input: 'cards' should be an array of card names with quantities.",
    });
  }

  const results = [];

  for (const cardInput of cards) {
    const { cardQty, cardName } = parseCardInput(cardInput);

    if (cardName === null) {
      return res.status(400).json({
        error: `Invalid input: '${cardInput}' did not match required line formatting.`,
      });
    }

    // Ignore basic lands
    if (BASIC_LAND_TYPES.includes(cardName)) {
      results.push({
        name: cardName,
        quantity: cardQty,
        price: 0,
      });
      continue;
    }

    // Check price in DynamoDB
    let cardPrice = await getPriceFromDynamoDB(cardName);

    if (cardPrice === null) {
      // Check if it's a land that belongs to a cycle
      const isCycleLand = await getCheapestCycleLandPrice(cardName);
      if (isCycleLand !== null) {
        cardPrice = isCycleLand;
      } else {
        // Otherwise, fetch the cheapest printing of the card
        cardPrice = await fetchCheapestCardPrice(cardName);
      }
      if (cardPrice !== null) {
        // Save the fetched price to DynamoDB
        await savePriceToDynamoDB(cardName, cardPrice);
      } else {
        // Handle cases where price could not be fetched
        cardPrice === null;
      }
    }

    // Add result to array
    results.push({
      name: cardName,
      quantity: cardQty,
      price: cardPrice,
    });
  }

  // Return the final results
  res.json(results);
});

// Export the app object for Lambda
module.exports = app;
