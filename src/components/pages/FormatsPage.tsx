import { Box, Stack, Typography, useMediaQuery } from "@mui/material";
import { useCallback, useState } from "react";

import { FormatDetailPanel, FormatListCard, FormatModal } from "@/components";
import { useFormat, useTheme } from "@/hooks";
import { Format } from "@/types";

export const FormatsPage = () => {
  const { allFormats } = useFormat();
  const { muiTheme } = useTheme();
  const showBreakoutDetails = useMediaQuery(muiTheme.breakpoints.up("lg"));

  const [selectedFormat, setSelectedFormat] = useState<Format | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingFormatId, setEditingFormatId] = useState("");

  const handleClick = useCallback(
    (format: Format) => {
      if (selectedFormat && selectedFormat.id === format.id) {
        setSelectedFormat(null);
      } else {
        setSelectedFormat(format);
      }
    },
    [selectedFormat],
  );

  const handleEdit = useCallback((formatId: string) => {
    setEditingFormatId(formatId);
    setModalOpen(true);
  }, []);

  return (
    <>
      <Stack flexDirection={{ xs: "column-reverse", lg: "row" }} gap={3}>
        <Box flex={{ xs: "1 1 100%", lg: "0 0 35%" }}>
          <Typography variant="h5" sx={{ mb: 1 }}>
            active formats
          </Typography>
          {allFormats
            .filter((format) => !format.inactive)
            .map((format) => (
              <FormatListCard
                key={format.id}
                format={format}
                selected={selectedFormat?.id === format.id}
                onClick={handleClick}
                onEdit={handleEdit}
              />
            ))}
          <Typography variant="h5" sx={{ mt: 3, mb: 1 }}>
            retired formats
          </Typography>
          {allFormats
            .filter((format) => format.inactive)
            .map((format) => (
              <FormatListCard
                key={format.id}
                format={format}
                selected={selectedFormat?.id === format.id}
                onClick={handleClick}
                onEdit={handleEdit}
              />
            ))}
        </Box>
        {showBreakoutDetails && (
          <Box flex={1} sx={{ mt: 5 }}>
            <FormatDetailPanel format={selectedFormat} onEdit={handleEdit} />
          </Box>
        )}
      </Stack>
      <FormatModal
        editingFormatId={editingFormatId}
        open={modalOpen}
        onClose={() => {
          setEditingFormatId("");
          setModalOpen(false);
        }}
      />
    </>
  );
};
