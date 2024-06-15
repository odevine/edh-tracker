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
    let allMatches: Match[] = [];
    let nextToken: string | null = null;

    do {
      const response: any = await client.graphql({
        query: listMatches,
        variables: { nextToken },
      });

      if (
        response.data &&
        response.data.listMatches &&
        response?.data?.listMatches?.items
      ) {
        allMatches = [...allMatches, ...response.data.listMatches.items];
        nextToken = response.data.listMatches.nextToken;
      } else {
        nextToken = null;
      }
    } while (nextToken);

    return allMatches;
  } catch (error) {
    console.error("error fetching matches:", error);
    return null;
  }
};

export const getAllMatchParticipantsFn = async (): Promise<
  MatchParticipant[] | null
> => {
  try {
    let allParticipants: MatchParticipant[] = [];
    let nextToken: string | null = null;

    do {
      const response: any = await client.graphql({
        query: listMatchParticipants,
        variables: { nextToken },
      });

      if (
        response.data &&
        response.data.listMatchParticipants &&
        response.data.listMatchParticipants.items
      ) {
        allParticipants = [
          ...allParticipants,
          ...response.data.listMatchParticipants.items,
        ];
        nextToken = response.data.listMatchParticipants.nextToken;
      } else {
        nextToken = null;
      }
    } while (nextToken);

    return allParticipants;
  } catch (error) {
    console.error("error fetching match participants:", error);
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

export const updateMatchWithParticipantsFn = async (
  updatedMatch: UpdateMatchInput,
  newParticipantDeckIds: string[],
): Promise<Match | null> => {
  try {
    // Update the match
    const updatedMatchResponse = await client.graphql({
      query: updateMatch,
      variables: { input: updatedMatch },
    });

    if (!updatedMatchResponse.data.updateMatch) {
      throw new Error("Failed to update match");
    }

    const updatedMatchData = updatedMatchResponse.data.updateMatch;

    // Fetch current participants of the match
    const participantsResponse = await client.graphql({
      query: listMatchParticipants,
      variables: { filter: { matchId: { eq: updatedMatch.id } } },
    });

    const currentParticipants = participantsResponse.data.listMatchParticipants
      .items as MatchParticipant[];

    // Find participants to remove
    const participantsToRemove = currentParticipants.filter(
      (participant) => !newParticipantDeckIds.includes(participant.deckId),
    );

    // Find participants to add
    const currentDeckIds = currentParticipants.map((p) => p.deckId);
    const participantsToAdd = newParticipantDeckIds.filter(
      (deckId) => !currentDeckIds.includes(deckId),
    );

    // Remove old participants
    await deleteMatchParticipantsBatchFn(participantsToRemove);

    // Add new participants
    await createNewMatchParticipantsFn(updatedMatch.id, participantsToAdd);

    return updatedMatchData as Match;
  } catch (error) {
    console.error("Error updating match with participants:", error);
    return null;
  }
};

export const deleteMatchParticipantsBatchFn = async (
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
    await deleteMatchParticipantsBatchFn(createdParticipants);
    return null;
  }
};

export const deleteMatchWithParticipantsFn = async (
  matchId: string,
  participants?: MatchParticipant[],
): Promise<void> => {
  let participantsToDelete: MatchParticipant[] = [];
  if (participants && participants.length > 0) {
    participantsToDelete = participants;
  } else {
    const participantsResponse = await client.graphql({
      query: listMatchParticipants,
      variables: { filter: { matchId: { eq: matchId } } },
    });
    participantsToDelete =
      participantsResponse.data.listMatchParticipants.items;
  }

  await deleteMatchParticipantsBatchFn(participantsToDelete);

  const input: DeleteMatchInput = { id: matchId };
  await client.graphql({
    query: deleteMatch,
    variables: { input },
  });
};

export const findOrphanedMatchParticipants = (
  allMatches: Match[],
  allMatchParticipants: MatchParticipant[],
): MatchParticipant[] => {
  // Create a set of match IDs from allMatches
  const matchIds = new Set(allMatches.map((match) => match.id));

  // Filter out MatchParticipants whose matchId is not in the matchIds set
  const orphanedMatchParticipants = allMatchParticipants.filter(
    (participant) => !matchIds.has(participant.matchId),
  );

  return orphanedMatchParticipants;
};
