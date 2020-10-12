import { getKitties } from "../cat/catSlice";
import { getOffers } from "../market/offerSlice";
import { updateAccountNetwork, walletError } from "./walletSlice";
import { addKitties } from '../cat/catSlice';

const { createAction } = require("@reduxjs/toolkit");
const { eventChannel } = require("redux-saga");
const { take, call, put, all } = require("redux-saga/effects");
const { Service } = require("../js/service");

export const connect = createAction('wallet/connect');
export const connectSuccess = createAction('wallet/connect/success');


export function* walletSaga() {
    yield take(connect);
    yield call(connectWallet);

    yield all([
        onAccountChange(),
        onNetworkChange(),
    ]);
}

function* connectWallet() {
    try {
        console.log('connecting to wallet...');

        const account = yield call(Service.wallet.connect);
        yield put(connectSuccess());

        const network = yield call(Service.wallet.getNetwork);
        const { isOwner, isApproved } = yield call(onAccountOrNetworkChange);
        yield put(updateAccountNetwork(account, network, isOwner, isApproved));

    } catch (err) {
        yield put(walletError(err));
    }
}

function* onAccountOrNetworkChange() {
    yield all([
        put(getKitties()),
        put(getOffers()),
        call(getKittesFromOffers)
    ]);

    return yield all({
        isOwner: call(Service.kitty.isUserOwner),
        isApproved: call(Service.market.isApproved)
    });
}

function* getKittesFromOffers() {
    const result = yield take(getOffers.fulfilled);

    const kitties = Object.values(result.payload)
        .map(offer => offer.kitty);

    yield put(addKitties(kitties));
}

function* onAccountChange() {
    const chanAccountChanged = yield call(createAccountChangedChannel);

    while (true) {
        try {
            const account = yield take(chanAccountChanged);
            console.log('walletSaga:: account changed: ', account);

            const { isOwner, isApproved } = yield call(onAccountOrNetworkChange);

            yield put(updateAccountNetwork(
                account, null, isOwner, isApproved
            ));

        } catch (error) {
            yield put(walletError(error));
        }
    }
}

function createAccountChangedChannel() {
    return eventChannel(emitter => {
        const emitAccount = accounts => emitter(accounts[0] || '');

        window.ethereum.on('accountsChanged', emitAccount);

        return () => window.ethereum
            .off('accountsChanged', emitAccount);
    });
}

function* onNetworkChange() {
    const chanNetworkChanged = yield call(createNetworkChangedChannel);

    while (true) {
        const chainId = yield take(chanNetworkChanged);
        console.log('walletSaga:: network changed: ', chainId);

        const { isOwner, isApproved } = yield call(onAccountOrNetworkChange);
        yield put(updateAccountNetwork(null, chainId, isOwner, isApproved));
    }
}

function createNetworkChangedChannel() {
    return eventChannel(emitter => {
        const emitNetwork = chainId => {
            const network = Service.wallet.getNetworkFromHex(chainId)
            emitter(network);
        }

        window.ethereum.on('chainChanged', emitNetwork);

        return () => window.ethereum
            .off('chainChanged', emitNetwork);
    });
}
