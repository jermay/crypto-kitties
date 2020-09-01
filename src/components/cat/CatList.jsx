import React, { useState, useEffect } from 'react'

import CatBox from './CatBox';
import { CatModel } from '../js/catFactory';
import { Container } from 'react-bootstrap';
import { Service } from '../js/service';
import CatActions from './CatActions';


export default function CatList(props) {
    const [data, setData] = useState({ cats: [] });
    const [init, setInit] = useState(false);

    useEffect(() => {
        if (!init) {
            const getKittes = async () => {
                const list = await Service.kitty.getKitties();
                setData({ cats: list });
            }
            getKittes();
            setInit(true);
        }
    }, [init])

    if (!data.cats.length) {
        return (
            <p>You have no kittes! Go to the Marketplace to find some!</p>
        )
    }

    const catBoxes = data.cats.map(kitty => {
        let model = new CatModel(kitty);
        return (
            <div key={kitty.genes}>                
                <CatBox model={model} />
                <CatActions kittyId={model.cat.kittyId} />
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
