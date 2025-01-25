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
  updateMatchWithParticipantsFn,
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
  updateMatchWithParticipants: (
    updatedMatch: UpdateMatchInput,
    newParticipantDeckIds: string[],
  ) => Promise<void>;
  deleteMatch: (matchId: string) => Promise<void>;
}

// Create the context
const MatchesContext = createContext<MatchesContextType | undefined>(undefined);

// UserProvider component
export const MatchProvider = ({ children }: PropsWithChildren<{}>) => {
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
    } else {
      setMatchesLoading(false);
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
      } else {
        setAllMatches((prevState) => [...prevState, match as Match]);
        setAllMatchParticipants((prevState) => [
          ...prevState,
          ...(createdParticipants as MatchParticipant[]),
        ]);
        addAppMessage({
          content: "match has been added",
          severity: "success",
        });
      }
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

  const updateMatchWithParticipants = async (
    updatedMatch: UpdateMatchInput,
    newParticipantDeckIds: string[],
  ) => {
    setMatchesLoading(true);
    try {
      const updatedMatchResponse = await updateMatchWithParticipantsFn(
        updatedMatch,
        newParticipantDeckIds,
      );

      if (updatedMatchResponse) {
        setAllMatches((prevState) =>
          prevState.map((match) =>
            match.id === updatedMatch.id ? updatedMatchResponse : match,
          ),
        );

        const participantsResponse = await getAllMatchParticipantsFn();
        setAllMatchParticipants(participantsResponse ?? []);

        addAppMessage({
          content: "match and participants have been updated",
          severity: "success",
        });
      } else {
        throw new Error("failed to update match");
      }
    } catch (error) {
      console.error("failed to update match with participants:", error);
      addAppMessage({
        content: "failed to update match",
        severity: "error",
      });
    } finally {
      setMatchesLoading(false);
    }
  };

  const deleteMatch = async (matchId: string) => {
    setMatchesLoading(true);
    try {
      const matchParticipants = allMatchParticipants.filter(
        (participant) => participant.matchId === matchId,
      );
      await deleteMatchWithParticipantsFn(matchId, matchParticipants);
      setAllMatches((prevMatches) =>
        prevMatches.filter((match) => match.id !== matchId),
      );
      setAllMatchParticipants((prevParticipants) =>
        prevParticipants.filter(
          (participant) => participant.matchId !== matchId,
        ),
      );
      addAppMessage({
        content: "match deleted successfully",
        severity: "success",
      });
    } catch (error) {
      console.error("failed to delete match:", error);
      addAppMessage({
        content: "failed to delete match",
        severity: "error",
      });
    } finally {
      setMatchesLoading(false);
    }
  };

  return (
    <MatchesContext.Provider
      value={{
        allMatches,
        allMatchParticipants,
        matchesLoading,
        createNewMatch,
        updateMatchWithParticipants,
        deleteMatch,
      }}
    >
      {children}
    </MatchesContext.Provider>
  );
};

// Export the useMatches hook to access the context
export const useMatch = () => {
  const context = useContext(MatchesContext);
  if (!context) {
    throw new Error("useMatch must be used within a MatchProvider");
  }
  return context;
};
