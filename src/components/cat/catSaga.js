const { eventChannel } = require("redux-saga");
const { call, put, take } = require("redux-saga/effects");

const { Service } = require("../js/service");
const { kittenBorn } = require("./catSlice");


export function* catSaga() {
    yield call(onBirthEvent);
}

function* onBirthEvent() {
    const birthChan = yield call(createBirthEventChannel);

    while (true) {
        try {
            const e = yield take(birthChan);

            const kitten = yield call(Service.kitty.getKitty, e.kittyId);
            yield put(kittenBorn(kitten));

        } catch (error) {
            console.error(error);
        }
    }
}

function createBirthEventChannel() {
    return eventChannel(emitter => {
        const onEvent = e => {
            console.log('catSaga:: birth event', e);
            // TODO: filter by current user
            emitter(e);
        }

        Service.kitty.subscribeToBirthEvent(onEvent);

        return () => Service.kitty.unSubscribeToBirthEvent(onEvent);
    })
}
