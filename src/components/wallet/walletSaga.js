import { createAction } from '@reduxjs/toolkit';
import { eventChannel } from 'redux-saga';
import {
  take, call, put, all, select
} from 'redux-saga/effects';

import Service from '../js/service';
import { clearKitties, fetchKittiesForIds, getKitties } from '../cat/catSlice';
import { clearOffers, getOffers } from '../market/offerSlice';
import {
  selectOnSupportedNetwork, updateAccountNetwork, updateOwnerApproved, walletError
} from './walletSlice';
import WalletService from '../js/walletService';


export const connect = createAction('wallet/connect');
export const connectSuccess = createAction('wallet/connect/success');
export const contractInitSuccess = createAction('wallet/contractInit/success');
export const contractInitError = createAction('wallet/contractInit/error');

/**
 * Calls Service to initialize the contract instances
 * for the given network. Dispatches a 'wallet/contractInit/error' action
 * if chainId is not a supported network
 * @param {string} chainId the network chain ID (i.e. '0x3' for Ropsten)
 */
function* initContracts(chainId) {
  try {
    yield call(Service.initContracts, chainId);
  } catch (err) {
    console.error(err);
    yield put(contractInitError(err.message));
  }
}

/**
 * Fetches all the kitties from the active sell Offers
 */
function* getKittesFromOffers() {
  const result = yield take(getOffers.fulfilled);

  const kittyIds = Object.values(result.payload)
    .map((offer) => offer.tokenId);

  yield put(fetchKittiesForIds(kittyIds));
}

/**
 * Refreshes the application state
 * Called when the connected account or network changes
 */
function* onAccountOrNetworkChange() {
  // refresh application data
  yield all([
    put(getKitties()),
    put(getOffers()),
    call(getKittesFromOffers)
  ]);

  // get updated user state
  return yield all({
    isOwner: call(Service.kitty.isUserOwner),
    isApproved: call(Service.market.isApproved),
  });
}

/**
 * Refreshes the contract instances.
 * Called when the connected network changes.
 * @param {string} chainId network chain ID (i.e. '0x3' for Ropsten)
 */
function* onNetworkChange(chainId) {
  const isSupportedNetwork = yield select(selectOnSupportedNetwork);
  // console.log('onNetworkChange:: isSupportedNetwork', isSupportedNetwork);

  if (isSupportedNetwork) {
    // refresh contracts
    yield call(initContracts, chainId);

    // refresh application state
    const { isOwner, isApproved, } = yield call(onAccountOrNetworkChange);
    yield put(updateOwnerApproved(isOwner, isApproved));
  } else {
    // unsupported network: reset application state
    yield all([
      put(contractInitError('Unsupported network')),
      put(clearKitties()),
      put(clearOffers()),
    ]);
  }
}

/**
 * Calls Service to connect the app to the user's wallet.
 * Dispatches 'wallet/connectSuccss' on success then
 * intitializes the application state.
 */
function* connectWallet() {
  while (true) {
    try {
      yield take(connect);

      // update connected account and network
      const account = yield call(Service.wallet.connect);
      yield put(connectSuccess());

      const network = yield call(Service.wallet.getNetwork);
      yield put(updateAccountNetwork(account, network));

      // init application state
      yield call(onNetworkChange, network.id);
    } catch (err) {
      yield put(walletError(err));
    }
  }
}

/**
 * Creates ReduxSaga channel to listen for
 * changes to the connected wallet account
 */
function createAccountChangedChannel() {
  return eventChannel((emitter) => {
    const emitAccount = (accounts) => emitter(accounts[0].toLowerCase() || '');

    window.ethereum.on('accountsChanged', emitAccount);

    return () => window.ethereum
      .off('accountsChanged', emitAccount);
  });
}

/**
 * Listens for account change actions from the channel and
 * refreshes the application state
 */
function* watchForAccountChange() {
  const chanAccountChanged = yield call(createAccountChangedChannel);

  while (true) {
    try {
      const account = yield take(chanAccountChanged);
      // console.log('walletSaga:: account changed: ', account);

      const { isOwner, isApproved, } = yield call(onAccountOrNetworkChange);

      yield put(updateAccountNetwork(
        account, null, isOwner, isApproved
      ));
    } catch (error) {
      yield put(walletError(error));
    }
  }
}

/**
 * Creates a ReduxSaga channel to listen for
 * changes to the connected wallet network (i.e Ropsten)
 */
function createNetworkChangedChannel() {
  return eventChannel((emitter) => {
    const emitNetwork = (chainId) => {
      // console.log('chainChanged:', chainId);
      const network = WalletService.getNetworkFromHex(chainId);
      emitter(network);
    };

    window.ethereum.on('chainChanged', emitNetwork);

    return () => window.ethereum
      .off('chainChanged', emitNetwork);
  });
}

/**
 * Listens for actions from the network change channel
 * and refreshes the application state
 */
function* watchForNetworkChange() {
  const chanNetworkChanged = yield call(createNetworkChangedChannel);

  while (true) {
    try {
      const network = yield take(chanNetworkChanged);
      // console.log('walletSaga:: network changed: ', network);

      yield put(updateAccountNetwork(null, network, null, null));

      yield call(onNetworkChange, network.id);
    } catch (error) {
      yield put(walletError(error));
    }
  }
}


export function* walletSaga() {
  yield all([
    watchForNetworkChange(),
    watchForAccountChange(),
    connectWallet(),
  ]);
}
