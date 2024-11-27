import fetchData from '@utils/fetchData';
import { call, fork, takeEvery, take, delay, cancel } from '@redux-saga/core/effects';
import { catchError } from '@utils/sentry';
import {
  FetchFileUrl,
  fetchFileUrl,
  FetchFileUrlResponse,
  triggerHeardBeat,
  stopHeartBeat,
  HeartBeat,
} from '@containers/App/types';
import { FETCH_FILE_URL, HEART_BEAT } from '@containers/App/queries';
import type { PayloadAction } from '@reduxjs/toolkit';
import { SagaCallback } from '@store/types';
import { Task } from 'redux-saga';

export function* fetchFileUrlSaga({
  payload: { data, callback },
}: PayloadAction<{
  data: FetchFileUrl;
  callback: SagaCallback;
}>): Generator {
  const queryVariables = {
    id: Number(data.id),
  };
  try {
    const response = (yield call(fetchData, {
      queryString: FETCH_FILE_URL,
      queryVariables,
    })) as FetchFileUrlResponse;

    const data = response?.file_download_file;

    if (data && data?.resource_url && callback?.onSuccess) {
      yield call(callback?.onSuccess, data);
    }
  } catch (error) {
    yield call(catchError, {
      title: 'fetchFileUrlSaga',
      extraScope: { key: 'file_id', value: String(data.id) }, // Example usage of extraScope
      error: error as Error,
    });
    if (callback && callback?.onError) {
      yield call(callback?.onError, error as Error);
    }
  }
}

let secondsElapsed: number = 0;
let timer: NodeJS.Timeout | null = null;
const startSecondsElapseTimer = (start = false) => {
  if (start && !timer) {
    timer = setInterval(() => {
      secondsElapsed = secondsElapsed + 1;
    }, 1000);
  } else if (!start) {
    secondsElapsed = 0;
    if (timer) {
      clearInterval(timer);
    }
    timer = null;
  }
};

export const makeHeartBeatApiCall = async (payload: HeartBeat) => {
  try {
    await fetchData({
      queryString: HEART_BEAT,
      queryVariables: { ...payload, seconds_elapsed: secondsElapsed },
      forceRefresh: true,
    });
    startSecondsElapseTimer(false);
  } catch (error) {
    startSecondsElapseTimer(true);
    catchError({
      title: 'makeHeartBeatApiCall',
      error: error as Error,
      skipToast: true,
      extraScope: { key: 'payload', value: JSON.stringify(payload) },
    });
    return Promise.resolve();
  }
};

export function* heartBeatWorker({ payload }: { payload: HeartBeat }) {
  try {
    while (true) {
      yield call(makeHeartBeatApiCall, payload);
      yield delay(10000);
    }
  } catch (error) {
    yield call(catchError, {
      title: 'heartBeatWorker',
      error: error as Error,
      skipToast: true,
      extraScope: { key: 'payload', value: JSON.stringify(payload) },
    });
    yield delay(2000);
  }
}

export function* heartBeatWatcher() {
  while (true) {
    const { payload } = yield take(triggerHeardBeat);
    const task = (yield fork(heartBeatWorker, { payload })) as Task;
    const stopAction = (yield take(stopHeartBeat)) as PayloadAction;
    if (stopAction) {
      yield cancel(task);
    }
  }
}

export function* fetchFileUrlWatcher() {
  yield takeEvery(fetchFileUrl, fetchFileUrlSaga);
}

export function* appRootSaga() {
  yield fork(fetchFileUrlWatcher);
  yield fork(heartBeatWatcher);
}
