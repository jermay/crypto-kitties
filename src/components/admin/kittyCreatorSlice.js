/* eslint-disable no-param-reassign */
import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import Service from '../js/service';

const kittyCreatorAdapter = createEntityAdapter({
  selectId: (creator) => creator,
});

export const fetchAllKittyCreators = createAsyncThunk(
  'kittyCreators/fetchAll',
  () => Service.kitty.getAllKittyCreators()
);

export const addKittyCreator = createAsyncThunk(
  'kittyCreators/addKittyCreator',
  (address) => Service.kitty.addKittyCreator(address)
);

export const removeKittyCreator = createAsyncThunk(
  'kittyCreators/removeKittyCreator',
  (address) => Service.kitty.removeKittyCreator(address)
);

const kittyCreatorSlice = createSlice({
  name: 'kittyCreators',
  initialState: kittyCreatorAdapter.getInitialState(),
  reducers: {},
  extraReducers: {
    [fetchAllKittyCreators.fulfilled]: kittyCreatorAdapter.setAll,

    [addKittyCreator.fulfilled]: (state, action) => {
      const toAdd = action.meta.arg;
      kittyCreatorAdapter.addOne(state, toAdd);
    },

    [removeKittyCreator.fulfilled]: (state, action) => {
      const toRemove = action.meta.arg;
      kittyCreatorAdapter.removeOne(state, toRemove);
    },
  },
});

export const {
  selectAll: selectAllKittyCreators,
} = kittyCreatorAdapter.getSelectors((state) => state.kittyCreators);

export default kittyCreatorSlice.reducer;
