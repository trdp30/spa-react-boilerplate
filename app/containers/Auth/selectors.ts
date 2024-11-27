import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@store/index';
import { authSlice } from '@containers/Auth/slice';

export const selectAuth = createSelector(
  (state: RootState) => state,
  (state) => state[authSlice.name]
);

export const selectUser = createSelector(selectAuth, (state) => state.user);

export const selectQueryParams = createSelector(selectAuth, (state) => state.queryParams);

export const selectIdToken = createSelector(selectAuth, (state) => state.idToken);

export const selectHashToken = createSelector(selectAuth, (state) => state.hash_token);

export const selectCustomToken = createSelector(selectAuth, (state) => state.customToken);

export const selectCurrentUser = createSelector(selectAuth, (state) => state.currentUser);

export const selectCandidateDetails = createSelector(selectAuth, (state) => state.candidateDetails);
