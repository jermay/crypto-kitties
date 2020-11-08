import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { RequestStatus } from '../js/utils';

const transStatusAdapter = createEntityAdapter();

const transStatusSlice = createSlice({
  name: 'transStatus',
  initialState: transStatusAdapter.getInitialState(),
  reducers: {
    newTransaction: {
      reducer: transStatusAdapter.addOne,
      prepare: (id, message) => ({
        payload: {
          id,
          status: RequestStatus.loading,
          message,
        },
      }),
    },
    updateTransStatus: {
      reducer: transStatusAdapter.updateOne,
      prepare: (id, message, status) => ({
        payload: {
          id,
          changes: { message, status, },
        },
      }),
    },
    dismissTransStatus: transStatusAdapter.removeOne,
  },
});

export default transStatusSlice.reducer;

export const {
  dismissTransStatus,
  newTransaction,
  updateTransStatus,
} = transStatusSlice.actions;

export const {
  selectAll: selectAllTransStatus,
} = transStatusAdapter.getSelectors((state) => state.transStatus);
