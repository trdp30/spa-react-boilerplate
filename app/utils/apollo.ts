import { ApolloClient, InMemoryCache, HttpLink, ApolloLink, from, split } from '@apollo/client';
import { appName, AUTH_STORAGE_KEY, localStorageGetItem } from '@utils/localStorageHelpers';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { RetryLink } from '@apollo/client/link/retry';
import { getMainDefinition } from '@apollo/client/utilities';
import { onError } from '@apollo/client/link/error';
import { catchError } from '@utils/sentry';

const retryLink = new RetryLink({
  delay: {
    initial: 2000,
    max: Infinity,
    jitter: true,
  },
  attempts: {
    max: 2,
    retryIf: (error) => !!error && process.env.NODE_ENV !== 'test',
  },
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: process.env.HASURA_WS + '/v1/graphql',
  })
);

const httpLink = new HttpLink({ uri: process.env.HASURA_HTTP + '/v1/graphql' });

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
  },
  wsLink,
  httpLink
);

const authLink = new ApolloLink((operation, forward) => {
  const context = operation.getContext();
  const tokens = localStorageGetItem(AUTH_STORAGE_KEY);
  const parseToken = tokens ? JSON.parse(tokens) : {};

  if (parseToken?.accessToken && !context.skipAuthorization) {
    operation.setContext(({ headers = {} }) => ({
      headers: {
        ...headers,
        Authorization: `Bearer ${parseToken?.accessToken}`,
        'x-hasura-role': 'CANDIDATE',
      },
    }));
  }

  return forward(operation);
});

const errorLink = onError(({ operation, graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, extensions }) =>
      catchError({
        title: 'GraphQL error',
        error: Error(
          `Message: ${message}, extensions: ${JSON.stringify(extensions)}, operationName: ${operation.operationName}, variables: ${JSON.stringify(operation.variables)}`
        ),
        skipToast: true,
      })
    );
  if (networkError) catchError({ title: 'Network error', error: networkError as Error, skipToast: true });
});

const cache = new InMemoryCache();

const client = new ApolloClient({
  link: from([errorLink, retryLink, authLink, splitLink]),
  cache,
  name: appName,
  version: process.env.VERSION || 'local',
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
});

export const removeClient = async () => {
  await client.resetStore();
  await client.clearStore();
  return client.stop();
};

export default client;
