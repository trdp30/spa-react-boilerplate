import { processQuery } from '@utils/processQuery';
import client from '@utils/apollo';
import { DocumentNode } from 'graphql/language';
import { TypedDocumentNode } from '@apollo/client';

export const makeRequest: ({
  payload,
  queryString,
  context,
  spreadPayload,
}: {
  payload: object;
  queryString: DocumentNode | TypedDocumentNode<never, { payload?: undefined } | { payload: object }>;
  context?: object;
  spreadPayload?: boolean;
}) => Promise<object> = async ({ payload, queryString, context = {}, spreadPayload }) => {
  return client.mutate({
    mutation: queryString,
    variables: spreadPayload ? { ...payload } : { payload },
    context: {
      ...context,
    },
  });
};

const postData: ({
  queryString,
  payload,
  spreadPayload,
  context,
}: {
  queryString: DocumentNode | TypedDocumentNode<never, { payload?: undefined } | { payload: object }> | string;
  payload: object;
  spreadPayload?: boolean;
  context?: object;
}) => Promise<object> = async ({ queryString, payload, spreadPayload, context }) => {
  if (!queryString) {
    throw Error('queryString not provided');
  }
  const graphQuery = processQuery(queryString);

  return makeRequest({
    payload,
    queryString: graphQuery,
    spreadPayload,
    context,
  });
};

export default postData;
