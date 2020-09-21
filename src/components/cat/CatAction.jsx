import React from 'react';
import { useState } from 'react';
import { Button, Alert, Badge, Form, InputGroup } from 'react-bootstrap';

import { Service } from '../js/service';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

const SELL_STATUS = {
    notForSale: 'Not For Sale',
    approvalRequired: 'Approval Required',
    setPrice: 'Set Price',
    sendingOffer: 'Sending Offer',
    offerCreated: 'Offer Created',
    cancellingOffer: 'Cancelling Offer',
    offerCancelled: 'Offer Cancelled',
    sendingBuyOffer: 'Sending Buy Offer',
    sold: 'Sold'
}

const KittyAlert = styled(Alert)`
    width: 19rem;
`;

const emptyMessage = {
    text: '',
    type: 'info'
}


export default function CatAction(props) {
    const {
        btnText,
        btnTextPlural,
        handleApproveClicked,
        handleBackClicked,
        handleCreateOfferClicked,
        handleBuyOfferClicked,
        handleCancelOffer,
        isApproved,
        isBuyMode,
        kittyId,
        offer,
    } = props;

    let initSellStatus = SELL_STATUS.setPrice;
    let initialMessage = emptyMessage;
    if (Boolean(offer)) {
        initSellStatus = SELL_STATUS.offerCreated;
    } else if (!isApproved) {
        initSellStatus = SELL_STATUS.approvalRequired;
        initialMessage = {
            text: 'In order to sell your kitties you need to give the Marketplace permission to transfer your kitties on your behalf. This is required so the buyer and sellers do not need to be online at the same time.',
            type: 'info'
        }
    }

    const [sellStatus, setSellStatus] = useState(initSellStatus);
    const [price, setPrice] = useState(undefined);
    const [message, setMessage] = useState(initialMessage);

    const onPriceChange = e => setPrice(e.target.value);

    const onApproveClicked = async () => {
        try {
            const result = await handleApproveClicked();
            if (result) {
                setSellStatus(SELL_STATUS.setPrice);
                setMessage(emptyMessage);
            } else {
                displayError(null, 'Approval rejected. Try again.');
            }
        } catch (err) {
            displayError(err, 'Oops...There was a problem with the approval. Try again.');
        }
    }

    const onCreateOfferClicked = async (event) => {
        event.preventDefault();

        setSellStatus(SELL_STATUS.sendingOffer);
        setMessage({
            text: `Broadcasting ${btnText} offer of ${price} ETH for kitty #${kittyId}...`,
            type: 'info'
        });
        try {
            const newOffer = await handleCreateOfferClicked(price);

            if (newOffer) {
                setSellStatus(SELL_STATUS.offerCreated);
                setMessage(emptyMessage);
            } else {
                setSellStatus(SELL_STATUS.setPrice);
                displayError();
            }
        }
        catch (err) {
            setSellStatus(SELL_STATUS.setPrice);
            displayError(err);
        }
    };

    const onCancelSaleClicked = async () => {
        const result = await handleCancelOffer();
        if (result) {
            setSellStatus(SELL_STATUS.setPrice);
        } else {
            displayError();
        }
    }

    const onBackClicked = () => {
        handleBackClicked();
    }

    const onBuyOfferClicked = async () => {
        console.log('onBuyOfferClicked');
        setMessage({
            text: `Broadcasting offer for #${kittyId}...`,
            type: 'info'
        });
        setSellStatus(SELL_STATUS.sendingBuyOffer);

        const result = await handleBuyOfferClicked();

        if (result) {
            setSellStatus(SELL_STATUS.sold);
            setMessage(emptyMessage);
        } else {
            setSellStatus(SELL_STATUS.offerCreated);
            setMessage({
                text: 'Oops... something went wrong',
                type: 'warning'
            });
        }
    }

    const displayError = (error, msg) => {
        if (error) {
            console.error(error);
        }
        setMessage({
            text: msg || 'Oops... something went wrong.',
            type: 'warning'
        });
    };

    let sellDisplay = null;
    switch (sellStatus) {
        case SELL_STATUS.approvalRequired:
            sellDisplay =
                <Button onClick={onApproveClicked}>
                    YES. It's OK. You are approved!
                </Button>
            break;

        case SELL_STATUS.setPrice:
            sellDisplay =
                <Form inline onSubmit={onCreateOfferClicked}>
                    <InputGroup>
                        <Form.Control style={{ width: '5rem' }}
                            name="price"
                            type="number"
                            min={0}
                            step={0.001}
                            onChange={onPriceChange}
                            placeholer="Set Price" />
                    </InputGroup>
                    <InputGroup.Append>
                        <InputGroup.Text>ETH</InputGroup.Text>
                        <Button type="submit">
                            {btnText} Kitty
                        </Button>
                        <Button variant="secondary"
                            onClick={onBackClicked}>
                            Back
                        </Button>
                    </InputGroup.Append>
                </Form>
            break;

        case SELL_STATUS.offerCreated:
            if (!offer) {
                break;
            }
            const priceInEth = Service.web3.utils.fromWei(offer.price, 'ether');
            let sellButton;
            if (Service.kitty.user != offer.seller) {
                sellButton = offer.isSireOffer ?
                    <NavLink
                        to={`/breed?sireId=${offer.tokenId}`}
                        className="btn btn-primary nav-link">
                        Buy
                    </NavLink>
                    : <Button
                        key="buy"
                        variant="primary"
                        className="ml-2"
                        onClick={onBuyOfferClicked}>
                        Buy
                    </Button>
            } else {
                sellButton = <Button
                    key="cancel"
                    variant="primary"
                    className="ml-2"
                    onClick={onCancelSaleClicked}>
                    Cancel
                    </Button>
            }
            sellDisplay =
                <div className="d-flex align-items-center">
                    <span className="mr-2">{btnTextPlural} For: {priceInEth.toString(10)} ETH</span>
                    {sellButton}
                </div>
            break;

        case SELL_STATUS.cancellingOffer:
        case SELL_STATUS.offerCancelled:
        case SELL_STATUS.sendingBuyOffer:
            break;

        case SELL_STATUS.sold:
            sellDisplay =
                <h3>
                    <Badge variant="success">SOLD!</Badge>
                </h3>
            break;

        default:
            break;
    }

    return (
        <div className="mr-2">
            {sellDisplay}
            <KittyAlert variant={message.type}
                show={message.text.length > 0}>
                {message.text}
            </KittyAlert>
        </div>
    )

}