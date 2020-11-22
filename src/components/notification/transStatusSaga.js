import {
  take, fork, put, all, call, race
} from 'redux-saga/effects';
import { addKittyCreator, removeKittyCreator } from '../admin/kittyCreatorSlice';

import {
  breedKitties, createGen0Kitty, fetchKittiesForIds, getKitties
} from '../cat/catSlice';
import { RequestStatus } from '../js/utils';
import {
  buyKitty, buySireRites, getOffers, removeOffer, sellKitty, sireKitty
} from '../market/offerSlice';
import { connect, contractInitError } from '../wallet/walletSaga';
import { approveMarket, connectWallet } from '../wallet/walletSlice';
import { dismissTransStatus, newTransaction, updateTransStatus } from './transStatusSlice';

const messagesByAction = [
  {
    loadAction: connect,
    fulfilledAction: fetchKittiesForIds.fulfilled,
    rejectedActions: [
      connectWallet.rejected,
      contractInitError,
      fetchKittiesForIds.rejected,
      getKitties.rejected,
      getOffers.rejected
    ],
    pending: 'Retrieving kitties...',
  },
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
  },
  {
    prefix: addKittyCreator.typePrefix,
    pending: 'Adding new Kitty Creator...',
  },
  {
    prefix: removeKittyCreator.typePrefix,
    pending: 'Removing Kitty Creator...',
  }
];

const oops = 'Opps.. something went wrong';
const success = 'Success!';

function getErrorMessage(actionRejection) {
  // console.log('getErrorMessage::', actionRejection);
  let errMsg = oops;
  if (actionRejection.error) {
    errMsg = actionRejection.error.message;
  } else if (actionRejection.payload) {
    errMsg = actionRejection.payload.error
      ? actionRejection.payload.error.message
      : actionRejection.payload;
  }

  if (errMsg.match(/user denied transaction/i)) {
    return 'Cancelled by user';
  }

  return errMsg;
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
    const fulFilledActionType = actionMessage.prefix
      ? `${actionMessage.prefix}/fulfilled`
      : actionMessage.fulfilledAction;
    const rejectActionType = actionMessage.prefix
      ? `${actionMessage.prefix}/rejected`
      : actionMessage.rejectedActions;

    do {
      resultAction = yield race({
        fulfilled: take(fulFilledActionType),
        rejected: take(rejectActionType),
      });
      // console.log(resultAction);
    } while (!resultAction.rejected
    && id !== null
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
      const actionType = actionMessage.prefix
        ? `${actionMessage.prefix}/pending`
        : actionMessage.loadAction;

      const pendingAction = yield take(actionType);
      const id = pendingAction.meta
        ? pendingAction.meta.requestId
        : null;

      yield fork(onTransaction, id, actionMessage);
    }
  };
}

export default function* transStatusSaga() {
  yield all(messagesByAction.map(
    (actionMessage) => call(generateTransWatcher(actionMessage))
  ));
}
