import { configureStore } from '@reduxjs/toolkit'
import kittyReducer from '../components/cat/catSlice';

export default configureStore({
  reducer: {
      kitties: kittyReducer,
  }
});
