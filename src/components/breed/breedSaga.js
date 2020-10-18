import { createAction } from "@reduxjs/toolkit";
import { all, fork, put, select, take } from "redux-saga/effects";
import { breedKitties, fetchKitty, kittenBorn } from "../cat/catSlice";
import { selectParentIds, breedError, breedProgress, BreedProgress, kittenBredEvent, setParent } from './breedSlice';
import { dispatchKittenOnBirthEventMatch } from '../cat/catSaga';

export const approveParent = createAction(
    'breed/approveParent',
    ({ parentId, parentType }) => {
        return { payload: { parentId, parentType } }
    }
);
export const parentApproved = createAction('breed/parentApproved');

export const breed = createAction(
    'kitties/breed',
    ({ mumId, dadId }) => {
        return { payload: { mumId, dadId } }
    }
);



export function* breedSaga() {
    yield all([
        validateParent(),
        onBreed()
    ]);
}

function* validateParent() {
    while (true) {
        try {
            const action = yield take(approveParent);
            const { parentId, parentType } = action.payload;

            let currentParents = yield select(selectParentIds);

            // approved if no current parent of that type
            // or different than the current
            if (isDifferent(parentId, currentParents)) {
                yield put(setParent({ parentId, parentType }));

            } else {
                yield put(breedProgress(BreedProgress.ERROR_SAME_PARENT));
            }

            // ready to breed if both parents now selected
            currentParents = yield select(selectParentIds);
            if (setReady(currentParents)) {
                yield put(breedProgress(BreedProgress.READY));
            }

        } catch (err) {
            console.error(err);
            yield put(breedError(err.message));
        }
    }
}

function isDifferent(parentId, currentParents) {
    // must be different than both current parents
    return parentId !== currentParents.mumId &&
        parentId !== currentParents.dadId;
}

function setReady(currentParents) {
    // both parents are defined
    // don't set if progress was already ready
    return currentParents.progress !== BreedProgress.READY &&
        Boolean(currentParents.mumId) &&
        Boolean(currentParents.dadId);
}

function* onBreed() {
    while (true) {
        const breedAction = yield take(breed);
        const { mumId, dadId } = breedAction.payload;

        // listen for birth events until kitten with
        // this mum and dad are born
        yield fork(
            dispatchKittenOnBirthEventMatch,
            kitten => kitten.mumId === mumId &&
                kitten.dadId === dadId
        );

        yield put(breedKitties(breedAction.payload));

        const { kittenAction } = yield all({
            fulfilled: take(breedKitties.fulfilled),
            kittenAction: take(kittenBorn)
        });

        // update parent cooldowns after breeding
        yield all([
            put(kittenBredEvent(kittenAction.payload.kittyId)),
            put(fetchKitty(mumId)),
            put(fetchKitty(dadId)),
        ]);
    }
}

