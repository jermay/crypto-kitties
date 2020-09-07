import React from 'react';
import { useState } from 'react';
import { Button, Alert, Form, InputGroup, Col } from 'react-bootstrap';
import { useEffect } from 'react';

import { Service } from '../js/service';
import styled from 'styled-components';

const SELL_STATUS = {
    notForSale: 'Not For Sale',
    approvalRequired: 'Approval Required',
    setPrice: 'Set Price',
    sendingOffer: 'Sending Offer',
    offerCreated: 'Offer Created',
    sold: 'Sold'
}

const KittyAlert = styled(Alert)`
    width: 19rem;
`;

const emptyMessage = {
    text: '',
    type: 'info'
}

export default function CatActions(props) {
    const { kittyId } = props;

    const [init, setInit] = useState(false);
    const [offer, setOffer] = useState(undefined);
    const [isApproved, setIsApproved] = useState(false);
    const [sellStatus, setSellStatus] = useState(SELL_STATUS.notForSale);
    const [price, setPrice] = useState(undefined);
    const [message, setMessage] = useState(emptyMessage);

    const onPriceChange = e => setPrice(e.target.value);

    useEffect(() => {
        setInit(true);
        if (!init) {
            const doInit = () => {
                Service.market.getOffer(kittyId)
                    .then(_offer => {
                        console.log('offer: ', _offer);
                        if (_offer) {
                            setOffer(_offer);
                            setSellStatus(SELL_STATUS.offerCreated);
                        }
                    });
                Service.market.isApproved()
                    .then(result => setIsApproved(result))
                    .catch(err => console.error(err));
            }
            doInit();
        }
    }, [init, kittyId])

    const onSellKittyClicked = () => {
        if (isApproved) {
            setSellStatus(SELL_STATUS.setPrice);
        } else {
            setSellStatus(SELL_STATUS.approvalRequired);
            setMessage({
                text: 'In order to sell your kitties you need to give the Marketplace permission to transfer your kitties on your behalf. This is required so the buyer and sellers do not need to be online at the same time.',
                type: 'info'
            });
        }
        console.log(sellStatus);
    };

    const onApproveClicked = async () => {
        Service.market.approve()
            .then(() => {
                setIsApproved(true);
                setSellStatus(SELL_STATUS.setPrice);
                setMessage(emptyMessage);
            })
            .catch(err => {
                displayError(err, 'Oops...There was a problem with the approval. Try again.');
            });
    }

    const onCreateOfferClicked = async (event) => {
        event.preventDefault();

        setSellStatus(SELL_STATUS.sendingOffer);
        setMessage({
            text: `Broadcasting sell offer of ${price} ETH for kitty #${kittyId}...`,
            type: 'info'
        });
        await Service.market.sellKitty(kittyId, price);
        const newOffer = await Service.market.getOffer(kittyId);

        if (newOffer) {
            console.log('newOffer: ', newOffer);
            setOffer(newOffer);
            setSellStatus(SELL_STATUS.offerCreated);
            setMessage(emptyMessage);
        } else {
            setSellStatus(SELL_STATUS.setPrice);
            displayError();
        }

        console.log(sellStatus);
    };

    const onCancelSaleClicked = async () => {
        const res = await Service.market.removeOffer(kittyId);
        if (res) {
            setSellStatus(SELL_STATUS.notForSale);
            setOffer(undefined);
        } else {
            displayError();
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
        case SELL_STATUS.notForSale:
            sellDisplay =
                <Button onClick={onSellKittyClicked}>
                    Sell
                </Button>
            break;

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
                            Sell Kitty
                        </Button>
                    </InputGroup.Append>
                </Form>
            break;

        case SELL_STATUS.offerCreated:
            const priceInEth = Service.web3.utils.fromWei(offer.price, 'ether');
            sellDisplay =
                <div>
                    <span>Selling For: {priceInEth.toString(10)} ETH</span>
                    <Button
                        variant="primary"
                        className="ml-2"
                        onClick={onCancelSaleClicked}>
                        Cancel
                    </Button>
                </div>
            break;

        default:
            break;
    }

    return (
        <Col>
            {sellDisplay}
            <KittyAlert variant={message.type}
                show={message.text.length > 0}>
                {message.text}
            </KittyAlert>
        </Col>
    )
}
