import { useAuthenticator } from "@aws-amplify/ui-react";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { Matches } from "@/API";

// Define the type for the user profile context
interface MatchesContextType {
  allMatches: Matches[];
  matchesLoading: boolean;
}

// Create the context
const MatchesContext = createContext<MatchesContextType | undefined>(undefined);

// UserProvider component
export const MatchesProvider = ({ children }: PropsWithChildren<{}>) => {
  const { user } = useAuthenticator((context) => [context.user]);
  const [allMatches, setAllMatches] = useState<Matches[]>([]);
  const [matchesLoading, setMatchesLoading] = useState<boolean>(true);

  useEffect(() => {
    if (user) {
      setMatchesLoading(true);
      fetchMatches();
    }
  }, [user]);

  const fetchMatches = async () => {
    try {
      // TODO: finish matches logic
      setAllMatches([]);
    } catch (error) {
      console.error("Failed to fetch matches:", error);
    } finally {
      setMatchesLoading(false);
    }
  };

  return (
    <MatchesContext.Provider
      value={{
        allMatches,
        matchesLoading,
      }}
    >
      {children}
    </MatchesContext.Provider>
  );
};

// Export the useUser hook to access the context
export const useMatches = () => {
  const context = useContext(MatchesContext);
  if (!context) {
    throw new Error("useMatches must be used within a MatchesProvider");
  }
  return context;
};
