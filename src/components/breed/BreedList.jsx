import React from 'react'
import { useState, useEffect } from 'react'
import moment from 'moment';

import CatBox from '../cat/CatBox';
import { CatModel } from '../js/catFactory';
import { ButtonGroup, Button, Spinner, Badge } from 'react-bootstrap';
import { Service } from '../js/service';

export default function BreedList(props) {
    const { handleOnSetParent, sireId } = props;

    const [list, setList] = useState([]);
    const [init, setInit] = useState(false);
    const [pageNum, setPageNum] = useState(0);
    const [kittyModel, setKittyModel] = useState({ value: null });

    useEffect(() => {
        if (!init) {
            Service.kitty.getKitties()
                .then(list => {
                    const items = list.map(item => {
                        return new CatModel(item);
                    })
                    setKittyModel({ value: items[0] });
                    setList(items);
                });
            setInit(true);
        }
    }, [init])

    const isOnCoolDown = () => {
        if (Boolean(kittyModel.value)) {
            const now = moment();
            const cooldownEnd = moment.unix(kittyModel.value.cat.cooldownEndTime);
            return now.isBefore(cooldownEnd);
        }

        return false;
    }

    const [onCooldown, setOnCooldown] = useState(isOnCoolDown());
    useEffect(() => {
        setOnCooldown(isOnCoolDown());
        let timer;
        if (isOnCoolDown()) {
            timer = setInterval(() => {
                setOnCooldown(isOnCoolDown());
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [isOnCoolDown, onCooldown, kittyModel])

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
        setKittyModel({ value: list[prev] });
        setOnCooldown(isOnCoolDown());
    };

    const onNextKittyClicked = () => {
        if (pageNum === (list.length - 1)) {
            return;
        }
        const next = pageNum + 1;
        setPageNum(next);
        setKittyModel({ value: list[next] });
        setOnCooldown(isOnCoolDown());
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
                        disabled={onCooldown}
                        onClick={e => handleOnSetParent(kittyModel.value, 'mum')}>
                        Set as Mum
                    </Button>
                    <Button
                        variant="info"
                        size="sm"
                        disabled={onCooldown || Boolean(sireId)}
                        onClick={e => handleOnSetParent(kittyModel.value, 'dad')}>
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
                {onCooldown ?
                    <Badge variant="secondary" className="mt-1">Not Ready</Badge>
                    : <Badge variant="success" className="mt-1">Ready</Badge>}
                <div className="breed-list-item">
                    <CatBox model={kittyModel.value} />
                </div>
            </div>
        </div>
    )
}
