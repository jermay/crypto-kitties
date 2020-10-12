import { configureStore } from '@reduxjs/toolkit'
import createSagaMidleware from 'redux-saga';

import rootSaga from './sagas';
import kittyReducer from '../components/cat/catSlice';
import offerReducer from '../components/market/offerSlice';
import walletReducer from '../components/wallet/walletSlice';

const sageMiddleware = createSagaMidleware();

export default configureStore({
  reducer: {
      kitties: kittyReducer,
      offers: offerReducer,
      wallet: walletReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(sageMiddleware)
});

sageMiddleware.run(rootSaga);
