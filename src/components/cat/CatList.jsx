import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';

import CatBox from './CatBox';
import { Container } from 'react-bootstrap';
import CatActions from './CatActions';
import { requestStatus } from '../js/utils';
import { getKitties, selectKittyIds } from './catSlice';


export default function CatList() {
    const dispatch = useDispatch();
    const kittyStatus = useSelector(state => state.kitties.status);
    const kittyIds = useSelector(selectKittyIds);

    useEffect(()=>{
        if (kittyStatus === requestStatus.idle) {
            dispatch(getKitties());
        }
    }, [kittyStatus, dispatch])

    if (!kittyIds.length) {
        return (
            <p>You have no kittes! Go to the Marketplace to adpot some!</p>
        )
    }

    const catBoxes = kittyIds.map(kittyId => {
        return (
            <div key={kittyId}>                
                <CatBox kittyId={kittyId} />
                <CatActions kittyId={kittyId} />
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
