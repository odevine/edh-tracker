import { Alert, AlertTitle, List, ListItem, Slide } from "@mui/material";
import { useEffect } from "react";
import { TransitionGroup } from "react-transition-group";

type AppMessageSeverity = "error" | "info" | "success" | "warning";

export interface IAppMessage {
  id: string;
  content: string;
  severity: AppMessageSeverity;
  title?: string;
  disableTimeout?: boolean;
}

interface AppAlertProps {
  message: IAppMessage;
  onDelete: (id: string) => void;
}

interface AppAlertListProps {
  messages: IAppMessage[];
  onDelete: (id: string) => void;
}

const AppAlert = (props: AppAlertProps): JSX.Element => {
  const { message, onDelete } = props;
  const { id, severity, title, content, disableTimeout = false } = message;
  useEffect(() => {
    setTimeout(function () {
      if (!disableTimeout) {
        onDelete(id);
      }
    }, 3000);
  }, [message]);

  const handleAlertClose = (): void => {
    onDelete(id);
  };

  return (
    <Alert
      onClose={(): void => handleAlertClose()}
      elevation={6}
      variant="filled"
      severity={severity}
      sx={{ whiteSpace: "pre-line" }}
    >
      {title && <AlertTitle>{title}</AlertTitle>}
      {content}
    </Alert>
  );
};

export const AppAlertList = (props: AppAlertListProps): JSX.Element => {
  const { messages, onDelete } = props;

  return (
    <List
      sx={{
        position: "absolute",
        bottom: 0,
        right: 0,
        pb: 3,
        pr: 3,
        zIndex: 1400,
        overflow: "hidden",
      }}
    >
      <TransitionGroup>
        {messages.map(
          (message): JSX.Element => (
            <Slide key={message.id} direction="left">
              <ListItem sx={{ display: "flex", flexDirection: "row-reverse" }}>
                <AppAlert message={message} onDelete={onDelete} />
              </ListItem>
            </Slide>
          ),
        )}
      </TransitionGroup>
    </List>
  );
};
