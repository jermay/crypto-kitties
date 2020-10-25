import { createAction } from "@reduxjs/toolkit";
import { addKitties, updateKitty } from "../cat/catSlice";

const { eventChannel } = require("redux-saga");
const { call, put, take, all, fork } = require("redux-saga/effects");

const { Service } = require("../js/service");
const { offerError, offerCreated, offerPurchased, offerCancelled, buyKitty, offerEventNotify, removeOffer } = require("./offerSlice");


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
                const offer = yield call(
                    Service.market.getOffer, eventData.tokenId);
                yield put(offerCreated(offer));

                const offerKitty = yield call(
                    Service.kitty.getKitty, eventData.tokenId);
                yield put(addKitties([offerKitty]));
                break;

            case MarketTransType.sellOfferPurchased:
            case MarketTransType.sireOfferPurchased:
                yield put(offerPurchased(eventData));

                // kitty will have changed ownership or
                // have a new cooldown
                const kitty = yield call(
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

function* dispatchAlertOnEventMatch(_tokenId, transType) {
    let matchingEvent;
    do {
        const eventAction = yield take(marketEvent);
        const { tokenId, TxType } = eventAction.payload;

        if (tokenId === _tokenId &&
            TxType === transType
        ) {
            matchingEvent = eventAction.payload;
        }
    } while (!matchingEvent);

    yield put(offerEventNotify(matchingEvent));
}

function* onOfferError(err) {
    console.error(err);
    yield put(offerError(err.message));
}