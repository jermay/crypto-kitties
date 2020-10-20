import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Button } from 'react-bootstrap'
import styled from 'styled-components';

import BreedList from './BreedList'
import CatBox from '../cat/CatBox';
import { CatModel } from '../js/catFactory';
import { Service } from '../js/service';
import { useQuery } from '../js/utils';
import { BreedProgress, breedReset, sireOfferSelected } from './breedSlice';
import { selectKittyById } from '../cat/catSlice';
import { selectOfferByKittyId } from '../market/offerSlice';
import { approveParent, breed, sire } from './breedSaga';

const PlaceHolder = styled.div`
    color: white;
    border-radius: 5px;
    height: 10rem;
    display: flex;
    justify-content: center;
    align-items: center;
`;

export default function BreedPage() {
    // from a market sire offer
    // should lock the dad selection
    // breed button should buy the offer
    // const sireId = useQuery().get('sireId');
    const dispatch = useDispatch();

    const {
        dadId,
        mumId,
        kittenId,
        sireOfferId,
        progress,
        // error TODO: display errors
    } = useSelector(state => state.breed);

    const sireOffer = useSelector(state => selectOfferByKittyId(state, sireOfferId));
    const dadKitty = useSelector(state => selectKittyById(state, dadId));
    let dad = undefined;
    if (dadKitty) {
        dad = new CatModel(dadKitty);
    }

    const mumKitty = useSelector(state => selectKittyById(state, mumId));
    let mum = undefined;
    if (mumKitty) {
        mum = new CatModel(mumKitty);
    }

    const newKitty = useSelector(state => selectKittyById(state, kittenId));
    let kitten = undefined;
    if (newKitty) {
        kitten = new CatModel(newKitty);
    }

    const handleOnSetParent = (kitty, parentType) => {
        dispatch(approveParent({ parentId: kitty.cat.kittyId, parentType }));
    };

    const onBreedClicked = async () => {
        if (sireOffer) {
            dispatch(sire({offer: sireOffer, matronId: mumId}));
        } else {
            dispatch(breed({ mumId, dadId }));
        }
    }

    const onResetParents = () => {
        dispatch(breedReset());
    }

    const sireCostTxt = Boolean(sireOffer) ?
        ` (${Service.web3.utils.fromWei(sireOffer.price, 'ether')} ETH)` : '';

    // Set Parents
    const parentBoxes = [
        { type: 'Mum', model: mum },
        { type: `Dad${sireCostTxt}`, model: dad }
    ].map(data =>
        <Col key={data.type}>
            <h5>{data.type}</h5>
            {
                data.model ? <CatBox model={data.model} /> :
                    <PlaceHolder className="bg-info">
                        <h1>?</h1>
                    </PlaceHolder>
            }
        </Col>
    );

    let instructionContent;
    switch (progress) {
        case BreedProgress.READY:
            instructionContent =
                <Button
                    className="mt-2"
                    onClick={onBreedClicked}>
                    Give them some privacy{sireCostTxt}
                </Button>
            break;

        case BreedProgress.BIRTH:
            instructionContent =
                <div>
                    <p className="text-success">Cogratulations! Your parent kitties now need a rest.</p>
                    <Button
                        variant="primary"
                        onClick={onResetParents}>
                        Breed Different Kitties
                    </Button>
                </div>
            break;

        case BreedProgress.ERROR_SAME_PARENT:
            instructionContent =
                <p className="bg-warning text-white">The mum and dad kitty must be different!</p>
            break;

        default:
            instructionContent =
                <p>Select a Mum and Dad kitty</p>
            break;
    }

    const kittenBox = kitten ?
        <div className="d-flex flex-column align-items-center mt-4 text-success">
            <h5>A new kitten is born!</h5>
            <CatBox model={kitten} />
        </div>
        : null;

    return (
        <div className="p-2 mt-2 bg-light">
            <h1 className="text-center">Breed Your Kitties</h1>
            <Row>
                <Col sm={4} className="">
                    <h5 className="text-center">Your Kitties</h5>
                    <BreedList
                        sireId={sireOffer ? sireOffer.tokenId : null}
                        handleOnSetParent={handleOnSetParent} />
                </Col>
                <Col sm={8} className="text-center">
                    <h5>Parents</h5>
                    {instructionContent}
                    {kittenBox}
                    <Row>{parentBoxes}</Row>
                </Col>
            </Row>
        </div>
    )
}
