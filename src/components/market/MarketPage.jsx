import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { Button, Alert } from 'react-bootstrap';

import { Service } from '../js/service';
import Offer from './Offer';


const emptyEventMessage = {
    text: '',
    type: 'info'
}

export default function MarketPage() {
    const [init, setInit] = useState(false);
    const [isApproved, setIsApproved] = useState(false);
    const [offers, setOffers] = useState([]);
    const [eventMessage, setEventMessage] = useState(emptyEventMessage);

    useEffect(() => {
        if (!init) {
            setInit(true);
            Service.market.marketSubscriptions.push(onMarketEvent);
            Service.market.getAllTokenOnSale()
                .then(results => {
                    console.log('market offers loaded', results);
                    setOffers(results);
                });
            Service.market.isApproved()
                .then(result => {
                    console.log(`market is ${result ? "already" : "NOT"} approved!`);
                    setIsApproved(result);
                });
        }
    }, [init])

    const onMarketEvent = (event) => {
        // event MarketTransaction(string TxType, address owner, uint256 tokenId);
        // for some reason the offers state var is empty when this is called
        console.log('Market Event: ', event, 'current offers: ', offers);

        switch (event.TxType) {
            case 'Buy':
                setEventMessage({
                    text: `Kitty #${event.tokenId} was purchased!`,
                    type: 'success'
                });
                // removeSoldKitty(event.tokenId);
                break;

            case 'Create':
                setEventMessage({
                    text: `Kitty #${event.tokenId} was put on sale!`,
                    type: 'primary'
                });
                addKittyOnSale(event.tokenId);
                break;

            default:
                break;
        }
    }

    // const findOffer = kittyId => {
    //     console.log('find offer > kittyId: ', kittyId, 'in offers: ', offers);
    //     return offers.findIndex(
    //         offer => offer.tokenId === kittyId
    //     );
    // }

    const addKittyOnSale = async (kittyId) => {
        // get new offer
        const newOffer = await Service.market.getOffer(kittyId);

        // update the state with new offer
        const newList = offers.slice();
        newList.push(newOffer);
        setOffers(newList);
    };

    /* const removeSoldKitty = (kittyId) => {
        // find old offer
        const i = findOffer(kittyId);
        if (i < 0) {
            console.error(`Offer for sold kitty #${kittyId} not found!`);
            return;
        }

        // remove old offer from state
        const newList = offers.slice();
        newList.splice(i, 1);
        setOffers(newList);
    }; */

    const onGiveApprovalClicked = async () => {
        Service.market.approve()
            .then(() => {
                console.log('Marketplace is now approved operator');
                setIsApproved(true);
            })
            .catch(err => console.log(err));
    };

    const message = isApproved ?
        <p>Buy and sell kitties!</p>
        : <Alert variant="info" className="p-2">
            <p>You need to give the market permission to transfer your kitties</p>
            <Button onClick={onGiveApprovalClicked}>Yes, it's OK!</Button>
        </Alert>;


    const offerBoxes = offers.map(offer =>
        <Offer key={offer.tokenId} offer={offer} />
    );

    return (
        <div>
            <h1>Kitty Marketplace</h1>
            <Alert
                variant={eventMessage.type}
                dismissible
                show={eventMessage.text.length > 0}>
                {eventMessage.text}
            </Alert>
            {message}
            <div>
                {offerBoxes}
            </div>
        </div>
    )
}
