import React from 'react';
import { useState } from 'react';
import { Button, Alert } from 'react-bootstrap';

import Offer from './Offer';
import { offerTypes } from '../js/kittyConstants';
import { useDispatch, useSelector } from 'react-redux';
import { selectOfferIdsByType } from './offerSlice';
import { approveMarket } from '../wallet/walletSlice';


// const emptyEventMessage = {
//     text: '',
//     type: 'info'
// }

export default function MarketPage() {
    const dispatch = useDispatch();

    const [currOfferType, setCurrOfferType] = useState(offerTypes.sell);
    // const [eventMessage, setEventMessage] = useState(emptyEventMessage);

    const isApproved = useSelector(state => state.wallet.isApproved);
    const offerIds = useSelector(state => selectOfferIdsByType(state, currOfferType));

    const onGiveApprovalClicked = async () => {
        dispatch(approveMarket());
    };

    const message = isApproved ?
        <p>Buy and sell kitties!</p>
        : <Alert variant="info" className="p-2">
            <p>You need to give the market permission to transfer your kitties</p>
            <Button onClick={onGiveApprovalClicked}>Yes, it's OK!</Button>
        </Alert>;


    const offerBoxes = offerIds.map(id =>
        <Offer key={id} tokenId={id} />
    );

    // <Alert
    //     variant={eventMessage.type}
    //     dismissible
    //     show={eventMessage.text.length > 0}>
    //     {eventMessage.text}
    // </Alert>

    return (
        <div>
            <h1>Kitty Marketplace</h1>
            <div>
                <Button
                    className="mr-2"
                    variation="info"
                    onClick={() => setCurrOfferType(offerTypes.sell)}
                    active={currOfferType === offerTypes.sell}>
                    Kitties For Sale
                </Button>
                <Button
                    variation="info"
                    onClick={() => setCurrOfferType(offerTypes.sire)}
                    active={currOfferType === offerTypes.sire}>
                    Sire Offers
                </Button>
            </div>
            {message}
            <div className="d-flex flex-wrap">
                {offerBoxes}
            </div>
        </div>
    )
}
