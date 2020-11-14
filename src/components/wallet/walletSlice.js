/* eslint-disable no-param-reassign */
import Service from '../js/service';
import { selectAllNetworks } from './networkSlice';

const {
  createEntityAdapter, createSlice, createAsyncThunk, createSelector,
} = require('@reduxjs/toolkit');

const walletAdapter = createEntityAdapter();

const initialState = walletAdapter.getInitialState({
  account: null,
  error: null,
  isApproved: null,
  isOwner: false,
  network: null,
  supportedNetworks: ['0x539'],
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
    updateOwnerApproved: {
      reducer(state, action) {
        const { isOwner, isApproved, } = action.payload;
        state.isOwner = isOwner;
        state.isApproved = isApproved;
      },
      prepare(isOwner, isApproved) {
        return {
          payload: { isOwner, isApproved, },
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

/*
 * Actions
*/
export const {
  updateAccountNetwork,
  updateOwnerApproved,
  walletError,
} = walletSlice.actions;

/*
 * Selectors
*/
export const selectOnSupportedNetwork = createSelector(
  (state) => state.wallet,
  (wallet) => {
    const isSupported = Boolean(wallet.network)
      && wallet.supportedNetworks.some(
        (chainId) => chainId === wallet.network.id
      );
    // console.log('selectOnSupportedNetwork::', isSupported, 'wallet:', wallet);
    return isSupported;
  }
);

export const selectSupportedNetworks = createSelector(
  [selectAllNetworks, (state) => state.wallet.supportedNetworks],
  (networks, supported) => networks.filter(
    (network) => supported.find((s) => s === network.id)
  )
);

export default walletSlice.reducer;
