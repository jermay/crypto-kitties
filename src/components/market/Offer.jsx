import React, { useState } from 'react'
import CatBox from '../cat/CatBox'
import { Button, Alert, Badge } from 'react-bootstrap'
import styled from 'styled-components';

import { CatModel } from '../js/catFactory'
import { Service } from '../js/service';


const emptyMessage = {
    text: '',
    type: 'info'
}

const KittyAlert = styled(Alert)`
    width: 19rem;
`;

export default function Offer(props) {
    const { offer } = props;
    const [message, setMessage] = useState(emptyMessage);
    const [isSold, setIsSold] = useState(false);

    const model = new CatModel(offer.kitty);
    const price = Service.web3.utils.fromWei(offer.price, 'ether');

    const onBuyClicked = async () => {
        const result = await Service.market.buyKitty(offer);
        if (result) {
            setIsSold(true);
        } else {
            setMessage({
                text: 'Oops... something went wrong',
                type: 'warning'
            });
        }
    };

    const content = isSold ?
        <h3>
            <Badge variant="success">SOLD!</Badge>
        </h3>
        : <React.Fragment>
            <span>Price: {price} ETH</span>
            <Button className="ml-2"
                onClick={onBuyClicked}>
                Buy
            </Button>
        </React.Fragment>

    return (
        <div>
            <div>
                {content}
                <KittyAlert
                    variant={message.type}
                    dismissible
                    show={message.text.length > 0}>
                    {message.text}
                </KittyAlert>
            </div>
            <CatBox model={model} />
        </div>
    )
}
