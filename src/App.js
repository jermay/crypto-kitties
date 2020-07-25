import React, { useState } from 'react';
import { Container, Row } from 'react-bootstrap';

import AppHeader from './components/AppHeader';
import AppFooter from './components/AppFooter';
import CatBox from './components/CatBox';
import CatSettings from './components/CatSettings'
import { KittyDNA } from './components/js/dna';


export default function App() {
    const [dna, setDna] = useState(new KittyDNA());

    const handleDnaChange = (event) => {
        // set new dna value
        const cattributeName = event.target.id;
        const value = event.target.value;
        console.log(`DNA changed > cattribute: ${cattributeName}, value: ${value}`);
        setDna(oldDna => {
            oldDna.setCattributeValue(cattributeName, value);
            return oldDna.clone();
        });
    }

    // TODO: div style="margin-top: 12vh;margin-bottom: 10vh;"
    return (
        <div>
            <Container className="p-5" >
                <AppHeader />
                <Row>
                    <CatBox dna={dna} />
                    <CatSettings dna={dna} handleDnaChange={handleDnaChange} />
                </Row>
                <AppFooter />
            </Container>
        </div>
    )
}
