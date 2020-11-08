import {
  take, fork, put, all, call, race
} from 'redux-saga/effects';

import { breedKitties, createGen0Kitty } from '../cat/catSlice';
import { RequestStatus } from '../js/utils';
import {
  buyKitty, buySireRites, removeOffer, sellKitty, sireKitty
} from '../market/offerSlice';
import { approveMarket } from '../wallet/walletSlice';
import { dismissTransStatus, newTransaction, updateTransStatus } from './transStatusSlice';

const messagesByAction = [
  {
    prefix: approveMarket.typePrefix,
    pending: 'Sending market approval...',
  },
  {
    prefix: breedKitties.typePrefix,
    pending: 'Privacy mode engaged...',
  },
  {
    prefix: createGen0Kitty.typePrefix,
    pending: 'Creating gen 0 kitty...',
  },
  {
    prefix: sellKitty.typePrefix,
    pending: 'Creating sell offer...',
  },
  {
    prefix: buyKitty.typePrefix,
    pending: 'Buying kitty...',
  },
  {
    prefix: sireKitty.typePrefix,
    pending: 'Creating sire offer...',
  },
  {
    prefix: buySireRites.typePrefix,
    pending: 'Kittes getting to know each other...',
  },
  {
    prefix: removeOffer.typePrefix,
    pending: 'Cancelling offer...',
  }
];

const oops = 'Opps.. something went wrong';
const success = 'Success!';

function getErrorMessage(actionRejection) {
  const errMsg = actionRejection.error.message;

  if (errMsg.match(/user denied transaction/i)) {
    return 'Cancelled by user';
  }

  return oops;
}

function* onTransaction(id, actionMessage) {
  const successMessage = actionMessage.fulfilled || success;

  try {
    // notify user of a new transaction
    yield put(newTransaction(id, actionMessage.pending));

    // keep looking for a fulfilled action
    // with the correct transaction id
    // unless an error occurs
    let resultAction;
    do {
      resultAction = yield race({
        fulfilled: take(`${actionMessage.prefix}/fulfilled`),
        rejected: take(`${actionMessage.prefix}/rejected`),
      });
      // console.log(resultAction);
    } while (!resultAction.rejected
      && resultAction.fulfilled.meta.requestId !== id);

    if (resultAction.fulfilled) {
      // found matching trans; notify success
      yield put(updateTransStatus(
        id, successMessage, RequestStatus.succeeded
      ));
      yield put(dismissTransStatus(id));
    } else {
      const errorMessage = getErrorMessage(resultAction.rejected);
      yield put(updateTransStatus(
        id, errorMessage, RequestStatus.failed
      ));
    }
  } catch (err) {
    console.error(err);
    yield put(updateTransStatus(
      id, oops, RequestStatus.failed
    ));
  }
}

function generateTransWatcher(actionMessage) {
  return function* watchForAction() {
    while (true) {
      const pendingAction = yield take(`${actionMessage.prefix}/pending`);
      const id = pendingAction.meta.requestId;

      yield fork(onTransaction, id, actionMessage);
    }
  };
}

export default function* transStatusSaga() {
  yield all(messagesByAction.map(
    (actionMessage) => call(generateTransWatcher(actionMessage))
  ));
}
