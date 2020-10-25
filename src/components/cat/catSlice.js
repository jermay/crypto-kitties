import { createAsyncThunk, createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit';
import { normalize, schema } from 'normalizr';

import { Service } from '../js/service';
import { RequestStatus, setRequestStatusFailed, setRequestStatusLoading, setRequestStatusSucceeded } from '../js/utils';

const catAdapter = createEntityAdapter({
    // sort by kittyId descending
    sortComparer: (a, b) => b.kittyId - a.kittyId,
    selectId: kitty => kitty.kittyId
});

// define kitty schema
export const kittySchema = new schema.Entity(
    'kitties', {}, { idAttribute: 'kittyId' }
);

export const kittyListSchema = [kittySchema];

/*
 * requests
*/
export const getKitties = createAsyncThunk(
    'kitties/getKitties',
    async () => {
        const data = await Service.kitty.getKitties();
        const normalized = normalize(data, kittyListSchema);
        console.log('kitties/getKitties: normalized: ', normalized);
        return normalized.entities.kitties || [];
    }
);

export const fetchKitty = createAsyncThunk(
    'kitties/fetchKitty',
    async (kittyId) => {
        return Service.kitty.getKitty(kittyId);
    }
);

export const fetchKittiesForIds = createAsyncThunk(
    'kitties/fetchKittiesForIds',
    async (kittyIds) => {
        return Service.kitty.getKittesForIds(kittyIds);
    }
);

export const createGen0Kitty = createAsyncThunk(
    'kitties/createGen0Kitty',
    async (dna) => {
        return Service.kitty.createGen0Kitty(dna);
    }
);

export const breedKitties = createAsyncThunk(
    'kitties/breedKitties',
    ({ mumId, dadId }) => {
        return Service.kitty.breed(mumId, dadId);
    }
);

const catSlice = createSlice({
    name: 'kitties',
    initialState: catAdapter.getInitialState({
        newKittenId: null,
        status: RequestStatus.idle,
        error: null
    }),
    reducers: {
        kittenBorn: (state, action) => {
            state.status = RequestStatus.confirmed;
            state.newKittenId = action.payload.kittyId;
            catAdapter.addOne(state, action.payload);
        },
        newKittenIdClear: (state, action) => {
            state.newKittenId = null;
        },
        kittyError: (state, action) => {
            state.error = action.payload;
        },
        addKitties: catAdapter.upsertMany,
        updateKitty: catAdapter.upsertOne,
    },
    extraReducers: {
        [getKitties.pending]: setRequestStatusLoading,
        [getKitties.rejected]: setRequestStatusFailed,
        [getKitties.fulfilled]: (state, action) => {
            state.status = RequestStatus.succeeded;
            catAdapter.setAll(state, action.payload);
        },

        [createGen0Kitty.pending]: setRequestStatusLoading,
        [createGen0Kitty.rejected]: setRequestStatusFailed,
        [createGen0Kitty.fulfilled]: setRequestStatusSucceeded,

        [fetchKitty.fulfilled]: catAdapter.upsertOne,

        [fetchKittiesForIds.fulfilled]: catAdapter.upsertMany
    }
});

export const {
    addKitties,
    kittyError,
    kittenBorn,
    newKittenIdClear,
    updateKitty,
} = catSlice.actions;

export default catSlice.reducer;

export const {
    selectAll: selectAllKitties,
    selectById: selectKittyById,
    selectIds: selectKittyIds
} = catAdapter.getSelectors(state => state.kitties);

export const selectKittiesByOwner = createSelector(
    [selectAllKitties, (_, owner) => owner],
    (entities, owner) => entities.filter(kitty => kitty.owner === owner)
);
