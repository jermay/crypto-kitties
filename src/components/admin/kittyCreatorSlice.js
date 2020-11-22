/* eslint-disable no-param-reassign */
import {
  createAsyncThunk, createEntityAdapter, createSelector, createSlice
} from '@reduxjs/toolkit';
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
  reducers: {
    kittyCreatorAdded: kittyCreatorAdapter.addOne,
    kittyCreatorRemoved: kittyCreatorAdapter.removeOne,
  },
  extraReducers: {
    [fetchAllKittyCreators.fulfilled]: kittyCreatorAdapter.setAll,

    [addKittyCreator.fulfilled]: (state, action) => {
      // remove checksum capitalization for comparison consistancy
      const toAdd = action.meta.arg.toLowerCase();
      kittyCreatorAdapter.addOne(state, toAdd);
    },

    [removeKittyCreator.fulfilled]: (state, action) => {
      const toRemove = action.meta.arg;
      kittyCreatorAdapter.removeOne(state, toRemove);
    },
  },
});

export const {
  kittyCreatorAdded,
  kittyCreatorRemoved,
} = kittyCreatorSlice.actions;

export const {
  selectAll: selectAllKittyCreators,
} = kittyCreatorAdapter.getSelectors((state) => state.kittyCreators);

/**
 * Returns true if the user is a Kitty Creator
 * @param {state} state redux state
 * @param {string} user user account
 * @returns {boolean}
 */
export const isUserKittyCreator = createSelector(
  [selectAllKittyCreators, (_, user) => user],
  (creators, user) => creators.some((c) => c === user)
);

export default kittyCreatorSlice.reducer;
