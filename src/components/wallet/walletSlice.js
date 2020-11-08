/* eslint-disable no-param-reassign */
import Service from '../js/service';

const { createEntityAdapter, createSlice, createAsyncThunk, } = require('@reduxjs/toolkit');

const walletAdapter = createEntityAdapter();

const initialState = walletAdapter.getInitialState({
  account: null,
  error: null,
  isApproved: null,
  isOwner: false,
  network: null,
});


export const approveMarket = createAsyncThunk(
  'wallet/approveMarket',
  () => Service.market.approve()
);

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    updateAccountNetwork: {
      reducer(state, action) {
        const {
          account, network, isOwner, isApproved,
        } = action.payload;

        if (account) {
          state.account = account.toLowerCase();
        }
        if (network && network.id) {
          state.network = network;
        }

        state.isOwner = isOwner || false;
        state.isApproved = isApproved || false;

        // console.log('walletSlice::updateAccount ', action.payload);
      },
      prepare(account, network, isOwner, isApproved) {
        return {
          payload: {
            account,
            network,
            isOwner,
            isApproved,
          },
        };
      },
    },
    walletError: (state, action) => {
      state.error = action.payload;
      console.error('wallet error: ', action.payload);
    },
  },
  extraReducers: {
    [approveMarket.fulfilled]: (state) => {
      state.isApproved = true;
    },
  },
});

export const {
  updateAccountNetwork,
  walletError,
} = walletSlice.actions;

export default walletSlice.reducer;
