import { all } from 'redux-saga/effects';
import { catSaga } from '../components/cat/catSaga';
import { offerSaga } from '../components/market/offerSaga';
import { walletSaga } from '../components/wallet/walletSaga';

export default function* rootSaga() {
    yield all([
        walletSaga(),
        catSaga(),
        offerSaga(),
    ]);
}