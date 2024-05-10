/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateMatchParticipantsInput = {
  id?: string | null,
  decksID: string,
  matchesID: string,
};

export type ModelMatchParticipantsConditionInput = {
  decksID?: ModelIDInput | null,
  matchesID?: ModelIDInput | null,
  and?: Array< ModelMatchParticipantsConditionInput | null > | null,
  or?: Array< ModelMatchParticipantsConditionInput | null > | null,
  not?: ModelMatchParticipantsConditionInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null",
}


export type ModelSizeInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type ModelStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export type MatchParticipants = {
  __typename: "MatchParticipants",
  id: string,
  decksID: string,
  matchesID: string,
  createdAt: string,
  updatedAt: string,
};

export type UpdateMatchParticipantsInput = {
  id: string,
  decksID?: string | null,
  matchesID?: string | null,
};

export type DeleteMatchParticipantsInput = {
  id: string,
};

export type CreateUsersInput = {
  id?: string | null,
  displayName?: string | null,
  lightThemeColor?: string | null,
  darkThemeColor?: string | null,
  profilePictureURL?: string | null,
  role?: string | null,
  lastLoggedIn?: string | null,
};

export type ModelUsersConditionInput = {
  displayName?: ModelStringInput | null,
  lightThemeColor?: ModelStringInput | null,
  darkThemeColor?: ModelStringInput | null,
  profilePictureURL?: ModelStringInput | null,
  role?: ModelStringInput | null,
  lastLoggedIn?: ModelStringInput | null,
  and?: Array< ModelUsersConditionInput | null > | null,
  or?: Array< ModelUsersConditionInput | null > | null,
  not?: ModelUsersConditionInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type Users = {
  __typename: "Users",
  id: string,
  displayName?: string | null,
  lightThemeColor?: string | null,
  darkThemeColor?: string | null,
  profilePictureURL?: string | null,
  role?: string | null,
  Decks?: ModelMatchesConnection | null,
  WinningUser?: ModelMatchesConnection | null,
  lastLoggedIn?: string | null,
  createdAt: string,
  updatedAt: string,
};

export type ModelMatchesConnection = {
  __typename: "ModelMatchesConnection",
  items:  Array<Matches | null >,
  nextToken?: string | null,
};

export type Matches = {
  __typename: "Matches",
  id: string,
  winningUserID: string,
  matchType: string,
  isArchived: boolean,
  MatchParticipants?: ModelMatchParticipantsConnection | null,
  datePlayed: string,
  createdAt: string,
  updatedAt: string,
};

export type ModelMatchParticipantsConnection = {
  __typename: "ModelMatchParticipantsConnection",
  items:  Array<MatchParticipants | null >,
  nextToken?: string | null,
};

export type UpdateUsersInput = {
  id: string,
  displayName?: string | null,
  lightThemeColor?: string | null,
  darkThemeColor?: string | null,
  profilePictureURL?: string | null,
  role?: string | null,
  lastLoggedIn?: string | null,
};

export type DeleteUsersInput = {
  id: string,
};

export type CreateDecksInput = {
  id?: string | null,
  deckOwnerID: string,
  deckName: string,
  commanderName: string,
  commanderColors?: Array< string > | null,
  deckType: string,
  link?: string | null,
  cost?: number | null,
};

export type ModelDecksConditionInput = {
  deckOwnerID?: ModelIDInput | null,
  deckName?: ModelStringInput | null,
  commanderName?: ModelStringInput | null,
  commanderColors?: ModelStringInput | null,
  deckType?: ModelStringInput | null,
  link?: ModelStringInput | null,
  cost?: ModelFloatInput | null,
  and?: Array< ModelDecksConditionInput | null > | null,
  or?: Array< ModelDecksConditionInput | null > | null,
  not?: ModelDecksConditionInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelFloatInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type Decks = {
  __typename: "Decks",
  id: string,
  deckOwnerID: string,
  deckName: string,
  commanderName: string,
  commanderColors?: Array< string > | null,
  deckType: string,
  MatchParticipants?: ModelMatchParticipantsConnection | null,
  link?: string | null,
  cost?: number | null,
  createdAt: string,
  updatedAt: string,
};

export type UpdateDecksInput = {
  id: string,
  deckOwnerID?: string | null,
  deckName?: string | null,
  commanderName?: string | null,
  commanderColors?: Array< string > | null,
  deckType?: string | null,
  link?: string | null,
  cost?: number | null,
};

export type DeleteDecksInput = {
  id: string,
};

export type CreateMatchesInput = {
  id?: string | null,
  winningUserID: string,
  matchType: string,
  isArchived: boolean,
  datePlayed: string,
};

export type ModelMatchesConditionInput = {
  winningUserID?: ModelIDInput | null,
  matchType?: ModelStringInput | null,
  isArchived?: ModelBooleanInput | null,
  datePlayed?: ModelStringInput | null,
  and?: Array< ModelMatchesConditionInput | null > | null,
  or?: Array< ModelMatchesConditionInput | null > | null,
  not?: ModelMatchesConditionInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelBooleanInput = {
  ne?: boolean | null,
  eq?: boolean | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type UpdateMatchesInput = {
  id: string,
  winningUserID?: string | null,
  matchType?: string | null,
  isArchived?: boolean | null,
  datePlayed?: string | null,
};

export type DeleteMatchesInput = {
  id: string,
};

export type ModelMatchParticipantsFilterInput = {
  id?: ModelIDInput | null,
  decksID?: ModelIDInput | null,
  matchesID?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelMatchParticipantsFilterInput | null > | null,
  or?: Array< ModelMatchParticipantsFilterInput | null > | null,
  not?: ModelMatchParticipantsFilterInput | null,
};

export enum ModelSortDirection {
  ASC = "ASC",
  DESC = "DESC",
}


export type ModelUsersFilterInput = {
  id?: ModelIDInput | null,
  displayName?: ModelStringInput | null,
  lightThemeColor?: ModelStringInput | null,
  darkThemeColor?: ModelStringInput | null,
  profilePictureURL?: ModelStringInput | null,
  role?: ModelStringInput | null,
  lastLoggedIn?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelUsersFilterInput | null > | null,
  or?: Array< ModelUsersFilterInput | null > | null,
  not?: ModelUsersFilterInput | null,
};

export type ModelUsersConnection = {
  __typename: "ModelUsersConnection",
  items:  Array<Users | null >,
  nextToken?: string | null,
};

export type ModelDecksFilterInput = {
  id?: ModelIDInput | null,
  deckOwnerID?: ModelIDInput | null,
  deckName?: ModelStringInput | null,
  commanderName?: ModelStringInput | null,
  commanderColors?: ModelStringInput | null,
  deckType?: ModelStringInput | null,
  link?: ModelStringInput | null,
  cost?: ModelFloatInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelDecksFilterInput | null > | null,
  or?: Array< ModelDecksFilterInput | null > | null,
  not?: ModelDecksFilterInput | null,
};

export type ModelDecksConnection = {
  __typename: "ModelDecksConnection",
  items:  Array<Decks | null >,
  nextToken?: string | null,
};

export type ModelMatchesFilterInput = {
  id?: ModelIDInput | null,
  winningUserID?: ModelIDInput | null,
  matchType?: ModelStringInput | null,
  isArchived?: ModelBooleanInput | null,
  datePlayed?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelMatchesFilterInput | null > | null,
  or?: Array< ModelMatchesFilterInput | null > | null,
  not?: ModelMatchesFilterInput | null,
};

export type ModelSubscriptionMatchParticipantsFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  decksID?: ModelSubscriptionIDInput | null,
  matchesID?: ModelSubscriptionIDInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionMatchParticipantsFilterInput | null > | null,
  or?: Array< ModelSubscriptionMatchParticipantsFilterInput | null > | null,
};

export type ModelSubscriptionIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  in?: Array< string | null > | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  in?: Array< string | null > | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionUsersFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  displayName?: ModelSubscriptionStringInput | null,
  lightThemeColor?: ModelSubscriptionStringInput | null,
  darkThemeColor?: ModelSubscriptionStringInput | null,
  profilePictureURL?: ModelSubscriptionStringInput | null,
  role?: ModelSubscriptionStringInput | null,
  lastLoggedIn?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionUsersFilterInput | null > | null,
  or?: Array< ModelSubscriptionUsersFilterInput | null > | null,
};

export type ModelSubscriptionDecksFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  deckOwnerID?: ModelSubscriptionIDInput | null,
  deckName?: ModelSubscriptionStringInput | null,
  commanderName?: ModelSubscriptionStringInput | null,
  commanderColors?: ModelSubscriptionStringInput | null,
  deckType?: ModelSubscriptionStringInput | null,
  link?: ModelSubscriptionStringInput | null,
  cost?: ModelSubscriptionFloatInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionDecksFilterInput | null > | null,
  or?: Array< ModelSubscriptionDecksFilterInput | null > | null,
};

export type ModelSubscriptionFloatInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  in?: Array< number | null > | null,
  notIn?: Array< number | null > | null,
};

export type ModelSubscriptionMatchesFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  winningUserID?: ModelSubscriptionIDInput | null,
  matchType?: ModelSubscriptionStringInput | null,
  isArchived?: ModelSubscriptionBooleanInput | null,
  datePlayed?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionMatchesFilterInput | null > | null,
  or?: Array< ModelSubscriptionMatchesFilterInput | null > | null,
};

export type ModelSubscriptionBooleanInput = {
  ne?: boolean | null,
  eq?: boolean | null,
};

export type CreateMatchParticipantsMutationVariables = {
  input: CreateMatchParticipantsInput,
  condition?: ModelMatchParticipantsConditionInput | null,
};

export type CreateMatchParticipantsMutation = {
  createMatchParticipants?:  {
    __typename: "MatchParticipants",
    id: string,
    decksID: string,
    matchesID: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateMatchParticipantsMutationVariables = {
  input: UpdateMatchParticipantsInput,
  condition?: ModelMatchParticipantsConditionInput | null,
};

export type UpdateMatchParticipantsMutation = {
  updateMatchParticipants?:  {
    __typename: "MatchParticipants",
    id: string,
    decksID: string,
    matchesID: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteMatchParticipantsMutationVariables = {
  input: DeleteMatchParticipantsInput,
  condition?: ModelMatchParticipantsConditionInput | null,
};

export type DeleteMatchParticipantsMutation = {
  deleteMatchParticipants?:  {
    __typename: "MatchParticipants",
    id: string,
    decksID: string,
    matchesID: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateUsersMutationVariables = {
  input: CreateUsersInput,
  condition?: ModelUsersConditionInput | null,
};

export type CreateUsersMutation = {
  createUsers?:  {
    __typename: "Users",
    id: string,
    displayName?: string | null,
    lightThemeColor?: string | null,
    darkThemeColor?: string | null,
    profilePictureURL?: string | null,
    role?: string | null,
    Decks?:  {
      __typename: "ModelMatchesConnection",
      nextToken?: string | null,
    } | null,
    WinningUser?:  {
      __typename: "ModelMatchesConnection",
      nextToken?: string | null,
    } | null,
    lastLoggedIn?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateUsersMutationVariables = {
  input: UpdateUsersInput,
  condition?: ModelUsersConditionInput | null,
};

export type UpdateUsersMutation = {
  updateUsers?:  {
    __typename: "Users",
    id: string,
    displayName?: string | null,
    lightThemeColor?: string | null,
    darkThemeColor?: string | null,
    profilePictureURL?: string | null,
    role?: string | null,
    Decks?:  {
      __typename: "ModelMatchesConnection",
      nextToken?: string | null,
    } | null,
    WinningUser?:  {
      __typename: "ModelMatchesConnection",
      nextToken?: string | null,
    } | null,
    lastLoggedIn?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteUsersMutationVariables = {
  input: DeleteUsersInput,
  condition?: ModelUsersConditionInput | null,
};

export type DeleteUsersMutation = {
  deleteUsers?:  {
    __typename: "Users",
    id: string,
    displayName?: string | null,
    lightThemeColor?: string | null,
    darkThemeColor?: string | null,
    profilePictureURL?: string | null,
    role?: string | null,
    Decks?:  {
      __typename: "ModelMatchesConnection",
      nextToken?: string | null,
    } | null,
    WinningUser?:  {
      __typename: "ModelMatchesConnection",
      nextToken?: string | null,
    } | null,
    lastLoggedIn?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateDecksMutationVariables = {
  input: CreateDecksInput,
  condition?: ModelDecksConditionInput | null,
};

export type CreateDecksMutation = {
  createDecks?:  {
    __typename: "Decks",
    id: string,
    deckOwnerID: string,
    deckName: string,
    commanderName: string,
    commanderColors?: Array< string > | null,
    deckType: string,
    MatchParticipants?:  {
      __typename: "ModelMatchParticipantsConnection",
      nextToken?: string | null,
    } | null,
    link?: string | null,
    cost?: number | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateDecksMutationVariables = {
  input: UpdateDecksInput,
  condition?: ModelDecksConditionInput | null,
};

export type UpdateDecksMutation = {
  updateDecks?:  {
    __typename: "Decks",
    id: string,
    deckOwnerID: string,
    deckName: string,
    commanderName: string,
    commanderColors?: Array< string > | null,
    deckType: string,
    MatchParticipants?:  {
      __typename: "ModelMatchParticipantsConnection",
      nextToken?: string | null,
    } | null,
    link?: string | null,
    cost?: number | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteDecksMutationVariables = {
  input: DeleteDecksInput,
  condition?: ModelDecksConditionInput | null,
};

export type DeleteDecksMutation = {
  deleteDecks?:  {
    __typename: "Decks",
    id: string,
    deckOwnerID: string,
    deckName: string,
    commanderName: string,
    commanderColors?: Array< string > | null,
    deckType: string,
    MatchParticipants?:  {
      __typename: "ModelMatchParticipantsConnection",
      nextToken?: string | null,
    } | null,
    link?: string | null,
    cost?: number | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateMatchesMutationVariables = {
  input: CreateMatchesInput,
  condition?: ModelMatchesConditionInput | null,
};

export type CreateMatchesMutation = {
  createMatches?:  {
    __typename: "Matches",
    id: string,
    winningUserID: string,
    matchType: string,
    isArchived: boolean,
    MatchParticipants?:  {
      __typename: "ModelMatchParticipantsConnection",
      nextToken?: string | null,
    } | null,
    datePlayed: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateMatchesMutationVariables = {
  input: UpdateMatchesInput,
  condition?: ModelMatchesConditionInput | null,
};

export type UpdateMatchesMutation = {
  updateMatches?:  {
    __typename: "Matches",
    id: string,
    winningUserID: string,
    matchType: string,
    isArchived: boolean,
    MatchParticipants?:  {
      __typename: "ModelMatchParticipantsConnection",
      nextToken?: string | null,
    } | null,
    datePlayed: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteMatchesMutationVariables = {
  input: DeleteMatchesInput,
  condition?: ModelMatchesConditionInput | null,
};

export type DeleteMatchesMutation = {
  deleteMatches?:  {
    __typename: "Matches",
    id: string,
    winningUserID: string,
    matchType: string,
    isArchived: boolean,
    MatchParticipants?:  {
      __typename: "ModelMatchParticipantsConnection",
      nextToken?: string | null,
    } | null,
    datePlayed: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type GetMatchParticipantsQueryVariables = {
  id: string,
};

export type GetMatchParticipantsQuery = {
  getMatchParticipants?:  {
    __typename: "MatchParticipants",
    id: string,
    decksID: string,
    matchesID: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListMatchParticipantsQueryVariables = {
  filter?: ModelMatchParticipantsFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListMatchParticipantsQuery = {
  listMatchParticipants?:  {
    __typename: "ModelMatchParticipantsConnection",
    items:  Array< {
      __typename: "MatchParticipants",
      id: string,
      decksID: string,
      matchesID: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type MatchParticipantsByDecksIDQueryVariables = {
  decksID: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelMatchParticipantsFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type MatchParticipantsByDecksIDQuery = {
  matchParticipantsByDecksID?:  {
    __typename: "ModelMatchParticipantsConnection",
    items:  Array< {
      __typename: "MatchParticipants",
      id: string,
      decksID: string,
      matchesID: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type MatchParticipantsByMatchesIDQueryVariables = {
  matchesID: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelMatchParticipantsFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type MatchParticipantsByMatchesIDQuery = {
  matchParticipantsByMatchesID?:  {
    __typename: "ModelMatchParticipantsConnection",
    items:  Array< {
      __typename: "MatchParticipants",
      id: string,
      decksID: string,
      matchesID: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetUsersQueryVariables = {
  id: string,
};

export type GetUsersQuery = {
  getUsers?:  {
    __typename: "Users",
    id: string,
    displayName?: string | null,
    lightThemeColor?: string | null,
    darkThemeColor?: string | null,
    profilePictureURL?: string | null,
    role?: string | null,
    Decks?:  {
      __typename: "ModelMatchesConnection",
      nextToken?: string | null,
    } | null,
    WinningUser?:  {
      __typename: "ModelMatchesConnection",
      nextToken?: string | null,
    } | null,
    lastLoggedIn?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListUsersQueryVariables = {
  filter?: ModelUsersFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListUsersQuery = {
  listUsers?:  {
    __typename: "ModelUsersConnection",
    items:  Array< {
      __typename: "Users",
      id: string,
      displayName?: string | null,
      lightThemeColor?: string | null,
      darkThemeColor?: string | null,
      profilePictureURL?: string | null,
      role?: string | null,
      lastLoggedIn?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetDecksQueryVariables = {
  id: string,
};

export type GetDecksQuery = {
  getDecks?:  {
    __typename: "Decks",
    id: string,
    deckOwnerID: string,
    deckName: string,
    commanderName: string,
    commanderColors?: Array< string > | null,
    deckType: string,
    MatchParticipants?:  {
      __typename: "ModelMatchParticipantsConnection",
      nextToken?: string | null,
    } | null,
    link?: string | null,
    cost?: number | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListDecksQueryVariables = {
  filter?: ModelDecksFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListDecksQuery = {
  listDecks?:  {
    __typename: "ModelDecksConnection",
    items:  Array< {
      __typename: "Decks",
      id: string,
      deckOwnerID: string,
      deckName: string,
      commanderName: string,
      commanderColors?: Array< string > | null,
      deckType: string,
      link?: string | null,
      cost?: number | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type DecksByDeckOwnerIDQueryVariables = {
  deckOwnerID: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelDecksFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type DecksByDeckOwnerIDQuery = {
  decksByDeckOwnerID?:  {
    __typename: "ModelDecksConnection",
    items:  Array< {
      __typename: "Decks",
      id: string,
      deckOwnerID: string,
      deckName: string,
      commanderName: string,
      commanderColors?: Array< string > | null,
      deckType: string,
      link?: string | null,
      cost?: number | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetMatchesQueryVariables = {
  id: string,
};

export type GetMatchesQuery = {
  getMatches?:  {
    __typename: "Matches",
    id: string,
    winningUserID: string,
    matchType: string,
    isArchived: boolean,
    MatchParticipants?:  {
      __typename: "ModelMatchParticipantsConnection",
      nextToken?: string | null,
    } | null,
    datePlayed: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListMatchesQueryVariables = {
  filter?: ModelMatchesFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListMatchesQuery = {
  listMatches?:  {
    __typename: "ModelMatchesConnection",
    items:  Array< {
      __typename: "Matches",
      id: string,
      winningUserID: string,
      matchType: string,
      isArchived: boolean,
      datePlayed: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type MatchesByWinningUserIDQueryVariables = {
  winningUserID: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelMatchesFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type MatchesByWinningUserIDQuery = {
  matchesByWinningUserID?:  {
    __typename: "ModelMatchesConnection",
    items:  Array< {
      __typename: "Matches",
      id: string,
      winningUserID: string,
      matchType: string,
      isArchived: boolean,
      datePlayed: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type OnCreateMatchParticipantsSubscriptionVariables = {
  filter?: ModelSubscriptionMatchParticipantsFilterInput | null,
};

export type OnCreateMatchParticipantsSubscription = {
  onCreateMatchParticipants?:  {
    __typename: "MatchParticipants",
    id: string,
    decksID: string,
    matchesID: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateMatchParticipantsSubscriptionVariables = {
  filter?: ModelSubscriptionMatchParticipantsFilterInput | null,
};

export type OnUpdateMatchParticipantsSubscription = {
  onUpdateMatchParticipants?:  {
    __typename: "MatchParticipants",
    id: string,
    decksID: string,
    matchesID: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteMatchParticipantsSubscriptionVariables = {
  filter?: ModelSubscriptionMatchParticipantsFilterInput | null,
};

export type OnDeleteMatchParticipantsSubscription = {
  onDeleteMatchParticipants?:  {
    __typename: "MatchParticipants",
    id: string,
    decksID: string,
    matchesID: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateUsersSubscriptionVariables = {
  filter?: ModelSubscriptionUsersFilterInput | null,
};

export type OnCreateUsersSubscription = {
  onCreateUsers?:  {
    __typename: "Users",
    id: string,
    displayName?: string | null,
    lightThemeColor?: string | null,
    darkThemeColor?: string | null,
    profilePictureURL?: string | null,
    role?: string | null,
    Decks?:  {
      __typename: "ModelMatchesConnection",
      nextToken?: string | null,
    } | null,
    WinningUser?:  {
      __typename: "ModelMatchesConnection",
      nextToken?: string | null,
    } | null,
    lastLoggedIn?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateUsersSubscriptionVariables = {
  filter?: ModelSubscriptionUsersFilterInput | null,
};

export type OnUpdateUsersSubscription = {
  onUpdateUsers?:  {
    __typename: "Users",
    id: string,
    displayName?: string | null,
    lightThemeColor?: string | null,
    darkThemeColor?: string | null,
    profilePictureURL?: string | null,
    role?: string | null,
    Decks?:  {
      __typename: "ModelMatchesConnection",
      nextToken?: string | null,
    } | null,
    WinningUser?:  {
      __typename: "ModelMatchesConnection",
      nextToken?: string | null,
    } | null,
    lastLoggedIn?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteUsersSubscriptionVariables = {
  filter?: ModelSubscriptionUsersFilterInput | null,
};

export type OnDeleteUsersSubscription = {
  onDeleteUsers?:  {
    __typename: "Users",
    id: string,
    displayName?: string | null,
    lightThemeColor?: string | null,
    darkThemeColor?: string | null,
    profilePictureURL?: string | null,
    role?: string | null,
    Decks?:  {
      __typename: "ModelMatchesConnection",
      nextToken?: string | null,
    } | null,
    WinningUser?:  {
      __typename: "ModelMatchesConnection",
      nextToken?: string | null,
    } | null,
    lastLoggedIn?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateDecksSubscriptionVariables = {
  filter?: ModelSubscriptionDecksFilterInput | null,
};

export type OnCreateDecksSubscription = {
  onCreateDecks?:  {
    __typename: "Decks",
    id: string,
    deckOwnerID: string,
    deckName: string,
    commanderName: string,
    commanderColors?: Array< string > | null,
    deckType: string,
    MatchParticipants?:  {
      __typename: "ModelMatchParticipantsConnection",
      nextToken?: string | null,
    } | null,
    link?: string | null,
    cost?: number | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateDecksSubscriptionVariables = {
  filter?: ModelSubscriptionDecksFilterInput | null,
};

export type OnUpdateDecksSubscription = {
  onUpdateDecks?:  {
    __typename: "Decks",
    id: string,
    deckOwnerID: string,
    deckName: string,
    commanderName: string,
    commanderColors?: Array< string > | null,
    deckType: string,
    MatchParticipants?:  {
      __typename: "ModelMatchParticipantsConnection",
      nextToken?: string | null,
    } | null,
    link?: string | null,
    cost?: number | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteDecksSubscriptionVariables = {
  filter?: ModelSubscriptionDecksFilterInput | null,
};

export type OnDeleteDecksSubscription = {
  onDeleteDecks?:  {
    __typename: "Decks",
    id: string,
    deckOwnerID: string,
    deckName: string,
    commanderName: string,
    commanderColors?: Array< string > | null,
    deckType: string,
    MatchParticipants?:  {
      __typename: "ModelMatchParticipantsConnection",
      nextToken?: string | null,
    } | null,
    link?: string | null,
    cost?: number | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateMatchesSubscriptionVariables = {
  filter?: ModelSubscriptionMatchesFilterInput | null,
};

export type OnCreateMatchesSubscription = {
  onCreateMatches?:  {
    __typename: "Matches",
    id: string,
    winningUserID: string,
    matchType: string,
    isArchived: boolean,
    MatchParticipants?:  {
      __typename: "ModelMatchParticipantsConnection",
      nextToken?: string | null,
    } | null,
    datePlayed: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateMatchesSubscriptionVariables = {
  filter?: ModelSubscriptionMatchesFilterInput | null,
};

export type OnUpdateMatchesSubscription = {
  onUpdateMatches?:  {
    __typename: "Matches",
    id: string,
    winningUserID: string,
    matchType: string,
    isArchived: boolean,
    MatchParticipants?:  {
      __typename: "ModelMatchParticipantsConnection",
      nextToken?: string | null,
    } | null,
    datePlayed: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteMatchesSubscriptionVariables = {
  filter?: ModelSubscriptionMatchesFilterInput | null,
};

export type OnDeleteMatchesSubscription = {
  onDeleteMatches?:  {
    __typename: "Matches",
    id: string,
    winningUserID: string,
    matchType: string,
    isArchived: boolean,
    MatchParticipants?:  {
      __typename: "ModelMatchParticipantsConnection",
      nextToken?: string | null,
    } | null,
    datePlayed: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};
