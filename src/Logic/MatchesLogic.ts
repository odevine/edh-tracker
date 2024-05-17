import {
  CreateMatchParticipantsInput,
  CreateMatchesInput,
  DeleteMatchParticipantsInput,
  DeleteMatchesInput,
  MatchParticipants,
  Matches,
  UpdateMatchesInput,
} from "@/API";
import {
  createMatchParticipants,
  createMatches,
  deleteMatchParticipants,
  deleteMatches,
  updateMatches,
} from "@/graphql/mutations";
import { listMatchParticipants, listMatches } from "@/graphql/queries";
import { generateClient } from "aws-amplify/data";

const client = generateClient();

export const getAllMatches = async (): Promise<Matches[] | null> => {
  try {
    const allMatchesResponse = await client.graphql({ query: listMatches });

    if (allMatchesResponse.data && allMatchesResponse.data.listMatches) {
      return allMatchesResponse.data.listMatches.items as Matches[];
    }
    return null;
  } catch (error) {
    console.error("error fetching matches:", error);
    return null;
  }
};

export const getAllMatchParticipants = async (): Promise<
  MatchParticipants[] | null
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
        .items as MatchParticipants[];
    }
    return null;
  } catch (error) {
    console.error("Error fetching match participants:", error);
    return null;
  }
};

export const createMatch = async (
  newMatch: CreateMatchesInput,
): Promise<Matches | null> => {
  try {
    const newMatchResponse = await client.graphql({
      query: createMatches,
      variables: { input: newMatch },
    });

    if (newMatchResponse.data && newMatchResponse.data.createMatches) {
      return newMatchResponse.data.createMatches as Matches;
    } else {
      console.error("failed to create new match:");
      return null;
    }
  } catch (error) {
    console.error("error creating new match:", error);
    return null;
  }
};

export const updateMatch = async (
  updatedMatch: UpdateMatchesInput,
): Promise<Matches | null> => {
  try {
    const updatedMatchResponse = await client.graphql({
      query: updateMatches,
      variables: { input: updatedMatch },
    });
    if (updatedMatchResponse.data && updatedMatchResponse.data.updateMatches) {
      return updatedMatchResponse.data.updateMatches as Matches;
    } else {
      console.log(`no match found for ${updatedMatch.id}, or update failed`);
      return null;
    }
  } catch (error) {
    console.error("Error updating match:", error);
    return null;
  }
};

export const createNewMatchParticipants = async (
  matchId: string,
  deckIds: string[],
): Promise<MatchParticipants[] | null> => {
  const createdParticipants: MatchParticipants[] = [];
  try {
    for (const deckId of deckIds) {
      const input: CreateMatchParticipantsInput = {
        decksID: deckId,
        matchesID: matchId,
      };
      const participantResponse = await client.graphql({
        query: createMatchParticipants,
        variables: { input },
      });
      if (!participantResponse.data.createMatchParticipants) {
        throw new Error("failed to create match participant");
      }
      createdParticipants.push(
        participantResponse.data.createMatchParticipants as MatchParticipants,
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
  participants: MatchParticipants[],
) => {
  await Promise.all(
    participants.map(async (participant) => {
      const input: DeleteMatchParticipantsInput = { id: participant.id };
      await client.graphql({
        query: deleteMatchParticipants,
        variables: { input },
      });
    }),
  );
};

export const deleteMatchWithParticipants = async (
  matchId: string,
  participants: MatchParticipants[],
) => {
  await deleteMatchParticipantsBatch(participants);

  const input: DeleteMatchesInput = { id: matchId };
  await client.graphql({
    query: deleteMatches,
    variables: { input },
  });
};
