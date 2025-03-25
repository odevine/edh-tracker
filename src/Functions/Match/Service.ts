import {
  CreateMatchInput,
  Match,
  MatchParticipant,
  UpdateMatchInput,
} from "@/Types/Match";
import { randomUUID } from "crypto";
import { dynamo } from "../Common/Db";
import { requireEnv } from "../Common/Env";
import {
  reverseStatsFromMatch,
  updateStatsFromMatch,
} from "../Common/StatUtils";
import { buildUpdateExpression } from "../Common/Update";

const MATCH_TABLE = requireEnv("MATCH_TABLE");

const stripInternalFields = <T extends Record<string, any>>(item: T): T => {
  const clone = { ...item };
  delete clone.PK;
  delete clone.SK;
  return clone;
};

export const listMatches = async (): Promise<Match[]> => {
  const result = await dynamo.scan({ TableName: MATCH_TABLE });
  const grouped: Record<string, Match> = {};

  for (const item of result.Items || []) {
    const parsed = item as any;
    const pk = parsed.PK;
    if (!pk.startsWith("MATCH#")) {
      continue;
    }
    const matchId = pk.split("#")[1];

    if (parsed.SK === "METADATA") {
      grouped[matchId] = {
        ...stripInternalFields(parsed as Match),
        matchParticipants: [],
      };
    } else if (parsed.SK?.startsWith("PARTICIPANT#")) {
      grouped[matchId]?.matchParticipants?.push(
        stripInternalFields(parsed as MatchParticipant),
      );
    }
  }

  return Object.values(grouped);
};

export const getMatch = async (id: string): Promise<Match | null> => {
  const result = await dynamo.query({
    TableName: MATCH_TABLE,
    KeyConditionExpression: "PK = :pk",
    ExpressionAttributeValues: {
      ":pk": `MATCH#${id}`,
    },
  });

  if (!result.Items || result.Items.length === 0) {
    return null;
  }

  return {
    ...stripInternalFields(
      result.Items.find((i) => i.SK === "METADATA") as Match,
    ),
    matchParticipants: result.Items.filter((i) =>
      i.SK.startsWith("PARTICIPANT#"),
    ).map((p) => stripInternalFields(p as MatchParticipant)),
  };
};

export const createMatch = async (input: CreateMatchInput): Promise<Match> => {
  const matchId = input.id || randomUUID();
  const timestamp = new Date().toISOString();

  const { matchParticipants, ...matchData } = input;

  const participantDeckIds = matchParticipants.map((p) => p.deckId);
  if (!participantDeckIds.includes(input.winningDeckId)) {
    throw new Error("winning deck must belong to a match participant");
  }

  const match: Match = {
    id: matchId,
    ...matchData,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  // write match metadata
  await dynamo.put({
    TableName: MATCH_TABLE,
    Item: {
      PK: `MATCH#${matchId}`,
      SK: "METADATA",
      ...match,
    },
  });

  // write each participant
  for (const p of matchParticipants) {
    const participant: MatchParticipant = {
      id: randomUUID(),
      matchId,
      deckId: p.deckId,
      userId: p.userId,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    await dynamo.put({
      TableName: MATCH_TABLE,
      Item: {
        PK: `MATCH#${matchId}`,
        SK: `PARTICIPANT#${participant.id}`,
        ...participant,
      },
    });
  }

  const fullMatch = await getMatch(matchId);
  if (fullMatch) {
    await updateStatsFromMatch(fullMatch);
  }

  return fullMatch as Match;
};

export const updateMatch = async (
  id: string,
  updates: UpdateMatchInput,
): Promise<Match> => {
  const timestamp = new Date().toISOString();

  const originalMatch = await getMatch(id);
  if (originalMatch) {
    await reverseStatsFromMatch(originalMatch);
  }

  if (updates.matchUpdates) {
    const {
      UpdateExpression,
      ExpressionAttributeNames,
      ExpressionAttributeValues,
    } = buildUpdateExpression({
      ...updates.matchUpdates,
      updatedAt: timestamp,
    });

    await dynamo.update({
      TableName: MATCH_TABLE,
      Key: {
        PK: `MATCH#${id}`,
        SK: "METADATA",
      },
      UpdateExpression,
      ExpressionAttributeNames,
      ExpressionAttributeValues,
    });
  }

  // add participants
  if (updates.addParticipants?.length) {
    for (const p of updates.addParticipants) {
      const newP: MatchParticipant = {
        id: randomUUID(),
        matchId: id,
        deckId: p.deckId,
        userId: p.userId,
        createdAt: timestamp,
        updatedAt: timestamp,
      };

      await dynamo.put({
        TableName: MATCH_TABLE,
        Item: {
          PK: `MATCH#${id}`,
          SK: `PARTICIPANT#${newP.id}`,
          ...newP,
        },
      });
    }
  }

  // remove participants
  if (updates.removeParticipantIds?.length) {
    for (const pid of updates.removeParticipantIds) {
      await dynamo.delete({
        TableName: MATCH_TABLE,
        Key: {
          PK: `MATCH#${id}`,
          SK: `PARTICIPANT#${pid}`,
        },
      });
    }
  }

  const updatedMatch = await getMatch(id);
  if (updatedMatch) {
    await updateStatsFromMatch(updatedMatch);
  }

  return updatedMatch as Match;
};

export const deleteMatch = async (id: string): Promise<void> => {
  const match = await getMatch(id);
  if (match) {
    await reverseStatsFromMatch(match);
  }

  const result = await dynamo.query({
    TableName: MATCH_TABLE,
    KeyConditionExpression: "PK = :pk",
    ExpressionAttributeValues: {
      ":pk": `MATCH#${id}`,
    },
  });

  for (const item of result.Items || []) {
    await dynamo.delete({
      TableName: MATCH_TABLE,
      Key: {
        PK: item.PK,
        SK: item.SK,
      },
    });
  }
};
