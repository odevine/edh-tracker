import { useAuthenticator } from "@aws-amplify/ui-react";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  CreateMatchesInput,
  MatchParticipants,
  Matches,
  UpdateMatchesInput,
} from "@/API";
import { useApp } from "@/Context";
import {
  createMatch,
  createNewMatchParticipants,
  deleteMatchWithParticipants,
  getAllMatches,
  updateMatch,
  getAllMatchParticipants,
} from "@/Logic";

// Define the type for the user profile context
interface MatchesContextType {
  allMatches: Matches[];
  allMatchParticipants: MatchParticipants[]
  matchesLoading: boolean;
  createNewMatch: (
    newMatch: CreateMatchesInput,
    deckIds: string[],
  ) => Promise<void>;
  updateExistingMatch: (updatedMatch: UpdateMatchesInput) => Promise<void>;
}

// Create the context
const MatchesContext = createContext<MatchesContextType | undefined>(undefined);

// UserProvider component
export const MatchesProvider = ({ children }: PropsWithChildren<{}>) => {
  const { addAppMessage } = useApp();
  const { user } = useAuthenticator((context) => [context.user]);
  const [allMatches, setAllMatches] = useState<Matches[]>([]);
  const [allMatchParticipants, setAllMatchParticipants] = useState<MatchParticipants[]>([]);
  const [matchesLoading, setMatchesLoading] = useState<boolean>(true);

  useEffect(() => {
    if (user) {
      setMatchesLoading(true);
      fetchMatches();
    }
  }, [user]);

  const fetchMatches = async () => {
    try {
      const [matches, matchParticipants] = await Promise.all([
        getAllMatches(),
        getAllMatchParticipants()
      ]);

      setAllMatches(matches ?? []);
      setAllMatchParticipants(matchParticipants ?? []); // Add this line
    } catch (error) {
      console.error("Failed to fetch matches and participants:", error);
    } finally {
      setMatchesLoading(false);
    }
  };

  const createNewMatch = async (
    newMatch: CreateMatchesInput,
    deckIds: string[],
  ) => {
    let match: Matches | null = null;
    let createdParticipants: MatchParticipants[] | null = [];

    try {
      match = await createMatch(newMatch);
      if (!match) {
        throw new Error("failed to create match");
      }

      createdParticipants = await createNewMatchParticipants(match.id, deckIds);
      if (!createdParticipants) {
        throw new Error("failed to create match participants");
      }

      setAllMatches((prevState) => [...prevState, match as Matches]);
      addAppMessage({
        content: "match has been added",
        severity: "success",
      });
    } catch (error) {
      console.error("error creating new match or participants:", error);

      // Rollback: delete any created participants and the match
      if (match && createdParticipants) {
        await deleteMatchWithParticipants(match.id, createdParticipants);
      }

      addAppMessage({
        title: "failed to create match or participants",
        content: "check console for more details",
        severity: "error",
      });
    }
  };

  const updateExistingMatch = async (updatedMatch: UpdateMatchesInput) => {
    setMatchesLoading(true);
    const updateMatchResponse = await updateMatch(updatedMatch);
    if (updateMatchResponse) {
      addAppMessage({
        content: "Match has been updated",
        severity: "success",
      });
      // Update the match in the state
      setAllMatches((prevState) =>
        prevState.map((m) =>
          m.id === updatedMatch.id ? updateMatchResponse : m,
        ),
      );
    } else {
      addAppMessage({
        title: "failed to update match",
        content: "check console for more details",
        severity: "error",
      });
    }
    setMatchesLoading(false);
  };

  return (
    <MatchesContext.Provider
      value={{
        allMatches,
        allMatchParticipants,
        matchesLoading,
        createNewMatch,
        updateExistingMatch,
      }}
    >
      {children}
    </MatchesContext.Provider>
  );
};

// Export the useMatches hook to access the context
export const useMatches = () => {
  const context = useContext(MatchesContext);
  if (!context) {
    throw new Error("useMatches must be used within a MatchesProvider");
  }
  return context;
};
