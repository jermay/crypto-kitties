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
  isConnected: false,
  isKittyCreator: false,
  isOwner: false,
  network: null,
  supportedNetworks: ['0x3', '0x539'],
  web3ProviderAvailable: null,
});

export const fetchWeb3ProviderIsAvailable = createAsyncThunk(
  'wallet/fetchWeb3ProviderIsAvailable',
  () => Service.web3ProviderAvailable()
);

export const approveMarket = createAsyncThunk(
  'wallet/approveMarket',
  () => Service.market.approve()
);

export const connectWallet = createAsyncThunk(
  'wallet/connect',
  () => Service.wallet.connect()
);

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    updateAccountNetwork: {
      reducer(state, action) {
        const {
          account, network, isOwner, isApproved, isKittyCreator,
        } = action.payload;

        if (account) {
          state.account = account.toLowerCase();
        }
        if (network && network.id) {
          state.network = network;
        }

        state.isOwner = isOwner || false;
        state.isApproved = isApproved || false;
        state.isKittyCreator = isKittyCreator || false;
      },
      prepare(account, network, isOwner, isApproved, isKittyCreator) {
        return {
          payload: {
            account,
            network,
            isOwner,
            isApproved,
            isKittyCreator,
          },
        };
      },
    },
    updateOwnerApproved: {
      reducer(state, action) {
        const { isOwner, isApproved, isKittyCreator, } = action.payload;
        state.isOwner = isOwner;
        state.isApproved = isApproved;
        state.isKittyCreator = isKittyCreator;
      },
      prepare(isOwner, isApproved, isKittyCreator) {
        return {
          payload: { isOwner, isApproved, isKittyCreator, },
        };
      },
    },
    updateIsKittyCreator: (state, action) => {
      state.isKittyCreator = action.payload;
    },
    walletDisconnected: (state) => {
      state.isConnected = false;
      state.account = null;
      state.isOwner = false;
      state.isApproved = null;
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

    [connectWallet.fulfilled]: (state, action) => {
      state.isConnected = true;
      state.account = action.payload;
    },

    [fetchWeb3ProviderIsAvailable.fulfilled]: (state, action) => {
      state.web3ProviderAvailable = action.payload;
    },
    [fetchWeb3ProviderIsAvailable.rejected]: (state) => {
      state.web3ProviderAvailable = false;
    },

  },
});

/*
 * Actions
*/
export const {
  updateAccountNetwork,
  updateIsKittyCreator,
  updateOwnerApproved,
  walletDisconnected,
  walletError,
} = walletSlice.actions;

/*
 * Selectors
*/
export const selectIsApproved = (state) => state.wallet.isApproved;
export const selectIsWalletConnected = (state) => state.wallet.isConnected;
export const selectIsWeb3ProviderAvailable = (state) => state.wallet.web3ProviderAvailable;

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

export const selectUser = (state) => state.wallet.account;

export default walletSlice.reducer;
