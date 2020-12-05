import { createAction } from '@reduxjs/toolkit';
import { eventChannel } from 'redux-saga';
import {
  take, call, put, all, select, race
} from 'redux-saga/effects';

import Service from '../js/service';
import {
  clearKitties, fetchKittiesForIds, getGen0KittyCount, getGen0KittyLimit,
  getKitties
} from '../cat/catSlice';
import { clearOffers, getOffers } from '../market/offerSlice';
import {
  connectWallet, selectIsWalletConnected, selectOnSupportedNetwork,
  updateAccountNetwork, updateOwnerApproved, walletError, updateIsKittyCreator,
  walletDisconnected, selectUser, fetchWeb3ProviderIsAvailable, selectIsWeb3ProviderAvailable,
} from './walletSlice';
import WalletService from '../js/walletService';
import {
  fetchAllKittyCreators, isUserKittyCreator, kittyCreatorAdded,
  kittyCreatorRemoved,
} from '../admin/kittyCreatorSlice';


export const connect = createAction('wallet/connect');
export const connectSuccess = createAction('wallet/connect/success');
export const contractInitSuccess = createAction('wallet/contractInit/success');
export const contractInitError = createAction('wallet/contractInit/error');
export const web3InitSuccess = createAction('wallet/web3Init/success');

/**
 * Update the isKittyCreator status when the list
 * of Kitty Creators changes
 */
function* watchForKittyCreatorchange() {
  while (true) {
    try {
      yield take([kittyCreatorAdded, kittyCreatorRemoved]);

      const user = yield select(selectUser);
      const result = yield select(isUserKittyCreator, user);
      yield put(updateIsKittyCreator(result));
    } catch (error) {
      yield put(walletError(error.message));
    }
  }
}

/**
 * Calls Service to initialize the contract instances
 * for the given network. Dispatches a 'wallet/contractInit/error' action
 * if chainId is not a supported network
 * @param {string} chainId the network chain ID (i.e. '0x3' for Ropsten)
 */
function* initContracts(chainId) {
  try {
    yield call(Service.initContracts, chainId);
    yield put(contractInitSuccess());
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
    call(getKittesFromOffers),
    put(fetchAllKittyCreators()),
  ]);

  // get updated user state
  return yield all({
    isOwner: call(Service.kitty.isUserOwner),
    isApproved: call(Service.market.isApproved),
    isKittyCreator: call(Service.kitty.isUserKittyCreator),
    gen0Count: put(getGen0KittyCount()),
    gen0Limit: put(getGen0KittyLimit()),
  });
}

/**
 * Refreshes the contract instances.
 * Called when the connected network changes.
 * @param {string} chainId network chain ID (i.e. '0x3' for Ropsten)
 */
function* onNetworkChange(chainId) {
  const isConnected = yield select(selectIsWalletConnected);
  const isSupportedNetwork = yield select(selectOnSupportedNetwork);
  // console.log('onNetworkChange:: isSupportedNetwork', isSupportedNetwork);

  if (isConnected && isSupportedNetwork) {
    // refresh contracts
    yield call(initContracts, chainId);

    // refresh application state
    const { isOwner, isApproved, isKittyCreator, } = yield call(onAccountOrNetworkChange);
    yield put(updateOwnerApproved(isOwner, isApproved, isKittyCreator));
  } else {
    // unsupported network: reset application state
    yield all([
      put(contractInitError('Wallet not connected or unsupported network')),
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
function* onConnectWallet() {
  while (true) {
    try {
      yield take(connect);

      const providerAvailable = yield select(selectIsWeb3ProviderAvailable);
      if (!providerAvailable) {
        // cannot connect wallet if no web 3 provider
        yield put(walletError('No web 3 provider. Intstall Metamask'));

        // eslint-disable-next-line no-continue
        continue;
      }

      // update connected account and network
      yield put(connectWallet());

      const result = yield race({
        fulfilled: take(connectWallet.fulfilled),
        error: take(connectWallet.rejected),
      });

      const network = yield call(Service.wallet.getNetwork);
      yield put(updateAccountNetwork(null, network));

      // init application state
      if (result.fulfilled) {
        yield put(connectSuccess());
        yield call(onNetworkChange, network.id);
      }
    } catch (err) {
      yield put(walletError(err));
    }
  }
}

function* onWalletDisconnected() {
  yield all([
    put(walletDisconnected()),
    put(clearKitties()),
    put(clearOffers()),
  ]);
}

/**
 * Creates ReduxSaga channel to listen for
 * changes to the connected wallet account
 */
function createAccountChangedChannel() {
  return eventChannel((emitter) => {
    const emitAccount = (accounts) => {
      // console.log('createAccountChangedChannel::event emitted', accounts);
      const account = accounts.length
        ? accounts[0].toLowerCase()
        : '';
      emitter(account);
    };

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
  // can only watch for account change if web3 provider available
  yield take(web3InitSuccess);

  const chanAccountChanged = yield call(createAccountChangedChannel);

  while (true) {
    try {
      const account = yield take(chanAccountChanged);

      const isConnected = yield select(selectIsWalletConnected);
      if (!isConnected) {
        // don't update anything if wallet not connected yet
        // otherwise will make contract calls before they
        // are initialized
        // eslint-disable-next-line no-continue
        continue;
      }

      if (account) {
        const {
          isOwner, isApproved, isKittyCreator,
        } = yield call(onAccountOrNetworkChange);

        yield put(updateAccountNetwork(
          account, null, isOwner, isApproved, isKittyCreator
        ));
      } else {
        // when the new account is empty the wallet was locked by the user
        yield call(onWalletDisconnected);
      }
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
  // can only watch for network change if web3 provider available
  yield take(web3InitSuccess);

  const chanNetworkChanged = yield call(createNetworkChangedChannel);

  while (true) {
    try {
      const network = yield take(chanNetworkChanged);

      yield put(updateAccountNetwork(null, network, null, null));

      yield call(onNetworkChange, network.id);
    } catch (error) {
      yield put(walletError(error));
    }
  }
}

function* detectWeb3Provider() {
  try {
    yield put((fetchWeb3ProviderIsAvailable()));
    const resultAction = yield take([
      fetchWeb3ProviderIsAvailable.fulfilled,
      fetchWeb3ProviderIsAvailable.rejected,
    ]);

    if (fetchWeb3ProviderIsAvailable.fulfilled.match(resultAction)
      && resultAction.payload
    ) {
      Service.initServices();
      yield put(web3InitSuccess());
    } else {
      yield put(walletError('No web 3 provider. Please install Metamask'));
    }
  } catch (error) {
    console.error(error);
    yield put(walletError(error.message));
  }
}


export function* walletSaga() {
  yield all([
    detectWeb3Provider(),
    watchForNetworkChange(),
    watchForAccountChange(),
    watchForKittyCreatorchange(),
    onConnectWallet(),
  ]);
}
