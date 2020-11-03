import { createAsyncThunk, createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit';
import { normalize, schema } from 'normalizr';
import { offerTypes } from '../js/kittyConstants';
import { Service } from '../js/service';

// export const OfferStatus = {
//   active: 'Active',
//   sold: 'Sold',
//   cancelled: 'Cancelled'
// }

const offerAdapter = createEntityAdapter({
  selectId: offer => offer.tokenId
});

const initialState = offerAdapter.getInitialState({
  event: null,
  error: null
});

// define schema
export const offerSchema = new schema.Entity(
  'offers', {}, { idAttribute: 'tokenId' }
);

export const offerListSchema = [offerSchema];

/*
 * requests
*/
export const getOffers = createAsyncThunk(
  'offers/getOffers',
  async () => {
    let data = await Service.market.getOffers();
    const normalized = normalize(data, offerListSchema);
    console.log('getOffers: ', normalized);
    return normalized.entities.offers || [];
  }
)

export const sellKitty = createAsyncThunk(
  'offers/sellKitty',
  async ({ kittyId, price }) => {
    return Service.market.sellKitty(kittyId, price);
  }
)

export const buyKitty = createAsyncThunk(
  'offers/buyKitty',
  async ({ offer }) => {
    return Service.market.buyKitty(offer);
  }
)

export const sireKitty = createAsyncThunk(
  'offer/sireKitty',
  async ({ kittyId, price }) => {
    return Service.market.setSireOffer(kittyId, price);
  }
)

export const buySireRites = createAsyncThunk(
  'offers/buySireRites',
  async ({ offer, matronId }) => {
    return Service.market.buySireRites(offer, matronId);
  }
)

export const removeOffer = createAsyncThunk(
  'offers/removeOffer',
  async ({ kittyId }) => {
    return Service.market.removeOffer(kittyId);
  }
)

const offerSlice = createSlice({
  name: 'offers',
  initialState,
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
    }
  },
  extraReducers: {
    [getOffers.fulfilled]: offerAdapter.setAll,
  }
});

export const {
  offerCreated,
  offerPurchased,
  offerCancelled,
  offerEventNotify,
  OfferEventDismiss,
  offerError
} = offerSlice.actions;

export default offerSlice.reducer;

/*
 * Selectors
*/
export const {
  selectById: selectOfferByKittyId,
  selectAll: selectAllOffers,
} = offerAdapter.getSelectors(state => state.offers);

export const selectOfferIdsByType = createSelector(
  [selectAllOffers, (_, offerType) => offerType],
  (offers, offerType) => {
    console.log('selectOffersByType:: offers: ', offers);
    const isSireOffer = offerType === offerTypes.sire;
    return offers.filter(offer => offer.isSireOffer === isSireOffer)
      .map(offer => offer.tokenId);
  }
);

export const selectOfferRequestStatus = (state) => state.offers.status;
