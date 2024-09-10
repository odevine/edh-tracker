import {
  Button,
  CircularProgress,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { post } from "aws-amplify/api";
import { navigate } from "raviger";
import { useState } from "react";

import { useUser } from "@/Context";

interface PriceCheckCard {
  name: string;
  quantity: number | null;
  price: number | null;
}

// Function to parse the decklist and extract card names and quantities
export function parseDecklist(decklist: string): string[] {
  const parsedDecklist: string[] = [];

  // Split the decklist by newlines
  const lines = decklist.split("\n");

  // Regular expression to match lines with the format: <quantity> <card name> (optional set/collector number/foil)
  const regex = /^\s*(\d+)\s+([^(]+)/;

  lines.forEach((line) => {
    // Use regex to extract quantity and card name
    const match = line.match(regex);

    if (match) {
      const quantity = match[1];
      let cardName = match[2].trim();

      // Check if the cardName contains "//" and trim anything after it
      const splitCardIndex = cardName.indexOf(" // ");
      if (splitCardIndex !== -1) {
        cardName = cardName.substring(0, splitCardIndex).trim();
      }

      // Add to the parsed list in the format: "quantity cardName"
      parsedDecklist.push(`${quantity} ${cardName}`);
    }
  });

  return parsedDecklist;
}

export const HomePage = (): JSX.Element => {
  const { authenticatedUser } = useUser();
  const [priceLoading, setPriceLoading] = useState(false);
  const [deckList, setDeckList] = useState("");
  const [deckPrice, setDeckPrice] = useState("");

  const isPriceCheckCardArray = (data: any): data is PriceCheckCard[] => {
    return (
      Array.isArray(data) &&
      data.every(
        (item) =>
          typeof item.name === "string" &&
          (typeof item.quantity === "number" || item.quantity === null) &&
          (typeof item.price === "number" || item.price === null),
      )
    );
  };

  const handleButtonClick = async () => {
    if (deckList.trim() === "") {
      setDeckPrice("deck cannot be empty");
      return;
    }

    try {
      setPriceLoading(true);
      const restOperation = post({
        apiName: "edhtrackerREST",
        path: "/priceCheck",
        options: {
          body: {
            cards: parseDecklist(deckList),
          },
        },
      });
      const response = await restOperation.response;
      if (response.statusCode === 200) {
        const data: unknown = await response.body.json();

        if (isPriceCheckCardArray(data)) {
          const cards: PriceCheckCard[] = data;
          const total = cards.reduce((acc, card) => {
            const quantity = card.quantity ?? 0; // Use 0 if quantity is null
            const price = card.price ?? 0;
            return acc + quantity * price;
          }, 0);
          setDeckPrice(`$${total.toFixed(2)}`);
        }
      }
    } catch (error) {
      console.error("Error calling Lambda:", error);
      setDeckPrice("an error occurred");
    } finally {
      setPriceLoading(false);
    }
  };

  if (!authenticatedUser) {
    return (
      <Container sx={{ p: 3 }}>
        <Stack
          direction="column"
          alignItems="center"
          justifyContent="center"
          sx={{ height: "calc(100vh - 64px)" }}
        >
          <Paper
            sx={{
              width: 340,
              height: 200,
              p: 2,
            }}
          >
            <Stack
              direction="column"
              alignItems="center"
              justifyContent="center"
              spacing={2}
              sx={{ height: "100%", textAlign: "center" }}
            >
              <Typography variant="h4">login to access edh tracker</Typography>
              <Button variant="contained" onClick={() => navigate("/login")}>
                log in
              </Button>
            </Stack>
          </Paper>
        </Stack>
      </Container>
    );
  }

  return (
    <Stack
      sx={{ height: "100%", width: "100%", textAlign: "center" }}
      justifyContent="center"
      alignItems="center"
      spacing={2}
    >
      <Typography variant="h5">deck price check</Typography>
      <TextField
        sx={{ maxWidth: 600 }}
        placeholder={`1 Emry, Lurker of the Loch
          28 Islands
          1 Fabricate (40K) 181
          1 Malevolent Hermit // Benevolent Geist (MID) 61 *F*
          ...
        `.split("\n").map(line => line.trim()).join("\n")}
        multiline
        rows={25}
        fullWidth
        onChange={(event) => setDeckList(event.target.value)}
      />
      <Button
        onClick={handleButtonClick}
        variant="contained"
        disabled={priceLoading} // Disable button while loading
      >
        {priceLoading ? "checking..." : "check price"}
      </Button>
      {/* Show a loading spinner when price is being calculated */}
      {priceLoading ? (
        <CircularProgress size={24} />
      ) : (
        <Typography>{deckPrice !== "" ? deckPrice : "???"}</Typography>
      )}
    </Stack>
  );
};
