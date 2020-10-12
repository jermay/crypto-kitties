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
)

export const createGen0Kitty = createAsyncThunk(
    'kitties/createGen0Kitty',
    async (dna) => {
        return Service.kitty.createGen0Kitty(dna);
    }
)

const catSlice = createSlice({
    name: 'kitties',
    initialState: catAdapter.getInitialState({
        status: RequestStatus.idle,
        error: null
    }),
    reducers: {
        kittenBorn: (state, action) => {
            state.status = RequestStatus.confirmed;
            catAdapter.addOne(state, action.payload);
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
    }
});

export const {
    kittenBorn,
    addKitties,
    updateKitty
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
