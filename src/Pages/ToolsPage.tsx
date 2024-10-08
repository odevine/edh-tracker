import {
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { del, post } from "aws-amplify/api";
import { navigate } from "raviger";
import { UIEvent, useEffect, useRef, useState } from "react";

import { useUser } from "@/Context";

interface PriceCheckCard {
  name: string;
  quantity: number | null;
  altName: string;
  price: number | null;
  setCode: string | null;
  collectorNumber: string | null;
  priceNote?: string;
}

// Function to parse the decklist and extract card names and quantities
function parseDecklist(decklist: string): string[] {
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
        cardName = cardName.substring(0, splitCardIndex).trim().toLowerCase();
      }

      // Add to the parsed list in the format: "quantity cardName"
      parsedDecklist.push(`${quantity} ${cardName}`);
    }
  });

  return parsedDecklist.slice(0, 100);
}

export const ToolsPage = (): JSX.Element => {
  const { authenticatedUser, isAdmin } = useUser();
  const [priceLoading, setPriceLoading] = useState(false);
  const [deckList, setDeckList] = useState("");
  const [priceCheckResponse, setPriceCheckResponse] = useState<
    PriceCheckCard[]
  >([]);
  const textFieldRef = useRef<HTMLDivElement>(null);
  const otherComponentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log(priceCheckResponse);
    if (
      textFieldRef.current &&
      otherComponentRef.current &&
      priceCheckResponse.length > 0
    ) {
      // Sync scroll position after rendering
      otherComponentRef.current.scrollTop = textFieldRef.current.scrollTop;
    }
  }, [priceCheckResponse]);

  const handlePriceCheckClick = async () => {
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
        setPriceCheckResponse(data as PriceCheckCard[]);

        // Sync the scroll of otherComponentRef to match textFieldRef
        if (textFieldRef.current && otherComponentRef.current) {
          otherComponentRef.current.scrollTop = textFieldRef.current.scrollTop;
        }
      }
    } catch (error) {
      console.error("error calling priceCheck lambda:", error);
    } finally {
      setPriceLoading(false);
    }
  };

  const handlePurgeCacheClick = async () => {
    try {
      setPriceLoading(true);
      const restOperation = del({
        apiName: "edhtrackerREST",
        path: "/purgeCache",
      });
      const response = await restOperation.response;
      if (response.statusCode === 200) {
        console.log("cache purged successfully");
      }
    } catch (error) {
      console.error("could not purge cache", error);
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

  const handleScroll = (
    e: UIEvent<HTMLInputElement | HTMLTextAreaElement, UIEvent>,
  ) => {
    if (textFieldRef.current && otherComponentRef.current) {
      const target = e.target as HTMLElement;
      if (target === textFieldRef.current) {
        otherComponentRef.current.scrollTop = target.scrollTop;
      } else {
        textFieldRef.current.scrollTop = target.scrollTop;
      }
    }
  };

  const BOX_ROWS = 25;
  const BOX_LINE_HEIGHT = 24;
  const BOX_PY = 16.5;
  const BOX_PX = 14;
  const BOX_WIDTH = 600;
  const BOX_HEIGHT = BOX_ROWS * BOX_LINE_HEIGHT + 2 * BOX_PY;

  return (
    <Stack
      sx={{
        height: "100%",
        width: "100%",
        minWidth: 1248,
        textAlign: "center",
      }}
      justifyContent="center"
      alignItems="center"
      spacing={2}
    >
      <Typography variant="h5">deck price check</Typography>

      <Stack direction="row" spacing={2} sx={{ height: BOX_HEIGHT }}>
        <Box
          sx={{
            height: BOX_HEIGHT,
            width: BOX_WIDTH,
            overflow: "auto",
          }}
        >
          <TextField
            placeholder={`1 Emry, Lurker of the Loch
              28 Islands
              1 Fabricate (40K) 181
              1 Malevolent Hermit // Benevolent Geist (MID) 61 *F*
              ...
            `
              .split("\n")
              .map((line) => line.trim())
              .join("\n")}
            multiline
            rows={BOX_ROWS}
            fullWidth
            onChange={(event) => setDeckList(event.target.value)}
            inputProps={{
              onScroll: handleScroll as any,
              ref: textFieldRef,
              autoCapitalize: "off",
              autoCorrect: "off",
              spellCheck: false,
              sx: {
                lineHeight: "24px",
                whiteSpace: "pre",
                wrap: "off",
                overflowX: "hidden",
              },
            }}
          />
        </Box>

        {/* Wrapper for the Other Component */}
        <Box
          sx={{
            border: "1px solid #595757",
            textAlign: "left",
            borderRadius: "4px",
            py: `${BOX_PY}px`,
            px: `${BOX_PX}px`,
            color: "#8e8d8f",
            height: BOX_HEIGHT,
          }}
        >
          <Box
            component="div"
            sx={{
              overflow: "auto",
              height: BOX_ROWS * BOX_LINE_HEIGHT,
              width: BOX_WIDTH - 2 * BOX_PX,
            }}
            ref={otherComponentRef}
            onScroll={handleScroll as any}
          >
            {priceCheckResponse.map((line, index) => {
              let cardTextStr = line.name;
              if (line.altName && line.altName.toLowerCase() !== line.name) {
                cardTextStr = line.altName.toLowerCase();
              }

              const cardNameLength = 25;
              if (cardTextStr.length > cardNameLength) {
                cardTextStr = `${cardTextStr.substring(0, cardNameLength - 3)}...`;
              } else {
                cardTextStr = cardTextStr.padEnd(cardNameLength, "\u00A0");
              }

              const cardSetCodeLength = 7;
              let cardSetCode = "";
              if (line.setCode) {
                // If setCode exists, include it and pad to the right
                cardSetCode = ` [${line.setCode}]`;
                cardSetCode = cardSetCode.padEnd(cardSetCodeLength, "\u00A0"); // Pad the result to the specified length
              } else {
                // No setCode, just pad with non-breaking spaces
                cardSetCode = cardSetCode.padEnd(cardSetCodeLength, "\u00A0");
              }

              let cardCollectorNumber = "";
              if (line.collectorNumber) {
                cardCollectorNumber = ` {${line.collectorNumber}}`;
              }

              return (
                <Stack
                  key={index}
                  direction="row"
                  justifyContent="space-between"
                  sx={{ pr: 1 }}
                >
                  <Tooltip
                    title={line.priceNote ?? undefined}
                    placement="left"
                    arrow
                  >
                    <Typography
                      color={line.priceNote ? "primary" : "text.secondary"}
                    >
                      {`${cardTextStr}${cardSetCode}${cardCollectorNumber}`.toLowerCase()}
                    </Typography>
                  </Tooltip>
                  {typeof line.price === "number" && typeof line.quantity === "number" ? (
                    <Typography>
                      {line.quantity > 1 ? `($${line.price.toFixed(2)})` : ""}
                      &nbsp;${(line.price * line.quantity).toFixed(2)}
                    </Typography>
                  ) : (
                    <Typography color="error">could not find</Typography>
                  )}
                </Stack>
              );
            })}
          </Box>
        </Box>
      </Stack>
      <Stack direction="row" spacing={2}>
        <Button
          variant="contained"
          disabled={priceLoading || deckList.trim() === ""}
          onClick={handlePriceCheckClick}
        >
          {priceLoading ? "checking..." : "check price"}
        </Button>
        {isAdmin && (
          <Button
            variant="contained"
            disabled={priceLoading}
            onClick={handlePurgeCacheClick}
          >
            purge cache
          </Button>
        )}
      </Stack>

      {!priceLoading && (
        <Stack
          direction="row"
          spacing={1}
          justifyContent="center"
          alignItems="center"
        >
          <Typography>
            {(() => {
              const total = priceCheckResponse.reduce(
                (acc, card) =>
                  card.price && card.quantity
                    ? acc + card.price * card.quantity
                    : acc,
                0,
              );
              return `total: $${total.toFixed(2)}`;
            })()}
          </Typography>
          <Typography color="error">
            {(() => {
              const errorCount = priceCheckResponse.filter(
                (card) => card.price === null || card.quantity === null,
              ).length;
              if (errorCount === 0) {
                return "";
              }
              const errorText = errorCount === 1 ? "error" : "errors";
              return `(${errorCount} ${errorText})`;
            })()}
          </Typography>
        </Stack>
      )}

      {priceLoading && (
        <Stack direction="row" spacing={2}>
          <CircularProgress size={24} />
          <Typography>this may take a bit...</Typography>
        </Stack>
      )}
    </Stack>
  );
};
