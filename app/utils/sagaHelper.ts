import { OnSuccess, OnSuccessResponse, SagaCallback } from '@store/types';
import { catchError } from '@utils/sentry';
import { call } from 'redux-saga/effects';
import { runSaga, Saga } from 'redux-saga';
import { PayloadAction } from '@reduxjs/toolkit';
import { triggerToast } from '@components/base/Notification';

type SuccessResponse = OnSuccess | OnSuccessResponse;

export function* handleSagaSuccess({
  callback,
  response,
}: {
  callback?: SagaCallback['onSuccess'];
  response?: SuccessResponse;
}) {
  try {
    if (callback) {
      yield call(callback, response ?? {});
    }
  } catch (error) {
    triggerToast({
      message: {
        title: `Error in handling saga success response`,
        summary: (error as Error).message || `Unknown error occurred: ${error}`,
      },
      variant: 'danger',
    });
  }
}

export function* handleSagaError({
  callback,
  error,
  title = 'Saga Title Error',
  skipToast = false,
}: {
  callback?: SagaCallback['onError'];
  error: Error;
  title?: string;
  skipToast?: boolean;
}) {
  try {
    if (callback) {
      yield call(callback, error);
    }
    yield call(catchError, { title, error, skipToast });
  } catch (nestedError) {
    triggerToast({
      message: {
        title: `Error in handling saga error`,
        summary:
          (nestedError as Error).message || `Unknown error occurred while processing error handling: ${nestedError}`,
      },
      variant: 'danger',
    });
  }
}

/**
 * Executes a given Redux saga and captures dispatched actions for testing purposes.
 *
 * This utility function helps test sagas by allowing you to simulate actions and state,
 * then record the actions dispatched by the saga.
 *
 * @template T - The type of the action payload.
 * @param {Saga} saga - The saga function to be tested.
 * @param {PayloadAction<T>} initialAction - The initial action to dispatch to the saga.
 * @param {MockResponse} [mockResponse] - Optional mock response to simulate state or API data.
 *   Accepts either an object or an array to provide flexibility in testing different states.
 *
 * @returns {Promise<DispatchedAction[]>} - A promise that resolves to an array of dispatched actions,
 *   enabling assertions on saga behavior and side effects.
 *
 * @example
 * const dispatchedActions = await testSagaExecution(mySaga, { type: 'ACTION_TYPE', payload: { id: 1 } });
 *
 * // Assertions
 * expect(dispatchedActions).toContainEqual({ type: 'EXPECTED_ACTION', payload: { id: 1, status: 'completed' } });
 */

type ActionPayload = Record<string, unknown>;
type DispatchedAction = {
  type: string;
  payload?: unknown;
};

type MockResponse = Record<string, unknown> | unknown[];

const testSagaExecution = async <T extends ActionPayload>(
  saga: Saga,
  initialAction: PayloadAction<T>,
  mockResponse?: MockResponse
): Promise<DispatchedAction[]> => {
  const dispatched: DispatchedAction[] = [];

  await runSaga(
    {
      dispatch: (action: DispatchedAction) => dispatched.push(action),
      getState: () => mockResponse || {},
    },
    saga,
    initialAction
  ).toPromise();

  return dispatched;
};

export default testSagaExecution;
