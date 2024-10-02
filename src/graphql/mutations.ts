/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const createDeckCategory = /* GraphQL */ `mutation CreateDeckCategory(
  $input: CreateDeckCategoryInput!
  $condition: ModelDeckCategoryConditionInput
) {
  createDeckCategory(input: $input, condition: $condition) {
    id
    name
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateDeckCategoryMutationVariables,
  APITypes.CreateDeckCategoryMutation
>;
export const updateDeckCategory = /* GraphQL */ `mutation UpdateDeckCategory(
  $input: UpdateDeckCategoryInput!
  $condition: ModelDeckCategoryConditionInput
) {
  updateDeckCategory(input: $input, condition: $condition) {
    id
    name
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateDeckCategoryMutationVariables,
  APITypes.UpdateDeckCategoryMutation
>;
export const deleteDeckCategory = /* GraphQL */ `mutation DeleteDeckCategory(
  $input: DeleteDeckCategoryInput!
  $condition: ModelDeckCategoryConditionInput
) {
  deleteDeckCategory(input: $input, condition: $condition) {
    id
    name
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteDeckCategoryMutationVariables,
  APITypes.DeleteDeckCategoryMutation
>;
export const createUser = /* GraphQL */ `mutation CreateUser(
  $input: CreateUserInput!
  $condition: ModelUserConditionInput
) {
  createUser(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateUserMutationVariables,
  APITypes.CreateUserMutation
>;
export const updateUser = /* GraphQL */ `mutation UpdateUser(
  $input: UpdateUserInput!
  $condition: ModelUserConditionInput
) {
  updateUser(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateUserMutationVariables,
  APITypes.UpdateUserMutation
>;
export const deleteUser = /* GraphQL */ `mutation DeleteUser(
  $input: DeleteUserInput!
  $condition: ModelUserConditionInput
) {
  deleteUser(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteUserMutationVariables,
  APITypes.DeleteUserMutation
>;
export const createDeck = /* GraphQL */ `mutation CreateDeck(
  $input: CreateDeckInput!
  $condition: ModelDeckConditionInput
) {
  createDeck(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateDeckMutationVariables,
  APITypes.CreateDeckMutation
>;
export const updateDeck = /* GraphQL */ `mutation UpdateDeck(
  $input: UpdateDeckInput!
  $condition: ModelDeckConditionInput
) {
  updateDeck(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateDeckMutationVariables,
  APITypes.UpdateDeckMutation
>;
export const deleteDeck = /* GraphQL */ `mutation DeleteDeck(
  $input: DeleteDeckInput!
  $condition: ModelDeckConditionInput
) {
  deleteDeck(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteDeckMutationVariables,
  APITypes.DeleteDeckMutation
>;
export const createMatch = /* GraphQL */ `mutation CreateMatch(
  $input: CreateMatchInput!
  $condition: ModelMatchConditionInput
) {
  createMatch(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateMatchMutationVariables,
  APITypes.CreateMatchMutation
>;
export const updateMatch = /* GraphQL */ `mutation UpdateMatch(
  $input: UpdateMatchInput!
  $condition: ModelMatchConditionInput
) {
  updateMatch(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateMatchMutationVariables,
  APITypes.UpdateMatchMutation
>;
export const deleteMatch = /* GraphQL */ `mutation DeleteMatch(
  $input: DeleteMatchInput!
  $condition: ModelMatchConditionInput
) {
  deleteMatch(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteMatchMutationVariables,
  APITypes.DeleteMatchMutation
>;
export const createMatchParticipant = /* GraphQL */ `mutation CreateMatchParticipant(
  $input: CreateMatchParticipantInput!
  $condition: ModelMatchParticipantConditionInput
) {
  createMatchParticipant(input: $input, condition: $condition) {
    id
    deckId
    matchId
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateMatchParticipantMutationVariables,
  APITypes.CreateMatchParticipantMutation
>;
export const updateMatchParticipant = /* GraphQL */ `mutation UpdateMatchParticipant(
  $input: UpdateMatchParticipantInput!
  $condition: ModelMatchParticipantConditionInput
) {
  updateMatchParticipant(input: $input, condition: $condition) {
    id
    deckId
    matchId
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateMatchParticipantMutationVariables,
  APITypes.UpdateMatchParticipantMutation
>;
export const deleteMatchParticipant = /* GraphQL */ `mutation DeleteMatchParticipant(
  $input: DeleteMatchParticipantInput!
  $condition: ModelMatchParticipantConditionInput
) {
  deleteMatchParticipant(input: $input, condition: $condition) {
    id
    deckId
    matchId
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteMatchParticipantMutationVariables,
  APITypes.DeleteMatchParticipantMutation
>;
