import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';

import CatBox from './CatBox';
import { Container } from 'react-bootstrap';
import CatActions from './CatActions';
import { requestStatus } from '../js/utils';
import { getKitties, selectAllKitties } from './catSlice';
import { CatModel } from '../js/catFactory';


export default function CatList() {
    const dispatch = useDispatch();
    const kittyStatus = useSelector(state => state.kitties.status);
    const kitties = useSelector(selectAllKitties);

    useEffect(() => {
        if (kittyStatus === requestStatus.idle) {
            dispatch(getKitties());
        }
    }, [kittyStatus, dispatch])

    if (!kitties.length) {
        return (
            <p>You have no kittes! Go to the Marketplace to adpot some!</p>
        )
    }

    const catBoxes = kitties.map(kitty => {
        const model = new CatModel(kitty);
        return (
            <div key={kitty.kittyId}>
                <CatBox model={model} />
                <CatActions kittyId={kitty.kittyId} />
            </div>
        )
    })

    return (
        <Container>
            <h1>My Kitties</h1>
            <div className="d-flex flex-wrap">
                {catBoxes}
            </div>
        </Container>
    )
}
