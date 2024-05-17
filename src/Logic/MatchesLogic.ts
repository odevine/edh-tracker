import {
  CreateMatchInput,
  CreateMatchParticipantInput,
  DeleteMatchInput,
  DeleteMatchParticipantInput,
  Match,
  MatchParticipant,
  UpdateMatchInput,
} from "@/API";
import {
  createMatch,
  createMatchParticipant,
  deleteMatch,
  deleteMatchParticipant,
  updateMatch,
} from "@/graphql/mutations";
import { listMatchParticipants, listMatches } from "@/graphql/queries";
import { generateClient } from "aws-amplify/data";

const client = generateClient();

export const getAllMatchesFn = async (): Promise<Match[] | null> => {
  try {
    const allMatchesResponse = await client.graphql({ query: listMatches });

    if (allMatchesResponse.data && allMatchesResponse.data.listMatches) {
      return allMatchesResponse.data.listMatches.items as Match[];
    }
    return null;
  } catch (error) {
    console.error("error fetching matches:", error);
    return null;
  }
};

export const getAllMatchParticipantsFn = async (): Promise<
  MatchParticipant[] | null
> => {
  try {
    const allParticipantsResponse = await client.graphql({
      query: listMatchParticipants,
    });

    if (
      allParticipantsResponse.data &&
      allParticipantsResponse.data.listMatchParticipants
    ) {
      return allParticipantsResponse.data.listMatchParticipants
        .items as MatchParticipant[];
    }
    return null;
  } catch (error) {
    console.error("Error fetching match participants:", error);
    return null;
  }
};

export const createMatchFn = async (
  newMatch: CreateMatchInput,
): Promise<Match | null> => {
  try {
    const newMatchResponse = await client.graphql({
      query: createMatch,
      variables: { input: newMatch },
    });

    if (newMatchResponse.data && newMatchResponse.data.createMatch) {
      return newMatchResponse.data.createMatch as Match;
    } else {
      console.error("failed to create new match:");
      return null;
    }
  } catch (error) {
    console.error("error creating new match:", error);
    return null;
  }
};

export const updateMatchFn = async (
  updatedMatch: UpdateMatchInput,
): Promise<Match | null> => {
  try {
    const updatedMatchResponse = await client.graphql({
      query: updateMatch,
      variables: { input: updatedMatch },
    });
    if (updatedMatchResponse.data && updatedMatchResponse.data.updateMatch) {
      return updatedMatchResponse.data.updateMatch as Match;
    } else {
      console.log(`no match found for ${updatedMatch.id}, or update failed`);
      return null;
    }
  } catch (error) {
    console.error("Error updating match:", error);
    return null;
  }
};

export const createNewMatchParticipantsFn = async (
  matchId: string,
  deckIds: string[],
): Promise<MatchParticipant[] | null> => {
  const createdParticipants: MatchParticipant[] = [];
  try {
    for (const deckId of deckIds) {
      const input: CreateMatchParticipantInput = {
        deckId,
        matchId,
      };
      const participantResponse = await client.graphql({
        query: createMatchParticipant,
        variables: { input },
      });
      if (!participantResponse.data.createMatchParticipant) {
        throw new Error("failed to create match participant");
      }
      createdParticipants.push(
        participantResponse.data.createMatchParticipant as MatchParticipant,
      );
    }
    return createdParticipants;
  } catch (error) {
    console.error("error creating match participants:", error);
    // Rollback created participants
    await deleteMatchParticipantsBatch(createdParticipants);
    return null;
  }
};

export const deleteMatchParticipantsBatch = async (
  participants: MatchParticipant[],
) => {
  await Promise.all(
    participants.map(async (participant) => {
      const input: DeleteMatchParticipantInput = { id: participant.id };
      await client.graphql({
        query: deleteMatchParticipant,
        variables: { input },
      });
    }),
  );
};

export const deleteMatchWithParticipantsFn = async (
  matchId: string,
  participants: MatchParticipant[],
) => {
  await deleteMatchParticipantsBatch(participants);

  const input: DeleteMatchInput = { id: matchId };
  await client.graphql({
    query: deleteMatch,
    variables: { input },
  });
};
