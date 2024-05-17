/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const onCreateUser = /* GraphQL */ `subscription OnCreateUser($filter: ModelSubscriptionUserFilterInput) {
  onCreateUser(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateUserSubscriptionVariables,
  APITypes.OnCreateUserSubscription
>;
export const onUpdateUser = /* GraphQL */ `subscription OnUpdateUser($filter: ModelSubscriptionUserFilterInput) {
  onUpdateUser(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateUserSubscriptionVariables,
  APITypes.OnUpdateUserSubscription
>;
export const onDeleteUser = /* GraphQL */ `subscription OnDeleteUser($filter: ModelSubscriptionUserFilterInput) {
  onDeleteUser(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteUserSubscriptionVariables,
  APITypes.OnDeleteUserSubscription
>;
export const onCreateDeck = /* GraphQL */ `subscription OnCreateDeck($filter: ModelSubscriptionDeckFilterInput) {
  onCreateDeck(filter: $filter) {
    id
    deckOwnerId
    deckName
    commanderName
    commanderColors
    deckType
    link
    cost
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
` as GeneratedSubscription<
  APITypes.OnCreateDeckSubscriptionVariables,
  APITypes.OnCreateDeckSubscription
>;
export const onUpdateDeck = /* GraphQL */ `subscription OnUpdateDeck($filter: ModelSubscriptionDeckFilterInput) {
  onUpdateDeck(filter: $filter) {
    id
    deckOwnerId
    deckName
    commanderName
    commanderColors
    deckType
    link
    cost
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
` as GeneratedSubscription<
  APITypes.OnUpdateDeckSubscriptionVariables,
  APITypes.OnUpdateDeckSubscription
>;
export const onDeleteDeck = /* GraphQL */ `subscription OnDeleteDeck($filter: ModelSubscriptionDeckFilterInput) {
  onDeleteDeck(filter: $filter) {
    id
    deckOwnerId
    deckName
    commanderName
    commanderColors
    deckType
    link
    cost
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
` as GeneratedSubscription<
  APITypes.OnDeleteDeckSubscriptionVariables,
  APITypes.OnDeleteDeckSubscription
>;
export const onCreateMatch = /* GraphQL */ `subscription OnCreateMatch($filter: ModelSubscriptionMatchFilterInput) {
  onCreateMatch(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateMatchSubscriptionVariables,
  APITypes.OnCreateMatchSubscription
>;
export const onUpdateMatch = /* GraphQL */ `subscription OnUpdateMatch($filter: ModelSubscriptionMatchFilterInput) {
  onUpdateMatch(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateMatchSubscriptionVariables,
  APITypes.OnUpdateMatchSubscription
>;
export const onDeleteMatch = /* GraphQL */ `subscription OnDeleteMatch($filter: ModelSubscriptionMatchFilterInput) {
  onDeleteMatch(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteMatchSubscriptionVariables,
  APITypes.OnDeleteMatchSubscription
>;
export const onCreateMatchParticipant = /* GraphQL */ `subscription OnCreateMatchParticipant(
  $filter: ModelSubscriptionMatchParticipantFilterInput
) {
  onCreateMatchParticipant(filter: $filter) {
    id
    deckId
    matchId
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateMatchParticipantSubscriptionVariables,
  APITypes.OnCreateMatchParticipantSubscription
>;
export const onUpdateMatchParticipant = /* GraphQL */ `subscription OnUpdateMatchParticipant(
  $filter: ModelSubscriptionMatchParticipantFilterInput
) {
  onUpdateMatchParticipant(filter: $filter) {
    id
    deckId
    matchId
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateMatchParticipantSubscriptionVariables,
  APITypes.OnUpdateMatchParticipantSubscription
>;
export const onDeleteMatchParticipant = /* GraphQL */ `subscription OnDeleteMatchParticipant(
  $filter: ModelSubscriptionMatchParticipantFilterInput
) {
  onDeleteMatchParticipant(filter: $filter) {
    id
    deckId
    matchId
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteMatchParticipantSubscriptionVariables,
  APITypes.OnDeleteMatchParticipantSubscription
>;
