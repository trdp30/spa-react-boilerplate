import { configureStore } from '@reduxjs/toolkit';
import rootSaga from '@store/saga';
import createSagaMiddleware from 'redux-saga';
import rootReducer from './reducers';
// import * as Sentry from '@sentry/react';

const sagaMiddleware = createSagaMiddleware();
// const sentryReduxEnhancer = Sentry.createReduxEnhancer();

export function configureAppStore(preloadedState: object) {
  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActionPaths: [],
        },
      }).concat(sagaMiddleware),

    preloadedState,
    // enhancers: (getDefaultEnhancers) => {
    //   return getDefaultEnhancers().concat(sentryReduxEnhancer);
    // },
    devTools: process.env.NODE_ENV !== 'production',
  });

  if (process.env.NODE_ENV !== 'production' && module?.hot) {
    module?.hot.accept('./reducers', () => store.replaceReducer(rootReducer));
  }

  sagaMiddleware.run(rootSaga);
  return store;
}

export const store = configureAppStore({});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
