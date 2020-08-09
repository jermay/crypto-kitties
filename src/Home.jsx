import React, { useState } from 'react'
import styled from 'styled-components';
import Cat from './components/cat/Cat';
import { KittyDNA } from './components/js/dna';
import { CatModel } from './components/js/catFactory';
import { Col, Row } from 'react-bootstrap';

const Div = styled(Col)`
    transform: scale(0.75);
`;

const defaultFeatured = [
    "8770856871829324",
    "9080335340204323",
    "1937825512645025",
    "8886915152314413",
    "1013914222421341",
];

export default function Home() {
    const [featured, setFeatured] = useState({ cats: defaultFeatured });

    const featuredCats = featured.cats.map(genes => {
        const cat = new CatModel({genes});
        return (
            <Div key={genes}>
                <Cat model={cat} />
            </Div>
        )
    });

    return (
        <div>
            <div align="center" className="mt-2">
                <h1>Academy Kitties</h1>
                <p>Collect and breed furrever freinds!</p>
            </div>
            <Row>
                {featuredCats}
            </Row>
        </div>
    )
}
