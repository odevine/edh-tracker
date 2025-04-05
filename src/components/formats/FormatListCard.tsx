import {
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Collapse,
  Stack,
  Typography,
  useMediaQuery,
  useTheme as useMuiTheme,
} from "@mui/material";

import { FormatDetailPanel } from "@/components";
import { Format } from "@/types";

interface FormatListCardProps {
  format: Format;
  selected?: boolean;
  onClick: (format: Format) => void;
  onEdit: (formatId: string) => void;
}

export function FormatListCard({
  format,
  selected,
  onClick,
  onEdit,
}: FormatListCardProps) {
  const muiTheme = useMuiTheme();
  const hideDetailsPanel = useMediaQuery(muiTheme.breakpoints.down("lg"));

  return (
    <Card
      sx={(theme) => ({
        mb: 1,
        borderRadius: "10px",
        outline: `${selected ? 2 : 0}px solid ${theme.palette.primary.main}`,
        backgroundColor: selected
          ? theme.palette.action.selected
          : theme.palette.background.paper,
      })}
    >
      <CardActionArea onClick={() => onClick(format)} disableRipple>
        <CardContent>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
          >
            <Typography variant="h6">{format.displayName}</Typography>
            {format.id !== "unranked" && (
              <Stack direction="row" spacing={1}>
                <Chip label={`${format.playerRange} players`} />
                {format.singleton && <Chip label="singleton" />}
                {format.requiresCommander && <Chip label="commander" />}
              </Stack>
            )}
          </Stack>
        </CardContent>
      </CardActionArea>
      {hideDetailsPanel && (
        <Collapse in={selected}>
          <FormatDetailPanel format={format} onEdit={onEdit} />
        </Collapse>
      )}
    </Card>
  );
}
