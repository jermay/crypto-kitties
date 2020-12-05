import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button, Alert, InputGroup, Form
} from 'react-bootstrap';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Service from '../js/service';
import { selectOfferByKittyId } from '../market/offerSlice';
import { sireOfferSelected } from '../breed/breedSlice';

const SELL_STATUS = {
  notForSale: 'Not For Sale',
  approvalRequired: 'Approval Required',
  setPrice: 'Set Price',
  sendingOffer: 'Sending Offer',
  offerCreated: 'Offer Created',
  cancellingOffer: 'Cancelling Offer',
  offerCancelled: 'Offer Cancelled',
  sendingBuyOffer: 'Sending Buy Offer',
  sold: 'Sold',
};

const KittyAlert = styled(Alert)`
  width: 19rem;
`;

const emptyMessage = {
  text: '',
  type: 'info',
};


export default function CatAction(props) {
  const {
    btnText,
    btnTextPlural,
    handleBackClicked,
    handleCreateOfferClicked,
    handleBuyOfferClicked,
    handleCancelOffer,
    kittyId,
  } = props;

  const dispatch = useDispatch();

  const user = useSelector((state) => state.wallet.account);
  const offer = useSelector((state) => selectOfferByKittyId(state, kittyId));
  const [sellStatus, setSellStatus] = useState(SELL_STATUS.notForSale);
  const [message, setMessage] = useState(emptyMessage);

  useEffect(() => {
    setMessage(emptyMessage);

    if (offer) {
      setSellStatus(SELL_STATUS.offerCreated);
    } else {
      setSellStatus(SELL_STATUS.setPrice);
    }
  }, [offer]);

  const [price, setPrice] = useState(undefined);
  const onPriceChange = (e) => setPrice(e.target.value);

  const onCreateOfferClicked = (event) => {
    event.preventDefault();
    handleCreateOfferClicked(price);
  };

  const onSireOfferClicked = () => {
    dispatch(sireOfferSelected(offer.tokenId));
  };


  let sellDisplay = null;
  switch (sellStatus) {
    case SELL_STATUS.setPrice: {
      sellDisplay = (
        <Form inline onSubmit={onCreateOfferClicked}>
          <InputGroup>
            <Form.Control
              style={{ width: '5rem', }}
              name="price"
              type="number"
              min={0}
              step={0.001}
              onChange={onPriceChange}
              placeholer="Set Price"
            />
          </InputGroup>
          <InputGroup.Append>
            <InputGroup.Text>ETH</InputGroup.Text>
            <Button type="submit">
              {btnText}
              Kitty
            </Button>
            <Button
              variant="secondary"
              onClick={handleBackClicked}
            >
              Back
            </Button>
          </InputGroup.Append>
        </Form>
      );
      break;
    }
    case SELL_STATUS.offerCreated: {
      if (!offer) {
        break;
      }
      const priceInEth = Service.web3.utils.fromWei(offer.price, 'ether');
      let sellButton;
      if (user !== offer.seller) {
        sellButton = offer.isSireOffer
          ? (
            <NavLink
              to="/breed"
              onClick={onSireOfferClicked}
              className="btn btn-primary nav-link"
            >
              Buy
            </NavLink>
          )
          : (
            <Button
              key="buy"
              variant="primary"
              className="ml-2"
              onClick={handleBuyOfferClicked}
            >
              Buy
            </Button>
          );
      } else {
        sellButton = (
          <Button
            key="cancel"
            variant="primary"
            className="ml-2"
            onClick={handleCancelOffer}
          >
            Cancel
          </Button>
        );
      }
      sellDisplay = (
        <div className="d-flex align-items-center">
          <span className="mr-2">
            {btnTextPlural}
            {' '}
            For:
            {' '}
            {priceInEth.toString(10)}
            {' '}
            ETH
          </span>
          {sellButton}
        </div>
      );
      break;
    }

    default:
      break;
  }

  return (
    <div className="mr-2">
      {sellDisplay}
      <KittyAlert
        variant={message.type}
        show={message.text.length > 0}
      >
        {message.text}
      </KittyAlert>
    </div>
  );
}

CatAction.propTypes = {
  btnText: PropTypes.string.isRequired,
  btnTextPlural: PropTypes.string.isRequired,
  handleBackClicked: PropTypes.func.isRequired,
  handleCreateOfferClicked: PropTypes.func.isRequired,
  handleBuyOfferClicked: PropTypes.func.isRequired,
  handleCancelOffer: PropTypes.func.isRequired,
  kittyId: PropTypes.string.isRequired,
};
