import gql from 'graphql-tag';
import * as VueApolloComposable from '@vue/apollo-composable';
import * as VueCompositionApi from 'vue';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type ReactiveFunction<TParam> = () => TParam;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Card = {
  __typename?: 'Card';
  color?: Maybe<CardColor>;
  deck?: Maybe<Deck>;
  id: Scalars['ID']['output'];
  number?: Maybe<Scalars['Int']['output']>;
  type: CardType;
};

export enum CardColor {
  Blue = 'BLUE',
  Green = 'GREEN',
  Red = 'RED',
  Yellow = 'YELLOW'
}

export type CardInput = {
  color?: InputMaybe<CardColor>;
  id: Scalars['ID']['input'];
  number?: InputMaybe<Scalars['Int']['input']>;
  type: CardType;
};

export enum CardType {
  Draw = 'DRAW',
  Numbered = 'NUMBERED',
  Reverse = 'REVERSE',
  Skip = 'SKIP',
  Wild = 'WILD',
  WildDraw = 'WILD_DRAW'
}

export type Deck = {
  __typename?: 'Deck';
  cards: Array<Card>;
  id: Scalars['ID']['output'];
};

export type DeckInput = {
  cards: Array<CardInput>;
  id: Scalars['ID']['input'];
};

export type InitialCardInput = {
  color?: InputMaybe<CardColor>;
  number?: InputMaybe<Scalars['Int']['input']>;
  type: CardType;
};

export type InitialGameInput = {
  currentPlayerId?: InputMaybe<Scalars['ID']['input']>;
  deckCards: Array<InitialCardInput>;
  pileCards: Array<InitialCardInput>;
  playerCards: Array<InitialPlayerCardsInput>;
  roomId: Scalars['ID']['input'];
  roomState: RoomState;
};

export type InitialPlayerCardsInput = {
  cards: Array<InitialCardInput>;
  playerId: Scalars['ID']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createRoom: Room;
  deleteRoom?: Maybe<Scalars['Boolean']['output']>;
  initializeGame: Room;
  joinRoom: Room;
  loginPlayer: Player;
  registerPlayer: Player;
  updateRoom: Room;
};


export type MutationCreateRoomArgs = {
  hostId: Scalars['ID']['input'];
};


export type MutationDeleteRoomArgs = {
  id: Scalars['ID']['input'];
};


export type MutationInitializeGameArgs = {
  gameInput: InitialGameInput;
};


export type MutationJoinRoomArgs = {
  playerId: Scalars['ID']['input'];
  roomId: Scalars['ID']['input'];
};


export type MutationLoginPlayerArgs = {
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};


export type MutationRegisterPlayerArgs = {
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};


export type MutationUpdateRoomArgs = {
  room: RoomInput;
};

export type Player = {
  __typename?: 'Player';
  cards?: Maybe<Array<Card>>;
  id: Scalars['ID']['output'];
  password: Scalars['String']['output'];
  room?: Maybe<Room>;
  username: Scalars['String']['output'];
};

export type PlayerInput = {
  cards?: InputMaybe<Array<CardInput>>;
  id: Scalars['ID']['input'];
};

export type Query = {
  __typename?: 'Query';
  player?: Maybe<Player>;
  players: Array<Player>;
  room?: Maybe<Room>;
  rooms: Array<Room>;
};


export type QueryPlayerArgs = {
  id: Scalars['ID']['input'];
};


export type QueryRoomArgs = {
  id: Scalars['ID']['input'];
};

export type Room = {
  __typename?: 'Room';
  currentPlayer?: Maybe<Player>;
  deck?: Maybe<Deck>;
  discardPile?: Maybe<Deck>;
  id: Scalars['ID']['output'];
  players?: Maybe<Array<Player>>;
  roomState?: Maybe<RoomState>;
};

export type RoomInput = {
  currentPlayer?: InputMaybe<PlayerInput>;
  deck?: InputMaybe<DeckInput>;
  discardPile?: InputMaybe<DeckInput>;
  id: Scalars['ID']['input'];
  players?: InputMaybe<Array<PlayerInput>>;
  roomState?: InputMaybe<RoomState>;
};

