import React from 'react';
import { useState } from 'react';
import { Button, Row } from 'react-bootstrap';
import { useEffect } from 'react';

import CatAction from './CatAction';
import { offerTypes } from '../js/kittyConstants';
import { useDispatch, useSelector } from 'react-redux';
import { selectOfferByKittyId, sellKitty, sireKitty } from '../market/offerSlice';
import { buyOffer, cancelOffer } from '../market/offerSaga';


export default function CatActions(props) {
    const { kittyId, isBuyMode } = props;

    const dispatch = useDispatch();

    const [offerType, setOfferType] = useState(undefined);
    const offer = useSelector(state => selectOfferByKittyId(state, kittyId));
    useEffect(() => {
        if (Boolean(offer)) {
            const _offerType = offer.isSireOffer ?
                offerTypes.sire : offerTypes.sell;
            setOfferType(_offerType);
        }
    }, [offer, offerType]);


    const createSaleOffer = async (price) => {
        return dispatch(sellKitty({kittyId, price}));
    };

    const createSireOffer = async (price) => {
        return dispatch(sireKitty({kittyId, price}));
    }

    const handleCancelOffer = async () => {
        return dispatch(cancelOffer({kittyId}));
    }

    const handleBuyKittyClicked = async () => {
        return dispatch(buyOffer({offer}));
    };

    const handleBuySireOfferClicked = async () => {
        // sire offers handled in the breed page
        // by navigating there with the sireId as a query param
        return Promise.resolve(true);
    }

    const handleBackClicked = () => {
        setOfferType(undefined);
    }

    let action;
    switch (offerType) {
        case offerTypes.sell:
            action = <CatAction
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
            break;

        case offerTypes.sire:
            action = <CatAction
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
            break;

        default:
            action = Object.keys(offerTypes).map(keyName =>
                <Button
                    key={keyName}
                    className="mr-2"
                    onClick={() => setOfferType(offerTypes[keyName])}>
                    {offerTypes[keyName]}
                </Button>
            );
            break;
    }

    return (
        <Row className="pl-4">
            {action}
        </Row>
    )
}
