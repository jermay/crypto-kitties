import React, { useState } from 'react'
import CatBox from '../cat/CatBox'
import { Button, Alert, Badge } from 'react-bootstrap'
import styled from 'styled-components';

import { CatModel } from '../js/catFactory'
import { Service } from '../js/service';
import CatAction from '../cat/CatAction';
import CatActions from '../cat/CatActions';


const emptyMessage = {
    text: '',
    type: 'info'
};

const OFFER_STATUS = {
    onSale: 'On Sale',
    purchasing: 'Purchasing',
    sold: 'Sold',
    cancelling: 'Cacelling',
    cancelled: 'Cancelled'
};

const KittyAlert = styled(Alert)`
    width: 19rem;
`;

export default function Offer(props) {
    const { offer } = props;
    const model = new CatModel(offer.kitty);
    
    /*
    const [message, setMessage] = useState(emptyMessage);
    const [status, setStatus] = useState(OFFER_STATUS.onSale);

    const model = new CatModel(offer.kitty);
    const price = Service.web3.utils.fromWei(offer.price, 'ether');

    const onAlertClosed = () => {
        setMessage(emptyMessage);
    };

    const onBuyClicked = async () => {
        setMessage(emptyMessage);
        
        const result = await Service.market.buyKitty(offer);
        if (result) {
            setStatus(OFFER_STATUS.sold);
        } else {
            setMessage({
                text: 'Oops... something went wrong',
                type: 'warning'
            });
        }
    };

    const onCancelClicked = async () => {
        setMessage(emptyMessage);

        const result = await Service.market
            .removeOffer(offer.tokenId);
        if (result) {
            setStatus(OFFER_STATUS.cancelled);
            setMessage({
                text: 'Sale cancelled',
                type: 'info'
            });
        } else {
            setMessage({
                text: 'Oops... something went wrong',
                type: 'warning'
            });
        }
    };

    let content;
    switch (status) {
        case OFFER_STATUS.onSale:
            const onSaleAction = (offer.seller === Service.market.user) ?
                <Button className="ml-2"
                    onClick={onCancelClicked}>
                    Cancel
                </Button>
                :
                <Button className="ml-2"
                    onClick={onBuyClicked}>
                    Buy
                </Button>

            content =
                <React.Fragment>
                    <span>Price: {price} ETH</span>
                    {onSaleAction}
                </React.Fragment>
            break;

        case OFFER_STATUS.sold:
            content =
                <h3>
                    <Badge variant="success">SOLD!</Badge>
                </h3>
            break;

        default:
            break;
    }
    <div>
                {content}
                <KittyAlert
                    variant={message.type}
                    dismissible
                    onClose={onAlertClosed}
                    show={message.text.length > 0}>
                    {message.text}
                </KittyAlert>
            </div>
    */

    return (
        <div>
            <CatActions
                kittyId={offer.tokenId}
                isBuyMode={true}
            />
            <CatBox model={model} />
        </div>
    )
}
