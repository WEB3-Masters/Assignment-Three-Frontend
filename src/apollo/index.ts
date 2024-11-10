import { ApolloClient, InMemoryCache, split, createHttpLink } from '@apollo/client/core'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { createClient } from 'graphql-ws'
import { getMainDefinition } from '@apollo/client/utilities'

// HTTP connection to the API
const httpLink = createHttpLink({
  uri: 'http://localhost:3000/graphql',
})

// WebSocket connection to the API
const wsLink = new GraphQLWsLink(
  createClient({
    url: 'ws://localhost:3000/graphql',
  })
)

// Split links based on operation type
const link = split(
  // Split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    )
  },
  wsLink,
  httpLink
)

// Create the apollo client
export const apolloClient = new ApolloClient({
  link,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'no-cache',
    },
  },
}) 