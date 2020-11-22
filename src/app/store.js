import { configureStore } from '@reduxjs/toolkit';
import createSagaMidleware from 'redux-saga';

import rootSaga from './sagas';
import breedReducer from '../components/breed/breedSlice';
import kittyReducer from '../components/cat/catSlice';
import offerReducer from '../components/market/offerSlice';
import transStatusReducer from '../components/notification/transStatusSlice';
import walletReducer from '../components/wallet/walletSlice';
import networkReducer from '../components/wallet/networkSlice';
import kittyCreatorReducer from '../components/admin/kittyCreatorSlice';

const sagaMiddleware = createSagaMidleware();

export default configureStore({
  reducer: {
    breed: breedReducer,
    kitties: kittyReducer,
    offers: offerReducer,
    wallet: walletReducer,
    transStatus: transStatusReducer,
    networks: networkReducer,
    kittyCreators: kittyCreatorReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);
