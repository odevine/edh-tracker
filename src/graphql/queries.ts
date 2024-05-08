/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const getMatchParticipants = /* GraphQL */ `query GetMatchParticipants($id: ID!) {
  getMatchParticipants(id: $id) {
    id
    decksID
    matchesID
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetMatchParticipantsQueryVariables,
  APITypes.GetMatchParticipantsQuery
>;
export const listMatchParticipants = /* GraphQL */ `query ListMatchParticipants(
  $filter: ModelMatchParticipantsFilterInput
  $limit: Int
  $nextToken: String
) {
  listMatchParticipants(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      decksID
      matchesID
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListMatchParticipantsQueryVariables,
  APITypes.ListMatchParticipantsQuery
>;
export const matchParticipantsByDecksID = /* GraphQL */ `query MatchParticipantsByDecksID(
  $decksID: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelMatchParticipantsFilterInput
  $limit: Int
  $nextToken: String
) {
  matchParticipantsByDecksID(
    decksID: $decksID
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      decksID
      matchesID
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.MatchParticipantsByDecksIDQueryVariables,
  APITypes.MatchParticipantsByDecksIDQuery
>;
export const matchParticipantsByMatchesID = /* GraphQL */ `query MatchParticipantsByMatchesID(
  $matchesID: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelMatchParticipantsFilterInput
  $limit: Int
  $nextToken: String
) {
  matchParticipantsByMatchesID(
    matchesID: $matchesID
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      decksID
      matchesID
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.MatchParticipantsByMatchesIDQueryVariables,
  APITypes.MatchParticipantsByMatchesIDQuery
>;
export const getUsers = /* GraphQL */ `query GetUsers($id: ID!) {
  getUsers(id: $id) {
    id
    displayName
    themeColor
    lastLoggedIn
    profilePicture
    role
    Decks {
      nextToken
      __typename
    }
    WinningUser {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    owner
    __typename
  }
}
` as GeneratedQuery<APITypes.GetUsersQueryVariables, APITypes.GetUsersQuery>;
export const listUsers = /* GraphQL */ `query ListUsers(
  $filter: ModelUsersFilterInput
  $limit: Int
  $nextToken: String
) {
  listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      displayName
      themeColor
      lastLoggedIn
      profilePicture
      role
      createdAt
      updatedAt
      owner
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<APITypes.ListUsersQueryVariables, APITypes.ListUsersQuery>;
export const getDecks = /* GraphQL */ `query GetDecks($id: ID!) {
  getDecks(id: $id) {
    id
    deckOwnerID
    deckName
    commanderName
    commanderColors
    deckType
    MatchParticipants {
      nextToken
      __typename
    }
    link
    cost
    createdAt
    updatedAt
    owner
    __typename
  }
}
` as GeneratedQuery<APITypes.GetDecksQueryVariables, APITypes.GetDecksQuery>;
export const listDecks = /* GraphQL */ `query ListDecks(
  $filter: ModelDecksFilterInput
  $limit: Int
  $nextToken: String
) {
  listDecks(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      deckOwnerID
      deckName
      commanderName
      commanderColors
      deckType
      link
      cost
      createdAt
      updatedAt
      owner
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<APITypes.ListDecksQueryVariables, APITypes.ListDecksQuery>;
export const decksByDeckOwnerID = /* GraphQL */ `query DecksByDeckOwnerID(
  $deckOwnerID: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelDecksFilterInput
  $limit: Int
  $nextToken: String
) {
  decksByDeckOwnerID(
    deckOwnerID: $deckOwnerID
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      deckOwnerID
      deckName
      commanderName
      commanderColors
      deckType
      link
      cost
      createdAt
      updatedAt
      owner
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.DecksByDeckOwnerIDQueryVariables,
  APITypes.DecksByDeckOwnerIDQuery
>;
export const getMatches = /* GraphQL */ `query GetMatches($id: ID!) {
  getMatches(id: $id) {
    id
    winningUserID
    matchType
    isArchived
    MatchParticipants {
      nextToken
      __typename
    }
    datePlayed
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetMatchesQueryVariables,
  APITypes.GetMatchesQuery
>;
export const listMatches = /* GraphQL */ `query ListMatches(
  $filter: ModelMatchesFilterInput
  $limit: Int
  $nextToken: String
) {
  listMatches(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      winningUserID
      matchType
      isArchived
      datePlayed
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListMatchesQueryVariables,
  APITypes.ListMatchesQuery
>;
export const matchesByWinningUserID = /* GraphQL */ `query MatchesByWinningUserID(
  $winningUserID: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelMatchesFilterInput
  $limit: Int
  $nextToken: String
) {
  matchesByWinningUserID(
    winningUserID: $winningUserID
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      winningUserID
      matchType
      isArchived
      datePlayed
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.MatchesByWinningUserIDQueryVariables,
  APITypes.MatchesByWinningUserIDQuery
>;
