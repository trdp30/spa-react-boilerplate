import { gql, TypedDocumentNode } from '@apollo/client';
import { DocumentNode } from 'graphql/language';

export const processQuery = (
  queryString: string | DocumentNode | TypedDocumentNode<never, { payload?: undefined } | { payload: object }>
): DocumentNode | TypedDocumentNode<never, { payload?: undefined } | { payload: object }> => {
  try {
    if (typeof queryString !== 'string') {
      return queryString;
    }
    return gql`
      ${queryString}
    `;
  } catch (error) {
    throw Error(`${error}:Invalid Query`);
  }
};
