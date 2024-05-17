import { useAuthenticator } from "@aws-amplify/ui-react";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  CreateMatchInput,
  Match,
  MatchParticipant,
  UpdateMatchInput,
} from "@/API";
import { useApp } from "@/Context";
import {
  createMatchFn,
  createNewMatchParticipantsFn,
  deleteMatchWithParticipantsFn,
  getAllMatchParticipantsFn,
  getAllMatchesFn,
  updateMatchFn,
} from "@/Logic";

// Define the type for the user profile context
interface MatchesContextType {
  allMatches: Match[];
  allMatchParticipants: MatchParticipant[];
  matchesLoading: boolean;
  createNewMatch: (
    newMatch: CreateMatchInput,
    deckIds: string[],
  ) => Promise<void>;
  updateExistingMatch: (updatedMatch: UpdateMatchInput) => Promise<void>;
}

// Create the context
const MatchesContext = createContext<MatchesContextType | undefined>(undefined);

// UserProvider component
export const MatchesProvider = ({ children }: PropsWithChildren<{}>) => {
  const { addAppMessage } = useApp();
  const { user } = useAuthenticator((context) => [context.user]);
  const [allMatches, setAllMatches] = useState<Match[]>([]);
  const [allMatchParticipants, setAllMatchParticipants] = useState<
    MatchParticipant[]
  >([]);
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
        getAllMatchesFn(),
        getAllMatchParticipantsFn(),
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
    newMatch: CreateMatchInput,
    deckIds: string[],
  ) => {
    let match: Match | null = null;
    let createdParticipants: MatchParticipant[] | null = [];

    try {
      match = await createMatchFn(newMatch);
      if (!match) {
        throw new Error("failed to create match");
      }

      createdParticipants = await createNewMatchParticipantsFn(
        match.id,
        deckIds,
      );
      if (!createdParticipants) {
        throw new Error("failed to create match participants");
      }

      setAllMatches((prevState) => [...prevState, match as Match]);
      addAppMessage({
        content: "match has been added",
        severity: "success",
      });
    } catch (error) {
      console.error("error creating new match or participants:", error);

      // Rollback: delete any created participants and the match
      if (match && createdParticipants) {
        await deleteMatchWithParticipantsFn(match.id, createdParticipants);
      }

      addAppMessage({
        title: "failed to create match or participants",
        content: "check console for more details",
        severity: "error",
      });
    }
  };

  const updateExistingMatch = async (updatedMatch: UpdateMatchInput) => {
    setMatchesLoading(true);
    const updateMatchResponse = await updateMatchFn(updatedMatch);
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
