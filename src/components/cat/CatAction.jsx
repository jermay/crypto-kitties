import React from 'react';
import { useEffect, useState } from 'react';
import { Button, Alert, Badge, Form, InputGroup, Spinner } from 'react-bootstrap';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { Service } from '../js/service';
import { approveMarket } from '../wallet/walletSlice';
import { OfferStatus, selectOfferByKittyId } from '../market/offerSlice';
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
        handleBackClicked,
        handleCreateOfferClicked,
        handleBuyOfferClicked,
        handleCancelOffer,
        kittyId,
    } = props;

    const dispatch = useDispatch();

    const isApproved = useSelector(state => state.wallet.isApproved);
    const user = useSelector(state => state.wallet.account);
    const offer = useSelector(state => selectOfferByKittyId(state, kittyId));
    const [sellStatus, setSellStatus] = useState(SELL_STATUS.notForSale);
    const [message, setMessage] = useState(emptyMessage);

    useEffect(() => {
        setMessage(emptyMessage);

        if (!isApproved) {
            setSellStatus(SELL_STATUS.approvalRequired);
            setMessage({
                text: 'In order to sell your kitties you need to give the Marketplace permission to transfer your kitties on your behalf. This is required so the buyer and sellers do not need to be online at the same time.',
                type: 'info'
            });
            return;
        }

        if (!Boolean(offer)) {
            setSellStatus(SELL_STATUS.setPrice);
            return;
        }

        switch (offer.status) {
            case OfferStatus.sold:
                setSellStatus(SELL_STATUS.sold);
                break;

            case OfferStatus.cancelled:
                setSellStatus(SELL_STATUS.offerCancelled);
                break;

            default:
                setSellStatus(SELL_STATUS.offerCreated);
                break;
        }
    }, [isApproved, offer])

    const error = useSelector(state => state.offers.error);
    useEffect(() => {
        if (error) {
            setMessage({
                text: 'Oops... something went wrong.',
                type: 'warning'
            });
            console.error(error);
        } else {
            setMessage(emptyMessage);
        }
    }, [error]);

    // const displayError = (error, msg) => {
    //     if (error) {
    //         console.error(error);
    //     }
    //     setMessage({
    //         text: msg || 'Oops... something went wrong.',
    //         type: 'warning'
    //     });
    // };

    const [price, setPrice] = useState(undefined);
    const onPriceChange = e => setPrice(e.target.value);

    const onApproveClicked = () => {
        dispatch(approveMarket());
    }

    const onCreateOfferClicked = (event) => {
        event.preventDefault();
        handleCreateOfferClicked(price);
    };
   
    const onSireOfferClicked = () => {
        dispatch(sireOfferSelected(offer.tokenId));
    }


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
                            onClick={handleBackClicked}>
                            Back
                        </Button>
                    </InputGroup.Append>
                </Form>
            break;

        case SELL_STATUS.offerCreated:
            if (!Boolean(offer)) {
                break;
            }
            const priceInEth = Service.web3.utils.fromWei(offer.price, 'ether');
            let sellButton;
            if (user !== offer.seller) {
                sellButton = offer.isSireOffer ?
                    <NavLink
                        to={`/breed`}
                        onClick={onSireOfferClicked}
                        className="btn btn-primary nav-link">
                        Buy
                    </NavLink>
                    : <Button
                        key="buy"
                        variant="primary"
                        className="ml-2"
                        onClick={handleBuyOfferClicked}>
                        Buy
                    </Button>
            } else {
                sellButton = <Button
                    key="cancel"
                    variant="primary"
                    className="ml-2"
                    onClick={handleCancelOffer}>
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
