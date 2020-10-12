import { addKitties, updateKitty } from "../cat/catSlice";

const { eventChannel } = require("redux-saga");
const { call, put, take, all } = require("redux-saga/effects");

const { Service } = require("../js/service");
const { offerError, offerCreated, offerPurchased, offerCancelled } = require("./offerSlice");


export const MarketTransType = {
    sellOfferCreated: 'Create',
    sellOfferPurchased: 'Buy',
    sireOfferCreated: 'Sire Offer',
    sireOfferPurchased: 'Sire Rites',
    offerCancelled: 'Remove'
}


export function* offerSaga() {
    yield all([
        watchMarketChannel()
    ]);
}

function* watchMarketChannel() {
    const chanMarket = yield call(createMarketEventChannel);

    while (true) {
        try {
            const marketEvent = yield take(chanMarket);
            yield call(onMarketEvent, marketEvent);
        } catch (error) {
            yield put(offerError(error));
        }
    }
}

function createMarketEventChannel() {
    return eventChannel(emitter => {
        const onEvent = e => {
            console.log('offerSaga:: market event ', e);
            emitter(e);
        }

        Service.market.subscribe(onEvent);

        return () => Service.market.unsubscribe(onEvent);
    });
}

function* onMarketEvent(marketEvent) {
    try {
        switch (marketEvent.TxType) {
            case MarketTransType.sellOfferCreated:
            case MarketTransType.sireOfferCreated:
                const offer = yield call(
                    Service.market.getOffer, marketEvent.tokenId);
                yield put(offerCreated(offer));

                const offerKitty = yield call(
                    Service.kitty.getKitty, marketEvent.tokenId);
                yield put(addKitties([offerKitty]));
                break;

            case MarketTransType.sellOfferPurchased:
            case MarketTransType.sireOfferPurchased:
                yield put(offerPurchased(marketEvent));

                // kitty will have changed ownership or
                // have a new cooldown
                const kitty = yield call(
                    Service.kitty.getKitty, marketEvent.tokenId);
                yield put(updateKitty(kitty));
                break;

            case MarketTransType.offerCancelled:
                yield put(offerCancelled(marketEvent));
                break;

            default:
                console.log('Unknown market trans type: ', marketEvent.TxType);
                break;
        }
    } catch (error) {
        yield put(offerError(error));
    }
}

