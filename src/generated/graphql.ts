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
  UUID: { input: any; output: any; }
};

export type Card = {
  __typename?: 'Card';
  color?: Maybe<CardColor>;
  deck?: Maybe<Deck>;
  id: Scalars['UUID']['output'];
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
  id: Scalars['UUID']['input'];
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
  id: Scalars['UUID']['output'];
};

export type DeckInput = {
  cards: Array<CardInput>;
  id: Scalars['UUID']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createRoom: Room;
  deleteRoom?: Maybe<Scalars['Boolean']['output']>;
  joinRoom: Room;
  loginPlayer?: Maybe<Scalars['String']['output']>;
  registerPlayer: Player;
  updateRoom: Room;
};


export type MutationCreateRoomArgs = {
  hostId: Scalars['UUID']['input'];
};


export type MutationDeleteRoomArgs = {
  id: Scalars['UUID']['input'];
};


export type MutationJoinRoomArgs = {
  playerId: Scalars['UUID']['input'];
  roomId: Scalars['UUID']['input'];
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
  id: Scalars['UUID']['output'];
  password: Scalars['String']['output'];
  username: Scalars['String']['output'];
};

export type PlayerInput = {
  cards?: InputMaybe<Array<CardInput>>;
  id: Scalars['UUID']['input'];
};

export type Query = {
  __typename?: 'Query';
  player?: Maybe<Player>;
  players: Array<Player>;
  room?: Maybe<Room>;
  rooms: Array<Room>;
};


export type QueryPlayerArgs = {
  id: Scalars['UUID']['input'];
};


export type QueryRoomArgs = {
  id: Scalars['UUID']['input'];
};

export type Room = {
  __typename?: 'Room';
  currentPlayer?: Maybe<Player>;
  deck?: Maybe<Deck>;
  discardPile?: Maybe<Deck>;
  id: Scalars['UUID']['output'];
  players?: Maybe<Array<Player>>;
  roomState?: Maybe<RoomState>;
};

export type RoomInput = {
  currentPlayer?: InputMaybe<PlayerInput>;
  deck?: InputMaybe<DeckInput>;
  discardPile?: InputMaybe<DeckInput>;
  id: Scalars['UUID']['input'];
  players?: InputMaybe<Array<PlayerInput>>;
  roomState?: InputMaybe<RoomState>;
};

export enum RoomState {
  InProgress = 'IN_PROGRESS',
  Waiting = 'WAITING'
}

export type Subscription = {
  __typename?: 'Subscription';
  roomUpdated: Room;
};


export type SubscriptionRoomUpdatedArgs = {
  roomId: Scalars['UUID']['input'];
};

export type LoginPlayerMutationVariables = Exact<{
  username: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type LoginPlayerMutation = { __typename?: 'Mutation', loginPlayer?: string | null };

export type RegisterPlayerMutationVariables = Exact<{
  username: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type RegisterPlayerMutation = { __typename?: 'Mutation', registerPlayer: { __typename?: 'Player', id: any, username: string } };

export type GetPlayerQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetPlayerQuery = { __typename?: 'Query', player?: { __typename?: 'Player', id: any, username: string } | null };

export type JoinRoomMutationVariables = Exact<{
  roomId: Scalars['UUID']['input'];
  playerId: Scalars['UUID']['input'];
}>;


export type JoinRoomMutation = { __typename?: 'Mutation', joinRoom: { __typename?: 'Room', id: any } };

export type GetRoomsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetRoomsQuery = { __typename?: 'Query', rooms: Array<{ __typename?: 'Room', id: any, roomState?: RoomState | null, players?: Array<{ __typename?: 'Player', id: any, username: string }> | null, currentPlayer?: { __typename?: 'Player', id: any, username: string } | null }> };

export type RoomUpdatedSubscriptionVariables = Exact<{
  roomId: Scalars['UUID']['input'];
}>;


export type RoomUpdatedSubscription = { __typename?: 'Subscription', roomUpdated: { __typename?: 'Room', id: any, roomState?: RoomState | null, players?: Array<{ __typename?: 'Player', id: any, username: string }> | null, currentPlayer?: { __typename?: 'Player', id: any, username: string } | null, deck?: { __typename?: 'Deck', cards: Array<{ __typename?: 'Card', id: any, type: CardType, color?: CardColor | null, number?: number | null }> } | null, discardPile?: { __typename?: 'Deck', cards: Array<{ __typename?: 'Card', id: any, type: CardType, color?: CardColor | null, number?: number | null }> } | null } };


export const LoginPlayerDocument = gql`
    mutation LoginPlayer($username: String!, $password: String!) {
  loginPlayer(username: $username, password: $password)
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
    query GetPlayer($id: UUID!) {
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
export const JoinRoomDocument = gql`
    mutation JoinRoom($roomId: UUID!, $playerId: UUID!) {
  joinRoom(roomId: $roomId, playerId: $playerId) {
    id
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
export const RoomUpdatedDocument = gql`
    subscription RoomUpdated($roomId: UUID!) {
  roomUpdated(roomId: $roomId) {
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