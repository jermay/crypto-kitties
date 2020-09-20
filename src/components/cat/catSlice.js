import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { normalize, schema } from 'normalizr';

import { Service } from '../js/service';
import { requestStatus } from '../js/utils';

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
        return normalized.entities.kitties;
    }
)

const catSlice = createSlice({
    name: 'kitties',
    initialState: catAdapter.getInitialState({
        status: requestStatus.idle,
        error: null
    }),
    reducers: {},
    extraReducers: {
        [getKitties.pending]: (state, action) => {
            state.status = requestStatus.loading;
        },
        [getKitties.fulfilled]: (state, action) => {
            state.status = requestStatus.succeeded;
            catAdapter.upsertMany(state, action.payload);
        },
        [getKitties.rejected]: (state, action) => {
            state.status = requestStatus.failed;
            state.error = action.error.message;
        }
    }
});

export default catSlice.reducer;

export const {
    selectById: selectKittyById,
    selectIds: selectKittyIds
} = catAdapter.getSelectors(state => state.kitties);
