import { createAction } from '@reduxjs/toolkit';
import { eventChannel } from 'redux-saga';
import {
  take, call, put, all
} from 'redux-saga/effects';

import Service from '../js/service';
import { fetchKittiesForIds, getKitties } from '../cat/catSlice';
import { getOffers } from '../market/offerSlice';
import { updateAccountNetwork, walletError } from './walletSlice';
import WalletService from '../js/walletService';


export const connect = createAction('wallet/connect');
export const connectSuccess = createAction('wallet/connect/success');
export const contractInitSuccess = createAction('wallet/contractInit/success');
export const contractInitError = createAction('wallet/contractInit/error');


function* initContracts() {
  try {
    yield all([
      call(Service.kitty.init),
      call(Service.market.init)
    ]);
  } catch (err) {
    console.error(err);
    yield put(contractInitError(err.message));
  }
}


function* getKittesFromOffers() {
  const result = yield take(getOffers.fulfilled);

  const kittyIds = Object.values(result.payload)
    .map((offer) => offer.tokenId);

  yield put(fetchKittiesForIds(kittyIds));
}


function* onAccountOrNetworkChange() {
  yield all([
    put(getKitties()),
    put(getOffers()),
    call(getKittesFromOffers)
  ]);

  return yield all({
    isOwner: call(Service.kitty.isUserOwner),
    isApproved: call(Service.market.isApproved),
  });
}


function* connectWallet() {
  try {
    const account = yield call(Service.wallet.connect);
    yield put(connectSuccess());

    yield call(initContracts);
    yield put(contractInitSuccess());

    const network = yield call(Service.wallet.getNetwork);
    const { isOwner, isApproved, } = yield call(onAccountOrNetworkChange);
    yield put(updateAccountNetwork(account, network, isOwner, isApproved));
  } catch (err) {
    yield put(walletError(err));
  }
}


function createAccountChangedChannel() {
  return eventChannel((emitter) => {
    const emitAccount = (accounts) => emitter(accounts[0].toLowerCase() || '');

    window.ethereum.on('accountsChanged', emitAccount);

    return () => window.ethereum
      .off('accountsChanged', emitAccount);
  });
}


function* onAccountChange() {
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


function createNetworkChangedChannel() {
  return eventChannel((emitter) => {
    const emitNetwork = (chainId) => {
      const network = WalletService.getNetworkFromHex(chainId);
      emitter(network);
    };

    window.ethereum.on('chainChanged', emitNetwork);

    return () => window.ethereum
      .off('chainChanged', emitNetwork);
  });
}


function* onNetworkChange() {
  const chanNetworkChanged = yield call(createNetworkChangedChannel);

  while (true) {
    const chainId = yield take(chanNetworkChanged);
    // console.log('walletSaga:: network changed: ', chainId);

    const { isOwner, isApproved, } = yield call(onAccountOrNetworkChange);
    yield put(updateAccountNetwork(null, chainId, isOwner, isApproved));
  }
}


export function* walletSaga() {
  yield take(connect);
  yield call(connectWallet);

  yield all([
    onAccountChange(),
    onNetworkChange(),
  ]);
}
