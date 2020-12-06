import { createAction } from '@reduxjs/toolkit';
import { eventChannel } from 'redux-saga';
import {
  call, put, take, all, race,
} from 'redux-saga/effects';

import KittyService from '../js/kitty.service';
import Service from '../js/service';
import { contractInitSuccess } from '../wallet/walletSaga';
import {
  kittenBorn, createGen0Kitty, kittyError, getGen0KittyCount,
} from './catSlice';

export const birthEvent = createAction('kitties/birthEvent');


export function* dispatchKittenOnBirthEventMatch(matchFn) {
  // listen for birth events until
  // matching kitten is found or an error
  let kittenEvent;
  do {
    const { payload, } = yield take(birthEvent);

    if (matchFn(payload)) {
      kittenEvent = payload;
    }
  } while (!kittenEvent);

  const kitten = yield call(
    Service.kitty.getKitty,
    kittenEvent.kittyId
  );
  yield put(kittenBorn(kitten));

  return kitten;
}

/**
 * Dispatches a birth event for the Kitty Creator
 */
function* onGenZeroKitty() {
  while (true) {
    try {
      const action = yield take(createGen0Kitty.pending);
      const newDna = action.meta.arg;

      // listen for birth events until
      // matching kitten is found or an error
      yield race({
        birth: call(
          dispatchKittenOnBirthEventMatch,
          (kitten) => kitten.genes === newDna
        ),
        error: take(createGen0Kitty.rejected),
      });
    } catch (error) {
      console.error(error);
      yield put(kittyError(error.message));
    }
  }
}


function createBirthEventChannel() {
  return eventChannel((emitter) => {
    const onEvent = (e) => {
      // console.log('catSaga:: birth event', e);
      emitter(e);
    };

    Service.kitty.on(KittyService.eventNames.Birth, onEvent);

    return () => Service.kitty.off(KittyService.eventNames.Birth, onEvent);
  });
}


function* dispatchBirthEvent() {
  // watch for Birth event once kitty contract is initialized
  yield take(contractInitSuccess);

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

/**
 * Update the generation 0 count on birth of a gen 0 kitty
 */
function* onGen0KittyBirth() {
  while (true) {
    try {
      // watch all birth events
      const { payload, } = yield take(birthEvent);
      const { kittyId, } = payload;

      // TODO: add generation to the birth event
      // get the kitten from the contract as it might not be in the store
      const kitten = yield call(Service.kitty.getKitty, kittyId);

      // update the count if generation zero
      if (kitten && +kitten.generation === 0) {
        yield put(getGen0KittyCount());
      }
    } catch (error) {
      yield put(kittyError(error.message));
    }
  }
}


export function* catSaga() {
  yield all([
    dispatchBirthEvent(),
    onGenZeroKitty(),
    onGen0KittyBirth(),
  ]);
}
