/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const createMatchParticipants = /* GraphQL */ `mutation CreateMatchParticipants(
  $input: CreateMatchParticipantsInput!
  $condition: ModelMatchParticipantsConditionInput
) {
  createMatchParticipants(input: $input, condition: $condition) {
    id
    decksID
    matchesID
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateMatchParticipantsMutationVariables,
  APITypes.CreateMatchParticipantsMutation
>;
export const updateMatchParticipants = /* GraphQL */ `mutation UpdateMatchParticipants(
  $input: UpdateMatchParticipantsInput!
  $condition: ModelMatchParticipantsConditionInput
) {
  updateMatchParticipants(input: $input, condition: $condition) {
    id
    decksID
    matchesID
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateMatchParticipantsMutationVariables,
  APITypes.UpdateMatchParticipantsMutation
>;
export const deleteMatchParticipants = /* GraphQL */ `mutation DeleteMatchParticipants(
  $input: DeleteMatchParticipantsInput!
  $condition: ModelMatchParticipantsConditionInput
) {
  deleteMatchParticipants(input: $input, condition: $condition) {
    id
    decksID
    matchesID
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteMatchParticipantsMutationVariables,
  APITypes.DeleteMatchParticipantsMutation
>;
export const createUsers = /* GraphQL */ `mutation CreateUsers(
  $input: CreateUsersInput!
  $condition: ModelUsersConditionInput
) {
  createUsers(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateUsersMutationVariables,
  APITypes.CreateUsersMutation
>;
export const updateUsers = /* GraphQL */ `mutation UpdateUsers(
  $input: UpdateUsersInput!
  $condition: ModelUsersConditionInput
) {
  updateUsers(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateUsersMutationVariables,
  APITypes.UpdateUsersMutation
>;
export const deleteUsers = /* GraphQL */ `mutation DeleteUsers(
  $input: DeleteUsersInput!
  $condition: ModelUsersConditionInput
) {
  deleteUsers(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteUsersMutationVariables,
  APITypes.DeleteUsersMutation
>;
export const createDecks = /* GraphQL */ `mutation CreateDecks(
  $input: CreateDecksInput!
  $condition: ModelDecksConditionInput
) {
  createDecks(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateDecksMutationVariables,
  APITypes.CreateDecksMutation
>;
export const updateDecks = /* GraphQL */ `mutation UpdateDecks(
  $input: UpdateDecksInput!
  $condition: ModelDecksConditionInput
) {
  updateDecks(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateDecksMutationVariables,
  APITypes.UpdateDecksMutation
>;
export const deleteDecks = /* GraphQL */ `mutation DeleteDecks(
  $input: DeleteDecksInput!
  $condition: ModelDecksConditionInput
) {
  deleteDecks(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteDecksMutationVariables,
  APITypes.DeleteDecksMutation
>;
export const createMatches = /* GraphQL */ `mutation CreateMatches(
  $input: CreateMatchesInput!
  $condition: ModelMatchesConditionInput
) {
  createMatches(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateMatchesMutationVariables,
  APITypes.CreateMatchesMutation
>;
export const updateMatches = /* GraphQL */ `mutation UpdateMatches(
  $input: UpdateMatchesInput!
  $condition: ModelMatchesConditionInput
) {
  updateMatches(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateMatchesMutationVariables,
  APITypes.UpdateMatchesMutation
>;
export const deleteMatches = /* GraphQL */ `mutation DeleteMatches(
  $input: DeleteMatchesInput!
  $condition: ModelMatchesConditionInput
) {
  deleteMatches(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteMatchesMutationVariables,
  APITypes.DeleteMatchesMutation
>;
