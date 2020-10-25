import React from 'react'
import { useSelector } from 'react-redux';

import { CatModel } from '../js/catFactory'
import CatActions from '../cat/CatActions';
import CatBox from '../cat/CatBox'
import { selectKittyById } from '../cat/catSlice';

export default function Offer(props) {
    const { tokenId } = props;
    const kitty = useSelector(state => selectKittyById(state, tokenId));
    const model = new CatModel(kitty);

    return (
        <div className="p-2">
            <CatActions
                kittyId={tokenId}
                isBuyMode={true}
            />
            <CatBox model={model} />
        </div>
    )
}
