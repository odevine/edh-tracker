/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const getDeckCategory = /* GraphQL */ `query GetDeckCategory($id: ID!) {
  getDeckCategory(id: $id) {
    id
    name
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetDeckCategoryQueryVariables,
  APITypes.GetDeckCategoryQuery
>;
export const listDeckCategories = /* GraphQL */ `query ListDeckCategories(
  $filter: ModelDeckCategoryFilterInput
  $limit: Int
  $nextToken: String
) {
  listDeckCategories(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      name
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListDeckCategoriesQueryVariables,
  APITypes.ListDeckCategoriesQuery
>;
export const getUser = /* GraphQL */ `query GetUser($id: ID!) {
  getUser(id: $id) {
    id
    displayName
    description
    lightThemeColor
    darkThemeColor
    profilePictureURL
    role
    lastOnline
    decks {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<APITypes.GetUserQueryVariables, APITypes.GetUserQuery>;
export const listUsers = /* GraphQL */ `query ListUsers(
  $filter: ModelUserFilterInput
  $limit: Int
  $nextToken: String
) {
  listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      displayName
      description
      lightThemeColor
      darkThemeColor
      profilePictureURL
      role
      lastOnline
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<APITypes.ListUsersQueryVariables, APITypes.ListUsersQuery>;
export const getDeck = /* GraphQL */ `query GetDeck($id: ID!) {
  getDeck(id: $id) {
    id
    deckOwnerId
    deckName
    commanderName
    commanderColors
    secondCommanderName
    secondCommanderColors
    deckType
    link
    cost
    isInactive
    winningMatches {
      nextToken
      __typename
    }
    matchParticipants {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<APITypes.GetDeckQueryVariables, APITypes.GetDeckQuery>;
export const listDecks = /* GraphQL */ `query ListDecks(
  $filter: ModelDeckFilterInput
  $limit: Int
  $nextToken: String
) {
  listDecks(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      deckOwnerId
      deckName
      commanderName
      commanderColors
      secondCommanderName
      secondCommanderColors
      deckType
      link
      cost
      isInactive
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<APITypes.ListDecksQueryVariables, APITypes.ListDecksQuery>;
export const decksByDeckOwnerId = /* GraphQL */ `query DecksByDeckOwnerId(
  $deckOwnerId: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelDeckFilterInput
  $limit: Int
  $nextToken: String
) {
  decksByDeckOwnerId(
    deckOwnerId: $deckOwnerId
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      deckOwnerId
      deckName
      commanderName
      commanderColors
      secondCommanderName
      secondCommanderColors
      deckType
      link
      cost
      isInactive
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.DecksByDeckOwnerIdQueryVariables,
  APITypes.DecksByDeckOwnerIdQuery
>;
export const getMatch = /* GraphQL */ `query GetMatch($id: ID!) {
  getMatch(id: $id) {
    id
    winningDeckId
    matchType
    isArchived
    datePlayed
    matchParticipants {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<APITypes.GetMatchQueryVariables, APITypes.GetMatchQuery>;
export const listMatches = /* GraphQL */ `query ListMatches(
  $filter: ModelMatchFilterInput
  $limit: Int
  $nextToken: String
) {
  listMatches(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      winningDeckId
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
export const matchesByWinningDeckId = /* GraphQL */ `query MatchesByWinningDeckId(
  $winningDeckId: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelMatchFilterInput
  $limit: Int
  $nextToken: String
) {
  matchesByWinningDeckId(
    winningDeckId: $winningDeckId
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      winningDeckId
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
  APITypes.MatchesByWinningDeckIdQueryVariables,
  APITypes.MatchesByWinningDeckIdQuery
>;
export const getMatchParticipant = /* GraphQL */ `query GetMatchParticipant($id: ID!) {
  getMatchParticipant(id: $id) {
    id
    deckId
    matchId
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetMatchParticipantQueryVariables,
  APITypes.GetMatchParticipantQuery
>;
export const listMatchParticipants = /* GraphQL */ `query ListMatchParticipants(
  $filter: ModelMatchParticipantFilterInput
  $limit: Int
  $nextToken: String
) {
  listMatchParticipants(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      deckId
      matchId
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
export const matchParticipantsByDeckId = /* GraphQL */ `query MatchParticipantsByDeckId(
  $deckId: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelMatchParticipantFilterInput
  $limit: Int
  $nextToken: String
) {
  matchParticipantsByDeckId(
    deckId: $deckId
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      deckId
      matchId
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.MatchParticipantsByDeckIdQueryVariables,
  APITypes.MatchParticipantsByDeckIdQuery
>;
export const matchParticipantsByMatchId = /* GraphQL */ `query MatchParticipantsByMatchId(
  $matchId: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelMatchParticipantFilterInput
  $limit: Int
  $nextToken: String
) {
  matchParticipantsByMatchId(
    matchId: $matchId
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      deckId
      matchId
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.MatchParticipantsByMatchIdQueryVariables,
  APITypes.MatchParticipantsByMatchIdQuery
>;
