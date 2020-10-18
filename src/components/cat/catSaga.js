import { createAction } from "@reduxjs/toolkit";

const { eventChannel } = require("redux-saga");
const { call, put, take, all } = require("redux-saga/effects");

const { Service } = require("../js/service");
const { kittenBorn, createGen0Kitty, kittyError } = require("./catSlice");

export const birthEvent = createAction('kitties/birthEvent');


export function* catSaga() {
    yield all([
        dispatchBirthEvent(),
        call(onGenZeroKitty),
    ]);
}

function* onGenZeroKitty() {
    while (true) {
        try {
            const action = yield take(createGen0Kitty);
            const newDna = action.payload;
            console.log('cataSaga::onGenZeroKitty genes:', newDna);

            // listen for birth events until
            // matching kitten is found or an error
            yield call(
                dispatchKittenOnBirthEventMatch,
                kitten => kitten.genes === newDna
            );

        } catch (error) {
            console.error(error);
            yield put(kittyError(error.message));
        }
    }
}

export function* dispatchKittenOnBirthEventMatch(matchFn) {
    // listen for birth events until
    // matching kitten is found or an error
    let kittenEvent;
    do {
        const { payload } = yield take(birthEvent);

        if (matchFn(payload)) {
            kittenEvent = payload;
        }
    } while (!kittenEvent);

    const kitten = yield call(
        Service.kitty.getKitty,
        kittenEvent.kittyId
    );
    yield put(kittenBorn(kitten));
}

function createBirthEventChannel() {
    return eventChannel(emitter => {
        const onEvent = e => {
            console.log('catSaga:: birth event', e);
            emitter(e);
        }

        Service.kitty.subscribeToBirthEvent(onEvent);

        return () => Service.kitty.unSubscribeToBirthEvent(onEvent);
    })
}

function* dispatchBirthEvent() {
    const birthChan = yield call(createBirthEventChannel);

    while (true) {
        try {
            const e = yield take(birthChan);
            yield put(birthEvent(e));

        } catch (err) {
            console.error(err);
            yield put(kittyError(err.message));
        }
    }
}
