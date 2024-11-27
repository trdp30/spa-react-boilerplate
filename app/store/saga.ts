import { fork } from '@redux-saga/core/effects';

import { appRootSaga } from '@containers/App/saga';
import authRootSaga from '@containers/Auth/saga';

export default function* rootSaga() {
  yield fork(authRootSaga);
  yield fork(appRootSaga);
}
