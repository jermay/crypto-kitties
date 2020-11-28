import React, { useState, useEffect, useCallback } from 'react';
import { PropTypes } from 'prop-types';
import {
  ButtonGroup, Button, Badge, Row
} from 'react-bootstrap';
import { useSelector } from 'react-redux';
import moment from 'moment';

import CatBox from '../cat/CatBox';
import { CatModel } from '../js/catFactory';
import { selectKittyById } from '../cat/catSlice';
import { MediumCatContainer } from '../cat/CatBoxContainers';
import { ParentType } from './breedSlice';
import { selectOfferByKittyId } from '../market/offerSlice';
import Service from '../js/service';

export const BreedListType = {
  user: 'Your Kitties',
  sire: 'Buy Sire',
};


function useCurrentKitty(list, index) {
  const kittyId = list[index];
  const kitty = useSelector((state) => selectKittyById(state, kittyId));
  const offer = useSelector((state) => selectOfferByKittyId(state, kittyId));

  return {
    kitty: kitty ? new CatModel(kitty) : null,
    offer,
  };
}

export default function BreedList(props) {
  const {
    kittyIds,
    listType,
    handleOnSetParent,
  } = props;

  const [pageNum, setPageNum] = useState(0);
  const model = useCurrentKitty(kittyIds, pageNum);

  useEffect(() => {
    // reset the page number when the list changes
    setPageNum(0);
  }, [listType]);

  const isSireList = useCallback(
    () => listType === BreedListType.sire,
    [listType]
  );

  const isOnCoolDown = useCallback(
    () => {
      if (model.kitty) {
        const now = moment();
        const cooldownEnd = moment.unix(model.kitty.cat.cooldownEndTime);
        return now.isBefore(cooldownEnd);
      }

      return false;
    },
    [model]
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
  }, [isOnCoolDown, onCooldown, model]);

  const readyStatus = {
    isReady: false,
    msg: '',
  };
  if (model.offer && listType !== BreedListType.sire) {
    readyStatus.msg = model.offer.isSireOffer
      ? 'Not Ready: Siring'
      : 'Not Ready: On Sale';
  } else if (onCooldown) {
    readyStatus.msg = 'Not Ready: On Cooldown';
  } else {
    readyStatus.isReady = true;
    readyStatus.msg = 'Ready';
  }

  const prevDisabled = (pageNum === 0);
  const nextDisabled = (pageNum >= (kittyIds.length - 1));

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
          disabled={!readyStatus.isReady || isSireList()}
          onClick={() => handleOnSetParent(
            model.kitty,
            ParentType.MUM
          )}
        >
          Set as Mum
        </Button>
        <Button
          variant="info"
          size="sm"
          disabled={!readyStatus.isReady}
          onClick={() => handleOnSetParent(
            model.kitty,
            isSireList() ? ParentType.SIRE : ParentType.DAD
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
      <Row>
        <span>{model.offer ? `${Service.web3.utils.fromWei(model.offer.price)} ETH ` : ''}</span>
        <Badge
          variant={readyStatus.isReady ? 'success' : 'secondary'}
          className="m-1"
        >
          {readyStatus.msg}
        </Badge>
      </Row>
      <MediumCatContainer>
        <CatBox model={model.kitty} />
      </MediumCatContainer>
    </div>
  );
}

BreedList.propTypes = {
  handleOnSetParent: PropTypes.func.isRequired,
  kittyIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  listType: PropTypes.string.isRequired,
};
