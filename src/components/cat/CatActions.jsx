import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Row } from 'react-bootstrap';

import CatAction from './CatAction';
import { offerTypes } from '../js/kittyConstants';
import { selectOfferByKittyId, sellKitty, sireKitty } from '../market/offerSlice';
import { buyOffer, cancelOffer } from '../market/offerSaga';


export default function CatActions(props) {
  const { kittyId, isBuyMode, } = props;

  const dispatch = useDispatch();

  const [offerType, setOfferType] = useState(undefined);
  const offer = useSelector((state) => selectOfferByKittyId(state, kittyId));
  useEffect(() => {
    if (offer) {
      const theOfferType = offer.isSireOffer
        ? offerTypes.sire : offerTypes.sell;
      setOfferType(theOfferType);
    }
  }, [offer, offerType]);


  const createSaleOffer = async (price) => dispatch(sellKitty({ kittyId, price, }));
  const createSireOffer = async (price) => dispatch(sireKitty({ kittyId, price, }));
  const handleCancelOffer = async () => dispatch(cancelOffer({ kittyId, }));
  const handleBuyKittyClicked = async () => dispatch(buyOffer({ offer, }));
  const handleBackClicked = () => setOfferType(undefined);

  // sire offers handled in the breed page
  // by navigating there with the sireId as a query param
  const handleBuySireOfferClicked = async () => Promise.resolve(true);


  let action;
  switch (offerType) {
    case offerTypes.sell:
      action = (
        <CatAction
          offer={offer}
          btnText="Sell"
          btnTextPlural="Selling"
          isBuyMode={isBuyMode}
          kittyId={kittyId}
          handleBackClicked={handleBackClicked}
          handleCreateOfferClicked={createSaleOffer}
          handleBuyOfferClicked={handleBuyKittyClicked}
          handleCancelOffer={handleCancelOffer}
        />
      );
      break;

    case offerTypes.sire:
      action = (
        <CatAction
          offer={offer}
          btnText="Sire"
          btnTextPlural="Siring"
          isBuyMode={isBuyMode}
          kittyId={kittyId}
          handleBackClicked={handleBackClicked}
          handleCreateOfferClicked={createSireOffer}
          handleBuyOfferClicked={handleBuySireOfferClicked}
          handleCancelOffer={handleCancelOffer}
        />
      );
      break;

    default:
      action = Object.keys(offerTypes).map((keyName) => (
        <Button
          key={keyName}
          className="mr-2"
          onClick={() => setOfferType(offerTypes[keyName])}
        >
          {offerTypes[keyName]}
        </Button>
      ));
      break;
  }

  return (
    <Row className="pl-4">
      {action}
    </Row>
  );
}

CatActions.propTypes = {
  kittyId: PropTypes.string.isRequired,
  isBuyMode: PropTypes.bool.isRequired,
};
