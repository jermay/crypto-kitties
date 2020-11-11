import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Alert, ButtonGroup } from 'react-bootstrap';

import Offer from './Offer';
import { offerTypes } from '../js/kittyConstants';
import { OfferEventDismiss, selectOfferIdsByType } from './offerSlice';
import { approveMarket } from '../wallet/walletSlice';
import { MarketTransType } from './offerSaga';


// const emptyEventMessage = {
//     text: '',
//     type: 'info'
// }

export default function MarketPage() {
  const dispatch = useDispatch();

  const [currOfferType, setCurrOfferType] = useState(offerTypes.sell);
  // const [eventMessage, setEventMessage] = useState(emptyEventMessage);

  const isApproved = useSelector((state) => state.wallet.isApproved);
  const offerIds = useSelector((state) => selectOfferIdsByType(state, currOfferType));

  const onGiveApprovalClicked = async () => {
    dispatch(approveMarket());
  };

  const message = isApproved
    ? <p>Buy and sell kitties!</p>
    : (
      <Alert variant="info" className="p-2">
        <p>You need to give the market permission to transfer your kitties</p>
        <Button onClick={onGiveApprovalClicked}>
          Yes, it
          {'\''}
          s OK!
        </Button>
      </Alert>
    );


  const eventData = useSelector((state) => state.offers.event);
  let eventAlert = null;
  if (eventData) {
    let msg = '';
    switch (eventData.TxType) {
      case MarketTransType.sellOfferPurchased:
        msg = `Successfully purchased kitty #${eventData.tokenId}`;
        break;
      case MarketTransType.offerCancelled:
        msg = `Offer for kitty #${eventData.tokenId} cancelled!`;
        break;
      default:
        msg = `${eventData.TxType} kitty #${eventData.tokenId}`;
    }
    eventAlert = (
      <Alert
        variant="info"
        dismissible
        show={Boolean(eventData)}
        onClose={() => dispatch(OfferEventDismiss())}
      >
        {msg}
      </Alert>
    );
  }

  const offerBoxes = offerIds.map((id) => <Offer key={id} tokenId={id} />);


  return (
    <div>
      <h1>Kitty Marketplace</h1>
      {message}
      {eventAlert}
      <ButtonGroup className="mb-2">
        <Button
          variant={currOfferType === offerTypes.sell ? 'primary' : 'light'}
          onClick={() => setCurrOfferType(offerTypes.sell)}
        >
          Kitties For Sale
        </Button>
        <Button
          variant={currOfferType === offerTypes.sire ? 'primary' : 'light'}
          onClick={() => setCurrOfferType(offerTypes.sire)}
        >
          Sire Offers
        </Button>
      </ButtonGroup>
      <div className="d-flex flex-wrap">
        {offerBoxes}
      </div>
    </div>
  );
}
