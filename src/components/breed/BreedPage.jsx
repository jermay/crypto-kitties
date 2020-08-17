import React, { useEffect } from 'react'
import BreedList from './BreedList'
import { Row, Col, Button } from 'react-bootstrap'
import CatBox from '../cat/CatBox';
import { useState } from 'react';
import styled from 'styled-components';
import { CatModel } from '../js/catFactory';

const PlaceHolder = styled.div`
    color: white;
    border-radius: 5px;
    height: 10rem;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const BreedProgress = {
    SELECT: 'select parents',
    ERROR_SAME_PARENT: 'error same parent',
    READY: 'ready',
    BIRTH: 'birth'
}

export default function BreedPage(props) {
    const [init, setInit] = useState(false);
    const [mum, setMum] = useState(undefined);
    const [dad, setDad] = useState(undefined);
    const [progress, setProgress] = useState(BreedProgress.SELECT);
    const [kitten, setKitten] = useState(undefined);

    const onBirthEvent = async event => {
        const kitten = await props.service.getKitty(event.kittyId);
        const newModel = new CatModel(kitten);
        setKitten(newModel);
        setProgress(BreedProgress.BIRTH);
    }

    useEffect(() => {
        if (!init) {
            props.service.birthSubscriptions.push(onBirthEvent);
            setInit(true);
        }
    }, [init]);

    const handleOnSetParent = (kitty, parentType) => {
        // determine if setting the mum or dad
        console.log(`set ${parentType} to: `, kitty.cat.kittyId);
        let other = dad;
        if (parentType === 'mum') {
            setMum(kitty);
        } else {
            setDad(kitty);
            other = mum;
        }

        if (Boolean(other)) {
            if (kitty.cat.kittyId != other.cat.kittyId) {
                setProgress(BreedProgress.READY);
            } else {
                setProgress(BreedProgress.ERROR_SAME_PARENT);
            }
        }
    };

    const onBreedClicked = () => {
        if (!mum || !dad) {
            console.log('Need to select both pareents!');
            return;
        }
        console.log(`Breeding mum: ${mum.dna.dna} + dad: ${dad.dna.dna}...`);
        props.service.breed(mum.cat.kittyId, dad.cat.kittyId);
    }

    const onResetParents = ()=>{
        setProgress(BreedProgress.SELECT);
        setKitten(undefined);
        setMum(undefined);
        setDad(undefined);
    }

    // Set Parents
    const parentBoxes = [
        { type: 'Mum', model: mum },
        { type: 'Dad', model: dad }
    ].map(data =>
        <Col key={data.type}>
            <h5>{data.type} Kitty</h5>
            {
                data.model ? <CatBox model={data.model} /> :
                    <PlaceHolder className="bg-info">
                        <span>Select {data.type}</span>
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
                    Give them some privacy
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
                <p className="bg-warning text-white">The mum and dad kitty cannot be the same!</p>
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
                    <h5 className="text-center">Available Kitties</h5>
                    <BreedList
                        service={props.service}
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
