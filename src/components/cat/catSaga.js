import { createAction } from '@reduxjs/toolkit';
import { eventChannel } from 'redux-saga';
import {
  call, put, take, all, race
} from 'redux-saga/effects';
import KittyService from '../js/kitty.service';

import Service from '../js/service';
import {
  kittenBorn, createGen0Kitty, kittyError, getGen0KittyCount
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


function* onGenZeroKitty() {
  while (true) {
    try {
      const action = yield take(createGen0Kitty.pending);
      const newDna = action.meta.arg;

      // listen for birth events until
      // matching kitten is found or an error
      const result = yield race({
        birth: call(
          dispatchKittenOnBirthEventMatch,
          (kitten) => kitten.genes === newDna
        ),
        error: take(createGen0Kitty.rejected),
      });

      // if successful update the gen 0 count
      if (result.birth) {
        yield put(getGen0KittyCount());
      }
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


export function* catSaga() {
  yield all([
    dispatchBirthEvent(),
    onGenZeroKitty(),
  ]);
}