export enum RoomState {
  InProgress = 'IN_PROGRESS',
  Waiting = 'WAITING'
}

export type Subscription = {
  __typename?: 'Subscription';
  roomUpdated?: Maybe<Room>;
};


export type SubscriptionRoomUpdatedArgs = {
  roomId: Scalars['ID']['input'];
};

export type LoginPlayerMutationVariables = Exact<{
  username: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type LoginPlayerMutation = { __typename?: 'Mutation', loginPlayer: { __typename?: 'Player', id: string, username: string } };

export type RegisterPlayerMutationVariables = Exact<{
  username: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type RegisterPlayerMutation = { __typename?: 'Mutation', registerPlayer: { __typename?: 'Player', id: string, username: string } };

export type GetPlayerQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetPlayerQuery = { __typename?: 'Query', player?: { __typename?: 'Player', id: string, username: string } | null };

export type GetRoomsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetRoomsQuery = { __typename?: 'Query', rooms: Array<{ __typename?: 'Room', id: string, roomState?: RoomState | null, players?: Array<{ __typename?: 'Player', id: string, username: string }> | null, currentPlayer?: { __typename?: 'Player', id: string, username: string } | null }> };

export type CreateRoomMutationVariables = Exact<{
  playerId: Scalars['ID']['input'];
}>;


export type CreateRoomMutation = { __typename?: 'Mutation', createRoom: { __typename?: 'Room', id: string, players?: Array<{ __typename?: 'Player', id: string, username: string }> | null, currentPlayer?: { __typename?: 'Player', id: string, username: string } | null } };

export type JoinRoomMutationVariables = Exact<{
  roomId: Scalars['ID']['input'];
  playerId: Scalars['ID']['input'];
}>;


export type JoinRoomMutation = { __typename?: 'Mutation', joinRoom: { __typename?: 'Room', id: string, roomState?: RoomState | null, players?: Array<{ __typename?: 'Player', id: string, username: string, cards?: Array<{ __typename?: 'Card', id: string, type: CardType, color?: CardColor | null, number?: number | null }> | null }> | null, currentPlayer?: { __typename?: 'Player', id: string } | null, deck?: { __typename?: 'Deck', id: string, cards: Array<{ __typename?: 'Card', id: string, type: CardType, color?: CardColor | null, number?: number | null }> } | null, discardPile?: { __typename?: 'Deck', id: string, cards: Array<{ __typename?: 'Card', id: string, type: CardType, color?: CardColor | null, number?: number | null }> } | null } };

export type UpdateRoomMutationVariables = Exact<{
  room: RoomInput;
}>;


export type UpdateRoomMutation = { __typename?: 'Mutation', updateRoom: { __typename?: 'Room', id: string, roomState?: RoomState | null, players?: Array<{ __typename?: 'Player', id: string, username: string }> | null, currentPlayer?: { __typename?: 'Player', id: string, username: string } | null, deck?: { __typename?: 'Deck', cards: Array<{ __typename?: 'Card', id: string, type: CardType, color?: CardColor | null, number?: number | null }> } | null, discardPile?: { __typename?: 'Deck', cards: Array<{ __typename?: 'Card', id: string, type: CardType, color?: CardColor | null, number?: number | null }> } | null } };

export type RoomUpdatedSubscriptionVariables = Exact<{
  roomId: Scalars['ID']['input'];
}>;


export type RoomUpdatedSubscription = { __typename?: 'Subscription', roomUpdated?: { __typename?: 'Room', id: string, roomState?: RoomState | null, players?: Array<{ __typename?: 'Player', id: string, username: string, password: string, cards?: Array<{ __typename?: 'Card', id: string, type: CardType, color?: CardColor | null, number?: number | null }> | null }> | null, currentPlayer?: { __typename?: 'Player', id: string, username: string, password: string, cards?: Array<{ __typename?: 'Card', id: string, type: CardType, color?: CardColor | null, number?: number | null }> | null } | null, deck?: { __typename?: 'Deck', id: string, cards: Array<{ __typename?: 'Card', id: string, type: CardType, color?: CardColor | null, number?: number | null }> } | null, discardPile?: { __typename?: 'Deck', id: string, cards: Array<{ __typename?: 'Card', id: string, type: CardType, color?: CardColor | null, number?: number | null }> } | null } | null };

export type InitializeGameMutationVariables = Exact<{
  gameInput: InitialGameInput;
}>;


export type InitializeGameMutation = { __typename?: 'Mutation', initializeGame: { __typename?: 'Room', id: string, roomState?: RoomState | null, players?: Array<{ __typename?: 'Player', id: string, username: string, cards?: Array<{ __typename?: 'Card', id: string, type: CardType, color?: CardColor | null, number?: number | null }> | null }> | null, currentPlayer?: { __typename?: 'Player', id: string } | null, deck?: { __typename?: 'Deck', id: string, cards: Array<{ __typename?: 'Card', id: string, type: CardType, color?: CardColor | null, number?: number | null }> } | null, discardPile?: { __typename?: 'Deck', id: string, cards: Array<{ __typename?: 'Card', id: string, type: CardType, color?: CardColor | null, number?: number | null }> } | null } };


export const LoginPlayerDocument = gql`
    mutation LoginPlayer($username: String!, $password: String!) {
  loginPlayer(username: $username, password: $password) {
    id
    username
  }
}
    `;

/**
 * __useLoginPlayerMutation__
 *
 * To run a mutation, you first call `useLoginPlayerMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useLoginPlayerMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useLoginPlayerMutation({
 *   variables: {
 *     username: // value for 'username'
 *     password: // value for 'password'
 *   },
 * });
 */
export function useLoginPlayerMutation(options: VueApolloComposable.UseMutationOptions<LoginPlayerMutation, LoginPlayerMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<LoginPlayerMutation, LoginPlayerMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<LoginPlayerMutation, LoginPlayerMutationVariables>(LoginPlayerDocument, options);
}
export type LoginPlayerMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<LoginPlayerMutation, LoginPlayerMutationVariables>;
export const RegisterPlayerDocument = gql`
    mutation RegisterPlayer($username: String!, $password: String!) {
  registerPlayer(username: $username, password: $password) {
    id
    username
  }
}
    `;

/**
 * __useRegisterPlayerMutation__
 *
 * To run a mutation, you first call `useRegisterPlayerMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useRegisterPlayerMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useRegisterPlayerMutation({
 *   variables: {
 *     username: // value for 'username'
 *     password: // value for 'password'
 *   },
 * });
 */
export function useRegisterPlayerMutation(options: VueApolloComposable.UseMutationOptions<RegisterPlayerMutation, RegisterPlayerMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<RegisterPlayerMutation, RegisterPlayerMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<RegisterPlayerMutation, RegisterPlayerMutationVariables>(RegisterPlayerDocument, options);
}
export type RegisterPlayerMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<RegisterPlayerMutation, RegisterPlayerMutationVariables>;
export const GetPlayerDocument = gql`
    query GetPlayer($id: ID!) {
  player(id: $id) {
    id
    username
  }
}
    `;

/**
 * __useGetPlayerQuery__
 *
 * To run a query within a Vue component, call `useGetPlayerQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPlayerQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useGetPlayerQuery({
 *   id: // value for 'id'
 * });
 */
export function useGetPlayerQuery(variables: GetPlayerQueryVariables | VueCompositionApi.Ref<GetPlayerQueryVariables> | ReactiveFunction<GetPlayerQueryVariables>, options: VueApolloComposable.UseQueryOptions<GetPlayerQuery, GetPlayerQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetPlayerQuery, GetPlayerQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetPlayerQuery, GetPlayerQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<GetPlayerQuery, GetPlayerQueryVariables>(GetPlayerDocument, variables, options);
}
export function useGetPlayerLazyQuery(variables?: GetPlayerQueryVariables | VueCompositionApi.Ref<GetPlayerQueryVariables> | ReactiveFunction<GetPlayerQueryVariables>, options: VueApolloComposable.UseQueryOptions<GetPlayerQuery, GetPlayerQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetPlayerQuery, GetPlayerQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetPlayerQuery, GetPlayerQueryVariables>> = {}) {
  return VueApolloComposable.useLazyQuery<GetPlayerQuery, GetPlayerQueryVariables>(GetPlayerDocument, variables, options);
}
export type GetPlayerQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<GetPlayerQuery, GetPlayerQueryVariables>;
export const GetRoomsDocument = gql`
    query GetRooms {
  rooms {
    id
    roomState
    players {
      id
      username
    }
    currentPlayer {
      id
      username
    }
  }
}
    `;

/**
 * __useGetRoomsQuery__
 *
 * To run a query within a Vue component, call `useGetRoomsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRoomsQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useGetRoomsQuery();
 */
export function useGetRoomsQuery(options: VueApolloComposable.UseQueryOptions<GetRoomsQuery, GetRoomsQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetRoomsQuery, GetRoomsQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetRoomsQuery, GetRoomsQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<GetRoomsQuery, GetRoomsQueryVariables>(GetRoomsDocument, {}, options);
}
export function useGetRoomsLazyQuery(options: VueApolloComposable.UseQueryOptions<GetRoomsQuery, GetRoomsQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetRoomsQuery, GetRoomsQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetRoomsQuery, GetRoomsQueryVariables>> = {}) {
  return VueApolloComposable.useLazyQuery<GetRoomsQuery, GetRoomsQueryVariables>(GetRoomsDocument, {}, options);
}
export type GetRoomsQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<GetRoomsQuery, GetRoomsQueryVariables>;
export const CreateRoomDocument = gql`
    mutation CreateRoom($playerId: ID!) {
  createRoom(hostId: $playerId) {
    id
    players {
      id
      username
    }
    currentPlayer {
      id
      username
    }
  }
}
    `;

/**
 * __useCreateRoomMutation__
 *
 * To run a mutation, you first call `useCreateRoomMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useCreateRoomMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useCreateRoomMutation({
 *   variables: {
 *     playerId: // value for 'playerId'
 *   },
 * });
 */
export function useCreateRoomMutation(options: VueApolloComposable.UseMutationOptions<CreateRoomMutation, CreateRoomMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<CreateRoomMutation, CreateRoomMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<CreateRoomMutation, CreateRoomMutationVariables>(CreateRoomDocument, options);
}
export type CreateRoomMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<CreateRoomMutation, CreateRoomMutationVariables>;
export const JoinRoomDocument = gql`
    mutation JoinRoom($roomId: ID!, $playerId: ID!) {
  joinRoom(roomId: $roomId, playerId: $playerId) {
    id
    players {
      id
      username
      cards {
        id
        type
        color
        number
      }
    }
    currentPlayer {
      id
    }
    roomState
    deck {
      id
      cards {
        id
        type
        color
        number
      }
    }
    discardPile {
      id
      cards {
        id
        type
        color
        number
      }
    }
  }
}
    `;

/**
 * __useJoinRoomMutation__
 *
 * To run a mutation, you first call `useJoinRoomMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useJoinRoomMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useJoinRoomMutation({
 *   variables: {
 *     roomId: // value for 'roomId'
 *     playerId: // value for 'playerId'
 *   },
 * });
 */
export function useJoinRoomMutation(options: VueApolloComposable.UseMutationOptions<JoinRoomMutation, JoinRoomMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<JoinRoomMutation, JoinRoomMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<JoinRoomMutation, JoinRoomMutationVariables>(JoinRoomDocument, options);
}
export type JoinRoomMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<JoinRoomMutation, JoinRoomMutationVariables>;
export const UpdateRoomDocument = gql`
    mutation UpdateRoom($room: RoomInput!) {
  updateRoom(room: $room) {
    id
    roomState
    players {
      id
      username
    }
    currentPlayer {
      id
      username
    }
    deck {
      cards {
        id
        type
        color
        number
      }
    }
    discardPile {
      cards {
        id
        type
        color
        number
      }
    }
  }
}
    `;

/**
 * __useUpdateRoomMutation__
 *
 * To run a mutation, you first call `useUpdateRoomMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useUpdateRoomMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useUpdateRoomMutation({
 *   variables: {
 *     room: // value for 'room'
 *   },
 * });
 */
export function useUpdateRoomMutation(options: VueApolloComposable.UseMutationOptions<UpdateRoomMutation, UpdateRoomMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<UpdateRoomMutation, UpdateRoomMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<UpdateRoomMutation, UpdateRoomMutationVariables>(UpdateRoomDocument, options);
}
export type UpdateRoomMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<UpdateRoomMutation, UpdateRoomMutationVariables>;
export const RoomUpdatedDocument = gql`
    subscription RoomUpdated($roomId: ID!) {
  roomUpdated(roomId: $roomId) {
    id
    roomState
    players {
      id
      username
      password
      cards {
        id
        type
        color
        number
      }
    }
    currentPlayer {
      id
      username
      password
      cards {
        id
        type
        color
        number
      }
    }
    deck {
      id
      cards {
        id
        type
        color
        number
      }
    }
    discardPile {
      id
      cards {
        id
        type
        color
        number
      }
    }
  }
}
    `;

/**
 * __useRoomUpdatedSubscription__
 *
 * To run a query within a Vue component, call `useRoomUpdatedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useRoomUpdatedSubscription` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the subscription
 * @param options that will be passed into the subscription, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/subscription.html#options;
 *
 * @example
 * const { result, loading, error } = useRoomUpdatedSubscription({
 *   roomId: // value for 'roomId'
 * });
 */
export function useRoomUpdatedSubscription(variables: RoomUpdatedSubscriptionVariables | VueCompositionApi.Ref<RoomUpdatedSubscriptionVariables> | ReactiveFunction<RoomUpdatedSubscriptionVariables>, options: VueApolloComposable.UseSubscriptionOptions<RoomUpdatedSubscription, RoomUpdatedSubscriptionVariables> | VueCompositionApi.Ref<VueApolloComposable.UseSubscriptionOptions<RoomUpdatedSubscription, RoomUpdatedSubscriptionVariables>> | ReactiveFunction<VueApolloComposable.UseSubscriptionOptions<RoomUpdatedSubscription, RoomUpdatedSubscriptionVariables>> = {}) {
  return VueApolloComposable.useSubscription<RoomUpdatedSubscription, RoomUpdatedSubscriptionVariables>(RoomUpdatedDocument, variables, options);
}
export type RoomUpdatedSubscriptionCompositionFunctionResult = VueApolloComposable.UseSubscriptionReturn<RoomUpdatedSubscription, RoomUpdatedSubscriptionVariables>;
export const InitializeGameDocument = gql`
    mutation InitializeGame($gameInput: InitialGameInput!) {
  initializeGame(gameInput: $gameInput) {
    id
    roomState
    players {
      id
      username
      cards {
        id
        type
        color
        number
      }
    }
    currentPlayer {
      id
    }
    deck {
      id
      cards {
        id
        type
        color
        number
      }
    }
    discardPile {
      id
      cards {
        id
        type
        color
        number
      }
    }
  }
}
    `;

/**
 * __useInitializeGameMutation__
 *
 * To run a mutation, you first call `useInitializeGameMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useInitializeGameMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useInitializeGameMutation({
 *   variables: {
 *     gameInput: // value for 'gameInput'
 *   },
 * });
 */
export function useInitializeGameMutation(options: VueApolloComposable.UseMutationOptions<InitializeGameMutation, InitializeGameMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<InitializeGameMutation, InitializeGameMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<InitializeGameMutation, InitializeGameMutationVariables>(InitializeGameDocument, options);
}
export type InitializeGameMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<InitializeGameMutation, InitializeGameMutationVariables>;