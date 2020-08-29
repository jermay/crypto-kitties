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
            setMessage('In order to sell your kitties you need to give the Marketplace permission to transfer your kitties on your behalf. This is required so the buyer and sellers do not need to be online at the same time.');
        }
        console.log(sellStatus);
    };

    const onApproveClicked = async () => {
        Service.market.approve()
            .then(() => {
                setIsApproved(true);
                setSellStatus(SELL_STATUS.setPrice);
                setMessage('');
            })
            .catch(err => {
                setMessage('Oops...There was a problem with the approval. Try again.');
                console.error(err);
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
            setMessage({
                text: 'Oops... something went wrong.',
                type: 'warning'
            });
        }

        console.log(sellStatus);
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
                <span>Selling For: {priceInEth.toString(10)} ETH</span>
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
