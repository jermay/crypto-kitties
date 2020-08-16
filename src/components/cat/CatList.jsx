import React, { useState, useEffect } from 'react'

import CatBox from './CatBox';
import { CatModel } from '../js/catFactory';
import { Container } from 'react-bootstrap';


export default function CatList(props) {
    const [data, setData] = useState({ cats: [] });
    const [init, setInit] = useState(false);

    useEffect(() => {
        if (!init) {
            const getKittes = async () => {
                const list = await props.service.getKitties();
                setData({ cats: list });
            }
            getKittes();
            setInit(true);
        }
    }, [init, data, props.service])

    if (!data.cats.length) {
        return (
            <p>You have no kittes! Use the Factory to create one.</p>
        )
    }

    const catBoxes = data.cats.map(kitty => {
        let model = new CatModel(kitty);
        return (
            <CatBox key={kitty.genes} model={model} />
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
