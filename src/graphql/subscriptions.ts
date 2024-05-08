/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const onCreateMatchParticipants = /* GraphQL */ `subscription OnCreateMatchParticipants(
  $filter: ModelSubscriptionMatchParticipantsFilterInput
) {
  onCreateMatchParticipants(filter: $filter) {
    id
    decksID
    matchesID
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateMatchParticipantsSubscriptionVariables,
  APITypes.OnCreateMatchParticipantsSubscription
>;
export const onUpdateMatchParticipants = /* GraphQL */ `subscription OnUpdateMatchParticipants(
  $filter: ModelSubscriptionMatchParticipantsFilterInput
) {
  onUpdateMatchParticipants(filter: $filter) {
    id
    decksID
    matchesID
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateMatchParticipantsSubscriptionVariables,
  APITypes.OnUpdateMatchParticipantsSubscription
>;
export const onDeleteMatchParticipants = /* GraphQL */ `subscription OnDeleteMatchParticipants(
  $filter: ModelSubscriptionMatchParticipantsFilterInput
) {
  onDeleteMatchParticipants(filter: $filter) {
    id
    decksID
    matchesID
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteMatchParticipantsSubscriptionVariables,
  APITypes.OnDeleteMatchParticipantsSubscription
>;
export const onCreateUsers = /* GraphQL */ `subscription OnCreateUsers($filter: ModelSubscriptionUsersFilterInput) {
  onCreateUsers(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateUsersSubscriptionVariables,
  APITypes.OnCreateUsersSubscription
>;
export const onUpdateUsers = /* GraphQL */ `subscription OnUpdateUsers($filter: ModelSubscriptionUsersFilterInput) {
  onUpdateUsers(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateUsersSubscriptionVariables,
  APITypes.OnUpdateUsersSubscription
>;
export const onDeleteUsers = /* GraphQL */ `subscription OnDeleteUsers($filter: ModelSubscriptionUsersFilterInput) {
  onDeleteUsers(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteUsersSubscriptionVariables,
  APITypes.OnDeleteUsersSubscription
>;
export const onCreateDecks = /* GraphQL */ `subscription OnCreateDecks($filter: ModelSubscriptionDecksFilterInput) {
  onCreateDecks(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateDecksSubscriptionVariables,
  APITypes.OnCreateDecksSubscription
>;
export const onUpdateDecks = /* GraphQL */ `subscription OnUpdateDecks($filter: ModelSubscriptionDecksFilterInput) {
  onUpdateDecks(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateDecksSubscriptionVariables,
  APITypes.OnUpdateDecksSubscription
>;
export const onDeleteDecks = /* GraphQL */ `subscription OnDeleteDecks($filter: ModelSubscriptionDecksFilterInput) {
  onDeleteDecks(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteDecksSubscriptionVariables,
  APITypes.OnDeleteDecksSubscription
>;
export const onCreateMatches = /* GraphQL */ `subscription OnCreateMatches($filter: ModelSubscriptionMatchesFilterInput) {
  onCreateMatches(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateMatchesSubscriptionVariables,
  APITypes.OnCreateMatchesSubscription
>;
export const onUpdateMatches = /* GraphQL */ `subscription OnUpdateMatches($filter: ModelSubscriptionMatchesFilterInput) {
  onUpdateMatches(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateMatchesSubscriptionVariables,
  APITypes.OnUpdateMatchesSubscription
>;
export const onDeleteMatches = /* GraphQL */ `subscription OnDeleteMatches($filter: ModelSubscriptionMatchesFilterInput) {
  onDeleteMatches(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteMatchesSubscriptionVariables,
  APITypes.OnDeleteMatchesSubscription
>;
