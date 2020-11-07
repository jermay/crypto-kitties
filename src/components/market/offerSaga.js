import { createAction } from "@reduxjs/toolkit";
import { addKitties, updateKitty } from "../cat/catSlice";

import { eventChannel } from "redux-saga";
import { call, put, take, all, fork, race } from "redux-saga/effects";

import { Service } from "../js/service";
import { offerError, offerCreated, offerPurchased, offerCancelled, buyKitty, offerEventNotify, removeOffer } from "./offerSlice";


export const MarketTransType = {
    sellOfferCreated: 'Create',
    sellOfferPurchased: 'Buy',
    sireOfferCreated: 'Sire Offer',
    sireOfferPurchased: 'Sire Rites',
    offerCancelled: 'Remove'
}

// actions
export const marketEvent = createAction('offers/marketEvent');
export const buyOffer = createAction('offers/buy');
export const cancelOffer = createAction('offers/cancel');


export function* offerSaga() {
    yield all([
        watchMarketChannel(),
        watchForBuyOffer(),
        watchForCancelOffer(),
    ]);
}

function* watchMarketChannel() {
    const chanMarket = yield call(createMarketEventChannel);

    while (true) {
        try {
            const eventData = yield take(chanMarket);
            yield call(onMarketEvent, eventData);

            // broadcast event
            yield put(marketEvent(eventData));

        } catch (err) {
            onOfferError(err);
        }
    }
}

function createMarketEventChannel() {
    return eventChannel(emitter => {
        const onEvent = e => {
            // console.log('offerSaga:: market event ', e);
            emitter(e);
        }

        Service.market.subscribe(onEvent);

        return () => Service.market.unsubscribe(onEvent);
    });
}

function* onMarketEvent(eventData) {
    try {
        // update offer slice
        switch (eventData.TxType) {
            case MarketTransType.sellOfferCreated:
            case MarketTransType.sireOfferCreated:
                var offer = yield call(
                    Service.market.getOffer, eventData.tokenId);
                yield put(offerCreated(offer));

                var offerKitty = yield call(
                    Service.kitty.getKitty, eventData.tokenId);
                yield put(addKitties([offerKitty]));
                break;

            case MarketTransType.sellOfferPurchased:
            case MarketTransType.sireOfferPurchased:
                yield put(offerPurchased(eventData));

                // kitty will have changed ownership or
                // have a new cooldown
                var kitty = yield call(
                    Service.kitty.getKitty, eventData.tokenId);
                yield put(updateKitty(kitty));
                break;

            case MarketTransType.offerCancelled:
                yield put(offerCancelled(eventData));
                break;

            default:
                console.log('Unknown market trans type: ', eventData.TxType);
                break;
        }

    } catch (error) {
        yield put(offerError(error));
    }
}

function* watchForBuyOffer() {
    while (true) {
        const { payload } = yield take(buyOffer);
        yield fork(onBuyOffer, payload.offer);
    }
}

function* onBuyOffer(offer) {
    try {
        yield fork(
            dispatchAlertOnEventMatch,
            offer.tokenId,
            MarketTransType.sellOfferPurchased
        );

        yield put(buyKitty({ offer }));

    } catch (err) {
        onOfferError(err);
    }
}

function* watchForCancelOffer() {
    while (true) {
        const { payload } = yield take(cancelOffer);
        yield fork(onCancelOffer, payload.kittyId);
    }
}

function* onCancelOffer(tokenId) {
    try {
        yield fork(
            dispatchAlertOnEventMatch,
            tokenId,
            MarketTransType.offerCancelled
        );

        yield put(removeOffer({ kittyId: tokenId }));

    } catch (err) {
        onOfferError(err);
    }
}

function offerRejectedActionMatcher(action) {
    const match = action.type.match(/offers\/.*\/rejected/);
    return Boolean(match);
}

function* dispatchAlertOnEventMatch(_tokenId, transType) {
    let matchingEvent;
    do {
        const result = yield race({
            eventAction: take(marketEvent),
            rejected: take(offerRejectedActionMatcher)
        });

        if (result.rejected) {
            // abort- an error occured
            // console.log(`dispatchAlertOnEventMatch: aborting. received reject`);
            break;
        }

        // else a market event occurred
        // check to see if it's the right one
        const { tokenId, TxType } = result.eventAction.payload;

        if (tokenId === _tokenId &&
            TxType === transType
        ) {
            matchingEvent = result.eventAction.payload;
        }
    } while (!matchingEvent);

    if (matchingEvent) {
        // display market event
        yield put(offerEventNotify(matchingEvent));
    }
    // else an error occurred so no notification
}

function* onOfferError(err) {
    console.error(err);
    yield put(offerError(err.message));
}