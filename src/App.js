import React, { useState } from 'react';
import { Container, Row } from 'react-bootstrap';

import AppHeader from './components/AppHeader';
import AppFooter from './components/AppFooter';
import CatBox from './components/CatBox';
import CatSettings from './components/CatSettings'
import { KittyDNA } from './components/js/dna';
import { CatModel } from './components/js/catFactory';


export default function App() {
    const [catModel, setCatModel] = useState(new CatModel({dna: new KittyDNA()}))

    const handleDnaChange = (event) => {
        // set new dna value
        const cattributeName = event.target.id;
        const value = event.target.value;
        console.log(`DNA changed > cattribute: ${cattributeName}, value: ${value}`);
        
        setCatModel(oldModel => {
            oldModel.dna.setCattributeValue(cattributeName, value);
            return oldModel.clone();
        });
    }

    return (
        <div>
            <Container className="p-5">
                <AppHeader />
                <Row>
                    <CatBox cat={catModel} />
                    <CatSettings dna={catModel.dna} handleDnaChange={handleDnaChange} />
                </Row>
                <AppFooter />
            </Container>
        </div>
    )
}
