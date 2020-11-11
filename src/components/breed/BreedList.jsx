import React, { useState, useEffect, useCallback } from 'react';
import { PropTypes } from 'prop-types';
import {
  ButtonGroup, Button, Badge
} from 'react-bootstrap';
import { useSelector } from 'react-redux';
import moment from 'moment';

import CatBox from '../cat/CatBox';
import { CatModel } from '../js/catFactory';
import { selectKittyById } from '../cat/catSlice';
import { MediumCatContainer } from '../cat/CatBoxContainers';
import { ParentType } from './breedSlice';

export const BreedListType = {
  user: 'Your Kitties',
  sire: 'Buy Sire',
};

function useCurrentKitty(list, index) {
  const kittyId = list[index];
  const kitty = useSelector((state) => selectKittyById(state, kittyId));
  if (kitty) {
    return new CatModel(kitty);
  }
  return null;
}

export default function BreedList(props) {
  const {
    kittyIds,
    listType,
    handleOnSetParent,
  } = props;

  const [pageNum, setPageNum] = useState(0);
  const kittyModel = useCurrentKitty(kittyIds, pageNum);

  const isSireList = useCallback(
    () => listType === BreedListType.sire,
    [listType]
  );

  const isOnCoolDown = useCallback(
    () => {
      if (kittyModel) {
        const now = moment();
        const cooldownEnd = moment.unix(kittyModel.cat.cooldownEndTime);
        return now.isBefore(cooldownEnd);
      }

      return false;
    },
    [kittyModel]
  );

  const [onCooldown, setOnCooldown] = useState(isOnCoolDown());
  useEffect(() => {
    setOnCooldown(isOnCoolDown());
    let timer;
    if (isOnCoolDown()) {
      timer = setInterval(() => {
        setOnCooldown(isOnCoolDown());
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isOnCoolDown, onCooldown, kittyModel]);

  const prevDisabled = (pageNum === 0);
  const nextDisabled = (pageNum === (kittyIds.length - 1));

  const onPrevKittyClicked = () => {
    if (prevDisabled) {
      return;
    }
    const prev = pageNum - 1;
    setPageNum(prev);
    setOnCooldown(isOnCoolDown());
  };

  const onNextKittyClicked = () => {
    if (pageNum === (kittyIds.length - 1)) {
      return;
    }
    const next = pageNum + 1;
    setPageNum(next);
    setOnCooldown(isOnCoolDown());
  };

  let readyBadge = null;
  if (kittyModel) {
    readyBadge = onCooldown
      ? <Badge variant="secondary" className="mt-1">Not Ready</Badge>
      : <Badge variant="success" className="mt-1">Ready</Badge>;
  }

  return (
    <div className="d-flex flex-column align-items-center">
      <ButtonGroup>
        <Button
          variant="secondary"
          size="sm"
          disabled={prevDisabled}
          onClick={onPrevKittyClicked}
        >
          Prev Kitty
        </Button>
        <Button
          variant="info"
          size="sm"
          disabled={onCooldown || isSireList()}
          onClick={() => handleOnSetParent(
            kittyModel,
            ParentType.MUM
          )}
        >
          Set as Mum
        </Button>
        <Button
          variant="info"
          size="sm"
          disabled={onCooldown}
          onClick={() => handleOnSetParent(
            kittyModel,
            isSireList ? ParentType.SIRE : ParentType.DAD
          )}
        >
          Set as Dad
        </Button>
        <Button
          variant="secondary"
          size="sm"
          disabled={nextDisabled}
          onClick={onNextKittyClicked}
        >
          Next Kitty
        </Button>
      </ButtonGroup>
      {readyBadge}
      <MediumCatContainer>
        <CatBox model={kittyModel} />
      </MediumCatContainer>
    </div>
  );
}

BreedList.propTypes = {
  handleOnSetParent: PropTypes.func.isRequired,
  kittyIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  listType: PropTypes.string.isRequired,
};
