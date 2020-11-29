import { eventChannel } from 'redux-saga';
import {
  all, put, take,
} from 'redux-saga/effects';

import KittyService from '../js/kitty.service';
import Service from '../js/service';
import { kittyError } from '../cat/catSlice';
import { kittyCreatorAdded, kittyCreatorRemoved } from './kittyCreatorSlice';
import { contractInitSuccess } from '../wallet/walletSaga';

function createCreatorAddedEventChannel() {
  return eventChannel((emitter) => {
    const onEvent = (e) => {
      // console.log('kittyCreatorSaga:: creator added event', e);
      emitter(e);
    };

    Service.kitty.on(KittyService.eventNames.KittyCreatorAdded, onEvent);

    return () => Service.kitty.off(KittyService.eventNames.KittyCreatorAdded, onEvent);
  });
}

function createCreatorRemovedEventChannel() {
  return eventChannel((emitter) => {
    const onEvent = (e) => {
      // console.log('kittyCreatorSaga:: creator removed event', e);
      emitter(e);
    };

    Service.kitty.on(KittyService.eventNames.KittyCreatorRemoved, onEvent);

    return () => Service.kitty.off(KittyService.eventNames.KittyCreatorRemoved, onEvent);
  });
}


function* dispatchKittyCreatorEvent(channel, updateAction) {
  while (true) {
    try {
      const { creator, } = yield take(channel);
      yield put(updateAction(creator));
    } catch (err) {
      console.error(err);
      yield put(kittyError(err.message));
    }
  }
}


export default function* kittyCreatorSaga() {
  // watch for Kitty Creator events once kitty contract is initialized
  yield take(contractInitSuccess);

  yield all([
    dispatchKittyCreatorEvent(
      createCreatorAddedEventChannel(),
      kittyCreatorAdded
    ),
    dispatchKittyCreatorEvent(
      createCreatorRemovedEventChannel(),
      kittyCreatorRemoved
    ),
  ]);
}
