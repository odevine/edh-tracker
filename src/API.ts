/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateUserInput = {
  id?: string | null,
  displayName: string,
  description?: string | null,
  lightThemeColor?: string | null,
  darkThemeColor?: string | null,
  profilePictureURL?: string | null,
  role?: string | null,
  lastOnline?: string | null,
};

export type ModelUserConditionInput = {
  displayName?: ModelStringInput | null,
  description?: ModelStringInput | null,
  lightThemeColor?: ModelStringInput | null,
  darkThemeColor?: ModelStringInput | null,
  profilePictureURL?: ModelStringInput | null,
  role?: ModelStringInput | null,
  lastOnline?: ModelStringInput | null,
  and?: Array< ModelUserConditionInput | null > | null,
  or?: Array< ModelUserConditionInput | null > | null,
  not?: ModelUserConditionInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
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

export type User = {
  __typename: "User",
  id: string,
  displayName: string,
  description?: string | null,
  lightThemeColor?: string | null,
  darkThemeColor?: string | null,
  profilePictureURL?: string | null,
  role?: string | null,
  lastOnline?: string | null,
  decks?: ModelDeckConnection | null,
  createdAt: string,
  updatedAt: string,
};

export type ModelDeckConnection = {
  __typename: "ModelDeckConnection",
  items:  Array<Deck | null >,
  nextToken?: string | null,
};

export type Deck = {
  __typename: "Deck",
  id: string,
  deckOwnerId: string,
  deckName: string,
  commanderName: string,
  commanderColors?: Array< string > | null,
  deckType: string,
  link?: string | null,
  cost?: number | null,
  winningMatches?: ModelMatchConnection | null,
  matchParticipants?: ModelMatchParticipantConnection | null,
  createdAt: string,
  updatedAt: string,
};

export type ModelMatchConnection = {
  __typename: "ModelMatchConnection",
  items:  Array<Match | null >,
  nextToken?: string | null,
};

export type Match = {
  __typename: "Match",
  id: string,
  winningDeckId: string,
  matchType: string,
  isArchived: boolean,
  datePlayed: string,
  matchParticipants?: ModelMatchParticipantConnection | null,
  createdAt: string,
  updatedAt: string,
};

export type ModelMatchParticipantConnection = {
  __typename: "ModelMatchParticipantConnection",
  items:  Array<MatchParticipant | null >,
  nextToken?: string | null,
};

export type MatchParticipant = {
  __typename: "MatchParticipant",
  id: string,
  deckId: string,
  matchId: string,
  createdAt: string,
  updatedAt: string,
};

export type UpdateUserInput = {
  id: string,
  displayName?: string | null,
  description?: string | null,
  lightThemeColor?: string | null,
  darkThemeColor?: string | null,
  profilePictureURL?: string | null,
  role?: string | null,
  lastOnline?: string | null,
};

export type DeleteUserInput = {
  id: string,
};

export type CreateDeckInput = {
  id?: string | null,
  deckOwnerId: string,
  deckName: string,
  commanderName: string,
  commanderColors?: Array< string > | null,
  deckType: string,
  link?: string | null,
  cost?: number | null,
};

export type ModelDeckConditionInput = {
  deckOwnerId?: ModelIDInput | null,
  deckName?: ModelStringInput | null,
  commanderName?: ModelStringInput | null,
  commanderColors?: ModelStringInput | null,
  deckType?: ModelStringInput | null,
  link?: ModelStringInput | null,
  cost?: ModelFloatInput | null,
  and?: Array< ModelDeckConditionInput | null > | null,
  or?: Array< ModelDeckConditionInput | null > | null,
  not?: ModelDeckConditionInput | null,
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

export type UpdateDeckInput = {
  id: string,
  deckOwnerId?: string | null,
  deckName?: string | null,
  commanderName?: string | null,
  commanderColors?: Array< string > | null,
  deckType?: string | null,
  link?: string | null,
  cost?: number | null,
};

export type DeleteDeckInput = {
  id: string,
};

export type CreateMatchInput = {
  id?: string | null,
  winningDeckId: string,
  matchType: string,
  isArchived: boolean,
  datePlayed: string,
};

export type ModelMatchConditionInput = {
  winningDeckId?: ModelIDInput | null,
  matchType?: ModelStringInput | null,
  isArchived?: ModelBooleanInput | null,
  datePlayed?: ModelStringInput | null,
  and?: Array< ModelMatchConditionInput | null > | null,
  or?: Array< ModelMatchConditionInput | null > | null,
  not?: ModelMatchConditionInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelBooleanInput = {
  ne?: boolean | null,
  eq?: boolean | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type UpdateMatchInput = {
  id: string,
  winningDeckId?: string | null,
  matchType?: string | null,
  isArchived?: boolean | null,
  datePlayed?: string | null,
};

export type DeleteMatchInput = {
  id: string,
};

export type CreateMatchParticipantInput = {
  id?: string | null,
  deckId: string,
  matchId: string,
};

export type ModelMatchParticipantConditionInput = {
  deckId?: ModelIDInput | null,
  matchId?: ModelIDInput | null,
  and?: Array< ModelMatchParticipantConditionInput | null > | null,
  or?: Array< ModelMatchParticipantConditionInput | null > | null,
  not?: ModelMatchParticipantConditionInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type UpdateMatchParticipantInput = {
  id: string,
  deckId?: string | null,
  matchId?: string | null,
};

export type DeleteMatchParticipantInput = {
  id: string,
};

export type ModelUserFilterInput = {
  id?: ModelIDInput | null,
  displayName?: ModelStringInput | null,
  description?: ModelStringInput | null,
  lightThemeColor?: ModelStringInput | null,
  darkThemeColor?: ModelStringInput | null,
  profilePictureURL?: ModelStringInput | null,
  role?: ModelStringInput | null,
  lastOnline?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelUserFilterInput | null > | null,
  or?: Array< ModelUserFilterInput | null > | null,
  not?: ModelUserFilterInput | null,
};

export type ModelUserConnection = {
  __typename: "ModelUserConnection",
  items:  Array<User | null >,
  nextToken?: string | null,
};

export type ModelDeckFilterInput = {
  id?: ModelIDInput | null,
  deckOwnerId?: ModelIDInput | null,
  deckName?: ModelStringInput | null,
  commanderName?: ModelStringInput | null,
  commanderColors?: ModelStringInput | null,
  deckType?: ModelStringInput | null,
  link?: ModelStringInput | null,
  cost?: ModelFloatInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelDeckFilterInput | null > | null,
  or?: Array< ModelDeckFilterInput | null > | null,
  not?: ModelDeckFilterInput | null,
};

export enum ModelSortDirection {
  ASC = "ASC",
  DESC = "DESC",
}


export type ModelMatchFilterInput = {
  id?: ModelIDInput | null,
  winningDeckId?: ModelIDInput | null,
  matchType?: ModelStringInput | null,
  isArchived?: ModelBooleanInput | null,
  datePlayed?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelMatchFilterInput | null > | null,
  or?: Array< ModelMatchFilterInput | null > | null,
  not?: ModelMatchFilterInput | null,
};

export type ModelMatchParticipantFilterInput = {
  id?: ModelIDInput | null,
  deckId?: ModelIDInput | null,
  matchId?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelMatchParticipantFilterInput | null > | null,
  or?: Array< ModelMatchParticipantFilterInput | null > | null,
  not?: ModelMatchParticipantFilterInput | null,
};

export type ModelSubscriptionUserFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  displayName?: ModelSubscriptionStringInput | null,
  description?: ModelSubscriptionStringInput | null,
  lightThemeColor?: ModelSubscriptionStringInput | null,
  darkThemeColor?: ModelSubscriptionStringInput | null,
  profilePictureURL?: ModelSubscriptionStringInput | null,
  role?: ModelSubscriptionStringInput | null,
  lastOnline?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionUserFilterInput | null > | null,
  or?: Array< ModelSubscriptionUserFilterInput | null > | null,
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

export type ModelSubscriptionDeckFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  deckOwnerId?: ModelSubscriptionIDInput | null,
  deckName?: ModelSubscriptionStringInput | null,
  commanderName?: ModelSubscriptionStringInput | null,
  commanderColors?: ModelSubscriptionStringInput | null,
  deckType?: ModelSubscriptionStringInput | null,
  link?: ModelSubscriptionStringInput | null,
  cost?: ModelSubscriptionFloatInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionDeckFilterInput | null > | null,
  or?: Array< ModelSubscriptionDeckFilterInput | null > | null,
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

export type ModelSubscriptionMatchFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  winningDeckId?: ModelSubscriptionIDInput | null,
  matchType?: ModelSubscriptionStringInput | null,
  isArchived?: ModelSubscriptionBooleanInput | null,
  datePlayed?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionMatchFilterInput | null > | null,
  or?: Array< ModelSubscriptionMatchFilterInput | null > | null,
};

export type ModelSubscriptionBooleanInput = {
  ne?: boolean | null,
  eq?: boolean | null,
};

export type ModelSubscriptionMatchParticipantFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  deckId?: ModelSubscriptionIDInput | null,
  matchId?: ModelSubscriptionIDInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionMatchParticipantFilterInput | null > | null,
  or?: Array< ModelSubscriptionMatchParticipantFilterInput | null > | null,
};

export type CreateUserMutationVariables = {
  input: CreateUserInput,
  condition?: ModelUserConditionInput | null,
};

export type CreateUserMutation = {
  createUser?:  {
    __typename: "User",
    id: string,
    displayName: string,
    description?: string | null,
    lightThemeColor?: string | null,
    darkThemeColor?: string | null,
    profilePictureURL?: string | null,
    role?: string | null,
    lastOnline?: string | null,
    decks?:  {
      __typename: "ModelDeckConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateUserMutationVariables = {
  input: UpdateUserInput,
  condition?: ModelUserConditionInput | null,
};

export type UpdateUserMutation = {
  updateUser?:  {
    __typename: "User",
    id: string,
    displayName: string,
    description?: string | null,
    lightThemeColor?: string | null,
    darkThemeColor?: string | null,
    profilePictureURL?: string | null,
    role?: string | null,
    lastOnline?: string | null,
    decks?:  {
      __typename: "ModelDeckConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteUserMutationVariables = {
  input: DeleteUserInput,
  condition?: ModelUserConditionInput | null,
};

export type DeleteUserMutation = {
  deleteUser?:  {
    __typename: "User",
    id: string,
    displayName: string,
    description?: string | null,
    lightThemeColor?: string | null,
    darkThemeColor?: string | null,
    profilePictureURL?: string | null,
    role?: string | null,
    lastOnline?: string | null,
    decks?:  {
      __typename: "ModelDeckConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateDeckMutationVariables = {
  input: CreateDeckInput,
  condition?: ModelDeckConditionInput | null,
};

export type CreateDeckMutation = {
  createDeck?:  {
    __typename: "Deck",
    id: string,
    deckOwnerId: string,
    deckName: string,
    commanderName: string,
    commanderColors?: Array< string > | null,
    deckType: string,
    link?: string | null,
    cost?: number | null,
    winningMatches?:  {
      __typename: "ModelMatchConnection",
      nextToken?: string | null,
    } | null,
    matchParticipants?:  {
      __typename: "ModelMatchParticipantConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateDeckMutationVariables = {
  input: UpdateDeckInput,
  condition?: ModelDeckConditionInput | null,
};

export type UpdateDeckMutation = {
  updateDeck?:  {
    __typename: "Deck",
    id: string,
    deckOwnerId: string,
    deckName: string,
    commanderName: string,
    commanderColors?: Array< string > | null,
    deckType: string,
    link?: string | null,
    cost?: number | null,
    winningMatches?:  {
      __typename: "ModelMatchConnection",
      nextToken?: string | null,
    } | null,
    matchParticipants?:  {
      __typename: "ModelMatchParticipantConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteDeckMutationVariables = {
  input: DeleteDeckInput,
  condition?: ModelDeckConditionInput | null,
};

export type DeleteDeckMutation = {
  deleteDeck?:  {
    __typename: "Deck",
    id: string,
    deckOwnerId: string,
    deckName: string,
    commanderName: string,
    commanderColors?: Array< string > | null,
    deckType: string,
    link?: string | null,
    cost?: number | null,
    winningMatches?:  {
      __typename: "ModelMatchConnection",
      nextToken?: string | null,
    } | null,
    matchParticipants?:  {
      __typename: "ModelMatchParticipantConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateMatchMutationVariables = {
  input: CreateMatchInput,
  condition?: ModelMatchConditionInput | null,
};

export type CreateMatchMutation = {
  createMatch?:  {
    __typename: "Match",
    id: string,
    winningDeckId: string,
    matchType: string,
    isArchived: boolean,
    datePlayed: string,
    matchParticipants?:  {
      __typename: "ModelMatchParticipantConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateMatchMutationVariables = {
  input: UpdateMatchInput,
  condition?: ModelMatchConditionInput | null,
};

export type UpdateMatchMutation = {
  updateMatch?:  {
    __typename: "Match",
    id: string,
    winningDeckId: string,
    matchType: string,
    isArchived: boolean,
    datePlayed: string,
    matchParticipants?:  {
      __typename: "ModelMatchParticipantConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteMatchMutationVariables = {
  input: DeleteMatchInput,
  condition?: ModelMatchConditionInput | null,
};

export type DeleteMatchMutation = {
  deleteMatch?:  {
    __typename: "Match",
    id: string,
    winningDeckId: string,
    matchType: string,
    isArchived: boolean,
    datePlayed: string,
    matchParticipants?:  {
      __typename: "ModelMatchParticipantConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateMatchParticipantMutationVariables = {
  input: CreateMatchParticipantInput,
  condition?: ModelMatchParticipantConditionInput | null,
};

export type CreateMatchParticipantMutation = {
  createMatchParticipant?:  {
    __typename: "MatchParticipant",
    id: string,
    deckId: string,
    matchId: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateMatchParticipantMutationVariables = {
  input: UpdateMatchParticipantInput,
  condition?: ModelMatchParticipantConditionInput | null,
};

export type UpdateMatchParticipantMutation = {
  updateMatchParticipant?:  {
    __typename: "MatchParticipant",
    id: string,
    deckId: string,
    matchId: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteMatchParticipantMutationVariables = {
  input: DeleteMatchParticipantInput,
  condition?: ModelMatchParticipantConditionInput | null,
};

export type DeleteMatchParticipantMutation = {
  deleteMatchParticipant?:  {
    __typename: "MatchParticipant",
    id: string,
    deckId: string,
    matchId: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type GetUserQueryVariables = {
  id: string,
};

export type GetUserQuery = {
  getUser?:  {
    __typename: "User",
    id: string,
    displayName: string,
    description?: string | null,
    lightThemeColor?: string | null,
    darkThemeColor?: string | null,
    profilePictureURL?: string | null,
    role?: string | null,
    lastOnline?: string | null,
    decks?:  {
      __typename: "ModelDeckConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListUsersQueryVariables = {
  filter?: ModelUserFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListUsersQuery = {
  listUsers?:  {
    __typename: "ModelUserConnection",
    items:  Array< {
      __typename: "User",
      id: string,
      displayName: string,
      description?: string | null,
      lightThemeColor?: string | null,
      darkThemeColor?: string | null,
      profilePictureURL?: string | null,
      role?: string | null,
      lastOnline?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetDeckQueryVariables = {
  id: string,
};

export type GetDeckQuery = {
  getDeck?:  {
    __typename: "Deck",
    id: string,
    deckOwnerId: string,
    deckName: string,
    commanderName: string,
    commanderColors?: Array< string > | null,
    deckType: string,
    link?: string | null,
    cost?: number | null,
    winningMatches?:  {
      __typename: "ModelMatchConnection",
      nextToken?: string | null,
    } | null,
    matchParticipants?:  {
      __typename: "ModelMatchParticipantConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListDecksQueryVariables = {
  filter?: ModelDeckFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListDecksQuery = {
  listDecks?:  {
    __typename: "ModelDeckConnection",
    items:  Array< {
      __typename: "Deck",
      id: string,
      deckOwnerId: string,
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

export type DecksByDeckOwnerIdQueryVariables = {
  deckOwnerId: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelDeckFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type DecksByDeckOwnerIdQuery = {
  decksByDeckOwnerId?:  {
    __typename: "ModelDeckConnection",
    items:  Array< {
      __typename: "Deck",
      id: string,
      deckOwnerId: string,
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

export type GetMatchQueryVariables = {
  id: string,
};

export type GetMatchQuery = {
  getMatch?:  {
    __typename: "Match",
    id: string,
    winningDeckId: string,
    matchType: string,
    isArchived: boolean,
    datePlayed: string,
    matchParticipants?:  {
      __typename: "ModelMatchParticipantConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListMatchesQueryVariables = {
  filter?: ModelMatchFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListMatchesQuery = {
  listMatches?:  {
    __typename: "ModelMatchConnection",
    items:  Array< {
      __typename: "Match",
      id: string,
      winningDeckId: string,
      matchType: string,
      isArchived: boolean,
      datePlayed: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type MatchesByWinningDeckIdQueryVariables = {
  winningDeckId: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelMatchFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type MatchesByWinningDeckIdQuery = {
  matchesByWinningDeckId?:  {
    __typename: "ModelMatchConnection",
    items:  Array< {
      __typename: "Match",
      id: string,
      winningDeckId: string,
      matchType: string,
      isArchived: boolean,
      datePlayed: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetMatchParticipantQueryVariables = {
  id: string,
};

export type GetMatchParticipantQuery = {
  getMatchParticipant?:  {
    __typename: "MatchParticipant",
    id: string,
    deckId: string,
    matchId: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListMatchParticipantsQueryVariables = {
  filter?: ModelMatchParticipantFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListMatchParticipantsQuery = {
  listMatchParticipants?:  {
    __typename: "ModelMatchParticipantConnection",
    items:  Array< {
      __typename: "MatchParticipant",
      id: string,
      deckId: string,
      matchId: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type MatchParticipantsByDeckIdQueryVariables = {
  deckId: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelMatchParticipantFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type MatchParticipantsByDeckIdQuery = {
  matchParticipantsByDeckId?:  {
    __typename: "ModelMatchParticipantConnection",
    items:  Array< {
      __typename: "MatchParticipant",
      id: string,
      deckId: string,
      matchId: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type MatchParticipantsByMatchIdQueryVariables = {
  matchId: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelMatchParticipantFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type MatchParticipantsByMatchIdQuery = {
  matchParticipantsByMatchId?:  {
    __typename: "ModelMatchParticipantConnection",
    items:  Array< {
      __typename: "MatchParticipant",
      id: string,
      deckId: string,
      matchId: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type OnCreateUserSubscriptionVariables = {
  filter?: ModelSubscriptionUserFilterInput | null,
};

export type OnCreateUserSubscription = {
  onCreateUser?:  {
    __typename: "User",
    id: string,
    displayName: string,
    description?: string | null,
    lightThemeColor?: string | null,
    darkThemeColor?: string | null,
    profilePictureURL?: string | null,
    role?: string | null,
    lastOnline?: string | null,
    decks?:  {
      __typename: "ModelDeckConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateUserSubscriptionVariables = {
  filter?: ModelSubscriptionUserFilterInput | null,
};

export type OnUpdateUserSubscription = {
  onUpdateUser?:  {
    __typename: "User",
    id: string,
    displayName: string,
    description?: string | null,
    lightThemeColor?: string | null,
    darkThemeColor?: string | null,
    profilePictureURL?: string | null,
    role?: string | null,
    lastOnline?: string | null,
    decks?:  {
      __typename: "ModelDeckConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteUserSubscriptionVariables = {
  filter?: ModelSubscriptionUserFilterInput | null,
};

export type OnDeleteUserSubscription = {
  onDeleteUser?:  {
    __typename: "User",
    id: string,
    displayName: string,
    description?: string | null,
    lightThemeColor?: string | null,
    darkThemeColor?: string | null,
    profilePictureURL?: string | null,
    role?: string | null,
    lastOnline?: string | null,
    decks?:  {
      __typename: "ModelDeckConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateDeckSubscriptionVariables = {
  filter?: ModelSubscriptionDeckFilterInput | null,
};

export type OnCreateDeckSubscription = {
  onCreateDeck?:  {
    __typename: "Deck",
    id: string,
    deckOwnerId: string,
    deckName: string,
    commanderName: string,
    commanderColors?: Array< string > | null,
    deckType: string,
    link?: string | null,
    cost?: number | null,
    winningMatches?:  {
      __typename: "ModelMatchConnection",
      nextToken?: string | null,
    } | null,
    matchParticipants?:  {
      __typename: "ModelMatchParticipantConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateDeckSubscriptionVariables = {
  filter?: ModelSubscriptionDeckFilterInput | null,
};

export type OnUpdateDeckSubscription = {
  onUpdateDeck?:  {
    __typename: "Deck",
    id: string,
    deckOwnerId: string,
    deckName: string,
    commanderName: string,
    commanderColors?: Array< string > | null,
    deckType: string,
    link?: string | null,
    cost?: number | null,
    winningMatches?:  {
      __typename: "ModelMatchConnection",
      nextToken?: string | null,
    } | null,
    matchParticipants?:  {
      __typename: "ModelMatchParticipantConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteDeckSubscriptionVariables = {
  filter?: ModelSubscriptionDeckFilterInput | null,
};

export type OnDeleteDeckSubscription = {
  onDeleteDeck?:  {
    __typename: "Deck",
    id: string,
    deckOwnerId: string,
    deckName: string,
    commanderName: string,
    commanderColors?: Array< string > | null,
    deckType: string,
    link?: string | null,
    cost?: number | null,
    winningMatches?:  {
      __typename: "ModelMatchConnection",
      nextToken?: string | null,
    } | null,
    matchParticipants?:  {
      __typename: "ModelMatchParticipantConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateMatchSubscriptionVariables = {
  filter?: ModelSubscriptionMatchFilterInput | null,
};

export type OnCreateMatchSubscription = {
  onCreateMatch?:  {
    __typename: "Match",
    id: string,
    winningDeckId: string,
    matchType: string,
    isArchived: boolean,
    datePlayed: string,
    matchParticipants?:  {
      __typename: "ModelMatchParticipantConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateMatchSubscriptionVariables = {
  filter?: ModelSubscriptionMatchFilterInput | null,
};

export type OnUpdateMatchSubscription = {
  onUpdateMatch?:  {
    __typename: "Match",
    id: string,
    winningDeckId: string,
    matchType: string,
    isArchived: boolean,
    datePlayed: string,
    matchParticipants?:  {
      __typename: "ModelMatchParticipantConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteMatchSubscriptionVariables = {
  filter?: ModelSubscriptionMatchFilterInput | null,
};

export type OnDeleteMatchSubscription = {
  onDeleteMatch?:  {
    __typename: "Match",
    id: string,
    winningDeckId: string,
    matchType: string,
    isArchived: boolean,
    datePlayed: string,
    matchParticipants?:  {
      __typename: "ModelMatchParticipantConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateMatchParticipantSubscriptionVariables = {
  filter?: ModelSubscriptionMatchParticipantFilterInput | null,
};

export type OnCreateMatchParticipantSubscription = {
  onCreateMatchParticipant?:  {
    __typename: "MatchParticipant",
    id: string,
    deckId: string,
    matchId: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateMatchParticipantSubscriptionVariables = {
  filter?: ModelSubscriptionMatchParticipantFilterInput | null,
};

export type OnUpdateMatchParticipantSubscription = {
  onUpdateMatchParticipant?:  {
    __typename: "MatchParticipant",
    id: string,
    deckId: string,
    matchId: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteMatchParticipantSubscriptionVariables = {
  filter?: ModelSubscriptionMatchParticipantFilterInput | null,
};

export type OnDeleteMatchParticipantSubscription = {
  onDeleteMatchParticipant?:  {
    __typename: "MatchParticipant",
    id: string,
    deckId: string,
    matchId: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};
