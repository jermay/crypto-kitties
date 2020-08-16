import React from 'react'
import { useState, useEffect } from 'react'
import CatBox from '../cat/CatBox';
import { CatModel } from '../js/catFactory';
import { ButtonGroup, Button } from 'react-bootstrap';
import styled from 'styled-components';

export default function BreedList(props) {
    const [list, setList] = useState([]);
    const [init, setInit] = useState(false);

    useEffect(() => {
        if (!init) {
            props.service.getKitties()
                .then(list => {
                    setList(list);
                });
            setInit(true);
        }
    }, [init, list, props.service])

    const listItems = list.map(kitty => {
        const model = new CatModel(kitty);
        return (
            <div key={kitty.genes}>
                <div className="breed-list-item">
                    <CatBox model={model}/>
                </div>
                <ButtonGroup>
                    <Button
                        variant="secondary"
                        onClick={e => props.handleOnSetParent(model, 'mum')}>
                        Set as Mum
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={e => props.handleOnSetParent(model, 'dad')}>
                        Set as Dad
                    </Button>
                </ButtonGroup>
            </div>
        )
    });

    return (
        <div>
            {listItems}
        </div>
    )
}
