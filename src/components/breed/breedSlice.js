/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';


export const ParentType = {
  MUM: 'mum',
  DAD: 'dad',
  SIRE: 'sire',
};

export const BreedProgress = {
  SELECT: 'select parents',
  ERROR_SAME_PARENT: 'error same parent',
  READY: 'ready',
  BIRTH: 'birth',
};

const initialState = {
  dadId: null,
  mumId: null,
  kittenId: null,
  sireOfferId: null,
  progress: BreedProgress.SELECT,
  error: null,
};

const breedSlice = createSlice({
  name: 'breed',
  initialState,
  reducers: {
    breedProgress: (state, action) => {
      state.progress = action.payload;
    },
    setParent: {
      reducer(state, action) {
        const { parentId, parentType, } = action.payload;
        if (parentType === ParentType.MUM) {
          state.mumId = parentId;
        } else {
          state.dadId = parentId;
          if (parentType === ParentType.SIRE) {
            state.sireOfferId = parentId;
          }
        }

        state.error = null;
      },
    },
    kittenBredEvent: (state, action) => {
      state.kittenId = action.payload;
      state.progress = BreedProgress.BIRTH;
    },
    sireOfferSelected: (state, action) => {
      state.sireOfferId = action.payload;
      state.dadId = action.payload;
    },
    breedReset: (state) => {
      state.dadId = null;
      state.mumId = null;
      state.kittenId = null;
      state.sireOfferId = null;
      state.progress = BreedProgress.SELECT;
      state.error = null;
    },
    breedError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  breedProgress,
  breedReset,
  kittenBredEvent,
  setParent,
  sireOfferSelected,
  breedError,
} = breedSlice.actions;

export default breedSlice.reducer;

/*
 * Selectors
*/
export const selectParentIds = (state) => {
  const { mumId, dadId, progress, } = state.breed;
  return {
    mumId,
    dadId,
    progress,
  };
};
