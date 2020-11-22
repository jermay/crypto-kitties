import { all } from 'redux-saga/effects';
import kittyCreatorSaga from '../components/admin/kittyCreatorSaga';
import { breedSaga } from '../components/breed/breedSaga';
import { catSaga } from '../components/cat/catSaga';
import { offerSaga } from '../components/market/offerSaga';
import transStatusSaga from '../components/notification/transStatusSaga';
import { walletSaga } from '../components/wallet/walletSaga';

export default function* rootSaga() {
  yield all([
    walletSaga(),
    catSaga(),
    breedSaga(),
    kittyCreatorSaga(),
    offerSaga(),
    transStatusSaga(),
  ]);
}
