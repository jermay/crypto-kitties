/* eslint-disable no-param-reassign */
import {
  createAsyncThunk, createEntityAdapter, createSelector, createSlice
} from '@reduxjs/toolkit';
import { normalize, schema } from 'normalizr';

import { offerTypes } from '../js/kittyConstants';
import Service from '../js/service';


const offerAdapter = createEntityAdapter({
  selectId: (offer) => offer.tokenId,
});

// define schema
export const offerSchema = new schema.Entity(
  'offers', {}, { idAttribute: 'tokenId', }
);

export const offerListSchema = [offerSchema];

/*
 * requests
*/
export const getOffers = createAsyncThunk(
  'offers/getOffers',
  async () => {
    const data = await Service.market.getOffers();
    const normalized = normalize(data, offerListSchema);
    // console.log('getOffers: ', normalized);
    return normalized.entities.offers || [];
  }
);

export const sellKitty = createAsyncThunk(
  'offers/sellKitty',
  async ({ kittyId, price, }) => Service.market.sellKitty(kittyId, price)
);

export const buyKitty = createAsyncThunk(
  'offers/buyKitty',
  async ({ offer, }) => Service.market.buyKitty(offer)
);

export const sireKitty = createAsyncThunk(
  'offer/sireKitty',
  async ({ kittyId, price, }) => Service.market.setSireOffer(kittyId, price)
);

export const buySireRites = createAsyncThunk(
  'offers/buySireRites',
  async ({ offer, matronId, }) => Service.market.buySireRites(offer, matronId)
);

export const removeOffer = createAsyncThunk(
  'offers/removeOffer',
  async ({ kittyId, }) => Service.market.removeOffer(kittyId)
);

const offerSlice = createSlice({
  name: 'offers',
  initialState: offerAdapter.getInitialState({
    event: null,
    error: null,
  }),
  reducers: {
    offerCreated: offerAdapter.addOne,
    offerPurchased: (state, action) => {
      offerAdapter.removeOne(state, action.payload.tokenId);
    },
    offerCancelled: (state, action) => {
      offerAdapter.removeOne(state, action.payload.tokenId);
    },
    offerEventNotify: (state, action) => {
      state.event = action.payload;
    },
    OfferEventDismiss: (state) => {
      state.event = null;
    },
    offerError: (state, action) => {
      state.error = action.payload;
    },
    clearOffers: (state) => {
      offerAdapter.setAll(state, []);
      state.event = null;
      state.error = null;
    },
  },
  extraReducers: {
    [getOffers.fulfilled]: offerAdapter.setAll,
  },
});

export const {
  clearOffers,
  offerCreated,
  offerPurchased,
  offerCancelled,
  offerEventNotify,
  OfferEventDismiss,
  offerError,
} = offerSlice.actions;

export default offerSlice.reducer;

/*
 * Selectors
*/
export const {
  selectById: selectOfferByKittyId,
  selectAll: selectAllOffers,
} = offerAdapter.getSelectors((state) => state.offers);

export const selectOfferIdsByType = createSelector(
  [selectAllOffers, (_, offerType) => offerType],
  (offers, offerType) => {
    const isSireOffer = offerType === offerTypes.sire;
    return offers.filter((offer) => offer.isSireOffer === isSireOffer)
      .map((offer) => offer.tokenId);
  }
);

export const selectSireOfferIdsForBreeding = createSelector(
  [selectAllOffers, (_, user) => user],
  (offers, user) => offers
    .filter((offer) => offer.isSireOffer && offer.seller !== user)
    .map((offer) => offer.tokenId)
);

export const selectOfferRequestStatus = (state) => state.offers.status;
