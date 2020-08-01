import React, { useState } from 'react';
import { Container, Row } from 'react-bootstrap';

import AppHeader from './components/AppHeader';
import AppFooter from './components/AppFooter';
import CatBox from './components/CatBox';
import { CatModel } from './components/js/catFactory';
import CatFactory from './components/CatFactory';

const initialCatModel = new CatModel();

export default function App() {
    const [cat, setCat] = useState({ model: initialCatModel })

    const handleDnaChange = (event) => {
        // set new dna value
        const cattributeName = event.target.id;
        const value = +event.target.value;
        console.log(`DNA changed > cattribute: ${cattributeName}, value: ${value}`);

        setCat(oldState => {
            console.log('setCatModel called mewtating a new state..');
            let newModel = oldState.model.mewtate(cattributeName, value);            
            return { model: newModel };
        });
    }

    return (
        <div>
            <Container className="p-5">
                <AppHeader />
                <Row>
                    <CatBox cat={cat.model} />
                    <CatFactory dna={cat.model.dna} handleDnaChange={handleDnaChange} />
                </Row>
                <AppFooter />
            </Container>
        </div>
    )
}
