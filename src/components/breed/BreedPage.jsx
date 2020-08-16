import React, { useEffect } from 'react'
import BreedList from './BreedList'
import { Row, Col, Button } from 'react-bootstrap'
import CatBox from '../cat/CatBox';
import { useState } from 'react';
import styled from 'styled-components';
import { CatModel } from '../js/catFactory';

const PlaceHolder = styled.div`
    background-color: lightblue;
    border-radius: 5px;
    height: 10rem;
    padding: 4rem;
`;

export default function BreedPage(props) {
    const [init, setInit] = useState(false);
    const [mum, setMum] = useState(undefined);
    const [dad, setDad] = useState(undefined);
    const [kitten, setKitten] = useState(undefined);
    const [btnText, setBtnText] = useState('Give them some privacy');

    useEffect(() => {
        if (!init) {
            props.service.birthSubscriptions.push(onBirthEvent);
            setInit(true);
        }
    }, [init]);

    const handleOnSetParent = (kitty, parentType) => {
        console.log(`set ${parentType} to: `, kitty);
        if (parentType === 'mum') {
            setMum(kitty);
        } else {
            setDad(kitty);
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

    const onBirthEvent = async event => {
        const kitten = await props.service.getKitty(event.kittyId);
        const newModel = new CatModel(kitten);
        setKitten(newModel);
        setBtnText('Your kitties need to rest');
    }

    const parentBoxes = [
        { type: 'Mum', model: mum },
        { type: 'Dad', model: dad }
    ].map(data =>
        <Col key={data.type}>
            <h5>{data.type} Kitty</h5>
            {
                data.model ? <CatBox model={data.model} /> :
                    <PlaceHolder>Select {data.type}</PlaceHolder>
            }
        </Col>
    );

    const kittyBox = kitten ?
        <div className="d-flex flex-column align-items-center mt-4 text-success">
            <h5>A new kitten is born!</h5>
            <CatBox model={kitten} />
        </div>
        : null;


    const disableBreed = Boolean(kitten) ||
        !Boolean(mum) ||
        !Boolean(dad) ||
        (mum.cat.kittyId == dad.cat.kittyId);

    return (
        <div>
            <h1>Breed Your Kitties</h1>
            <Row>
                <Col sm={4}>
                    <BreedList
                        service={props.service}
                        handleOnSetParent={handleOnSetParent} />
                </Col>
                <Col sm={8} className="bg-light text-center">
                    <Row>{parentBoxes}</Row>
                    <Button
                        className="mt-2"
                        disabled={disableBreed}
                        onClick={onBreedClicked}>
                        {btnText}
                    </Button>
                    {kittyBox}
                </Col>
            </Row>
        </div>
    )
}
