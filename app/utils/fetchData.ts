import client from '@utils/apollo';
import { DocumentNode } from 'graphql/language';
import { TypedDocumentNode } from '@apollo/client';
import { processQuery } from '@utils/processQuery';

export const makeRequest: ({
  variables,
  queryString,
  key,
  forceRefresh,
  context,
}: {
  variables: object;
  queryString: DocumentNode | TypedDocumentNode<never, { payload?: undefined } | { payload: object }>;
  key?: string;
  forceRefresh?: boolean;
  context?: object;
}) => Promise<object> = async ({ variables, queryString, key, forceRefresh = false, context = {} }) => {
  const { data } = await client.query({
    query: queryString,
    variables,
    fetchPolicy: forceRefresh ? 'network-only' : 'cache-first',
    context: {
      ...context,
    },
  });
  return key ? data[key] : data;
};

const fetchData: ({
  queryString,
  queryKey,
  queryVariables,
  forceRefresh,
  context,
}: {
  queryString: DocumentNode | TypedDocumentNode<never, { payload?: undefined } | { payload: object }>;
  queryKey?: string;
  queryVariables: object;
  forceRefresh?: boolean;
  context?: object;
}) => Promise<object> = async ({ queryString, queryKey, queryVariables = {}, forceRefresh, context }) => {
  if (!queryString) {
    return [];
  }
  const graphQuery = processQuery(queryString);

  return makeRequest({
    variables: {
      ...queryVariables,
    },
    key: queryKey,
    queryString: graphQuery,
    forceRefresh,
    context,
  });
};

export default fetchData;
