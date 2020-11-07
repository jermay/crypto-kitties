import React, { useState, useEffect, useCallback } from 'react';
import { PropTypes } from 'prop-types';

import moment from 'moment';

import {
  ButtonGroup, Button, Spinner, Badge
} from 'react-bootstrap';
import { useSelector } from 'react-redux';
import CatBox from '../cat/CatBox';
import { CatModel } from '../js/catFactory';
import { selectKittiesByOwner } from '../cat/catSlice';
import { MediumCatContainer } from '../cat/CatBoxContainers';

export default function BreedList(props) {
  const { handleOnSetParent, sireId, } = props;

  const wallet = useSelector((state) => state.wallet);
  const list = useSelector((state) => selectKittiesByOwner(state, wallet.account));

  const [pageNum, setPageNum] = useState(0);
  const [kittyModel, setKittyModel] = useState({ value: null, });

  useEffect(() => {
    if (list.length) {
      const model = new CatModel(list[pageNum]);
      setKittyModel({ value: model, });
    }
  }, [list, pageNum]);

  const isOnCoolDown = useCallback(
    () => {
      if (kittyModel.value) {
        const now = moment();
        const cooldownEnd = moment.unix(kittyModel.value.cat.cooldownEndTime);
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


  if (!kittyModel.value) {
    // kitties still loading, show spinner
    return <Spinner animation="grow" variant="success" />;
  }


  const prevDisabled = (pageNum === 0);
  const nextDisabled = (pageNum === (list.length - 1));

  const onPrevKittyClicked = () => {
    if (prevDisabled) {
      return;
    }
    const prev = pageNum - 1;
    setPageNum(prev);
    setOnCooldown(isOnCoolDown());
  };

  const onNextKittyClicked = () => {
    if (pageNum === (list.length - 1)) {
      return;
    }
    const next = pageNum + 1;
    setPageNum(next);
    setOnCooldown(isOnCoolDown());
  };

  return (
    <div>
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
            disabled={onCooldown}
            onClick={() => handleOnSetParent(kittyModel.value, 'mum')}
          >
            Set as Mum
          </Button>
          <Button
            variant="info"
            size="sm"
            disabled={onCooldown || Boolean(sireId)}
            onClick={() => handleOnSetParent(kittyModel.value, 'dad')}
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
        {onCooldown
          ? <Badge variant="secondary" className="mt-1">Not Ready</Badge>
          : <Badge variant="success" className="mt-1">Ready</Badge>}
        <MediumCatContainer>
          <CatBox model={kittyModel.value} />
        </MediumCatContainer>
      </div>
    </div>
  );
}

BreedList.propTypes = {
  handleOnSetParent: PropTypes.func.isRequired,
  sireId: PropTypes.number,
};
