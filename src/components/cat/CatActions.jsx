import React from 'react';
import { useState } from 'react';
import { Button, Row } from 'react-bootstrap';
import { useEffect } from 'react';

import { Service } from '../js/service';
import CatAction from './CatAction';
import { offerTypes } from '../js/kittyConstants';


export default function CatActions(props) {
    const { kittyId, isBuyMode } = props;

    const [init, setInit] = useState(false);
    const [offer, setOffer] = useState(undefined);
    const [offerType, setOfferType] = useState(undefined);
    const [isApproved, setIsApproved] = useState(false);

    useEffect(() => {
        setInit(true);
        if (!init) {
            const doInit = () => {
                Service.market.getOffer(kittyId)
                    .then(_offer => {
                        console.log('offer: ', _offer);
                        setOffer(_offer);
                        if (!Boolean(_offer)) {
                            return;
                        }
                        _offer.isSireOffer ?
                            setOfferType(offerTypes.sire)
                            : setOfferType(offerTypes.sell);
                    });
                Service.market.isApproved()
                    .then(result => setIsApproved(result))
                    .catch(err => console.error(err));
            }
            doInit();
        }
    }, [init, kittyId])

    const handleApproveClicked = async () => {
        try {
            await Service.market.approve();
            setIsApproved(true);
            return true;
        } catch (err) {
            setIsApproved(false);
        }
        return false;
    }

    const createSaleOffer = async (price) => {
        await Service.market.sellKitty(kittyId, price);
        const newOffer = await Service.market.getOffer(kittyId);
        setOffer(newOffer);

        return newOffer;
    };

    const createSireOffer = async (price) => {
        await Service.market.setSireOffer(kittyId, price);
        const newOffer = await Service.market.getOffer(kittyId);
        setOffer(newOffer);

        return newOffer;
    }

    const handleCancelOffer = async () => {
        const result = await Service.market.removeOffer(kittyId);
        if (result) {
            setOffer(undefined);
            setOfferType(undefined);
        }
        return result;
    }

    const handleBuyKittyClicked = async () => {
        return Service.market.buyKitty(offer);
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
                isApproved={isApproved}
                isBuyMode={isBuyMode}
                kittyId={kittyId}
                handleApproveClicked={handleApproveClicked}
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
                isApproved={isApproved}
                isBuyMode={isBuyMode}
                kittyId={kittyId}
                handleApproveClicked={handleApproveClicked}
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
