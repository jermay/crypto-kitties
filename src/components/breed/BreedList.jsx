import React from 'react'
import { useState, useEffect } from 'react'
import CatBox from '../cat/CatBox';
import { CatModel } from '../js/catFactory';
import { ButtonGroup, Button, Spinner } from 'react-bootstrap';

export default function BreedList(props) {
    const [list, setList] = useState([]);
    const [init, setInit] = useState(false);
    const [pageNum, setPageNum] = useState(0);
    const [kittyModel, setKittyModel] = useState({ value: null });

    useEffect(() => {
        if (!init) {
            props.service.getKitties()
                .then(list => {
                    const items = list.map(item => {
                        return new CatModel(item);
                    })
                    setKittyModel({value: items[0]});
                    setList(items);                    
                });
            setInit(true);
        }
    }, [init, list, kittyModel, props.service])

    // kitties still loading, show spinner
    if (!list.length) {
        return <Spinner animation="grow" variant="success" />
    }


    const prevDisabled = (pageNum === 0);
    const nextDisabled = (pageNum === (list.length - 1));

    const onPrevKittyClicked = () => {
        if (prevDisabled) {
            return;
        }
        const prev = pageNum - 1;
        setPageNum(prev);
        setKittyModel({value: list[prev]});
    };

    const onNextKittyClicked = () => {
        if (pageNum === (list.length - 1)) {
            return;
        }
        const next = pageNum + 1;
        setPageNum(next);
        setKittyModel({value: list[next]});
    };

    return (
        <div>
            <div className="d-flex flex-column align-items-center">
                <ButtonGroup>
                    <Button
                        variant="secondary"
                        size="sm"
                        disabled={prevDisabled}
                        onClick={onPrevKittyClicked}>
                        Prev Kitty
                    </Button>
                    <Button
                        variant="info"
                        size="sm"
                        onClick={e => props.handleOnSetParent(kittyModel.value, 'mum')}>
                        Set as Mum
                    </Button>
                    <Button
                        variant="info"
                        size="sm"
                        onClick={e => props.handleOnSetParent(kittyModel.value, 'dad')}>
                        Set as Dad
                    </Button>
                    <Button
                        variant="secondary"
                        size="sm"
                        disabled={nextDisabled}
                        onClick={onNextKittyClicked}>
                        Next Kitty
                    </Button>
                </ButtonGroup>
                <div className="breed-list-item">
                    <CatBox model={kittyModel.value} />
                </div>
            </div>
        </div>
    )
}
