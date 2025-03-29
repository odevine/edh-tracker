import {
  Box,
  Card,
  CardMedia,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

import { getCardArt } from "@/logic";

interface CardImageMiniCardProps {
  cardName?: string;
}

export const CardImageMiniCard: React.FC<CardImageMiniCardProps> = ({
  cardName,
}) => {
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const PREVIEW_HEIGHT = 300;
  const PREVIEW_WIDTH = PREVIEW_HEIGHT * 0.7159;

  useEffect(() => {
    if (!cardName) {
      setError("No card name provided");
      setLoading(false);
      return;
    }

    setLoading(true); // Set loading state when starting the fetch

    getCardArt(cardName)
      .then((url) => {
        if (url) {
          setImgUrl(url);
        } else {
          setError("Image not found");
        }
      })
      .catch(() => setError("Failed to load card image"))
      .finally(() => setLoading(false)); // Ensure loading is set to false after fetch completes
  }, [cardName]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height={PREVIEW_HEIGHT}
        width={PREVIEW_WIDTH}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height={PREVIEW_HEIGHT}
      >
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Card>
      <CardMedia
        component="img"
        alt={cardName}
        height={PREVIEW_HEIGHT}
        width={PREVIEW_WIDTH}
        image={imgUrl || ""}
      />
    </Card>
  );
};
