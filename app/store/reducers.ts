import { authSlice } from '@containers/Auth/slice';
import { combineSlices } from '@reduxjs/toolkit';

export default combineSlices({
  [authSlice.name]: authSlice.reducer,
});
