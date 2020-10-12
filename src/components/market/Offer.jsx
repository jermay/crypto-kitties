import React from 'react'
import { useSelector } from 'react-redux';

import { CatModel } from '../js/catFactory'
import { selectOfferByKittyId } from './offerSlice';
import CatActions from '../cat/CatActions';
import CatBox from '../cat/CatBox'

export default function Offer(props) {
    const { tokenId } = props;
    const offer = useSelector(state => selectOfferByKittyId(state, tokenId));
    const model = new CatModel(offer.kitty);

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
