import React from 'react';
import styled from 'styled-components';
import Cat from './components/cat/Cat';
import { CatModel } from './components/js/catFactory';
import { Col, Row } from 'react-bootstrap';

const Featured = styled(Row)`
    max-width: 40rem;
`;

const Div = styled(Col)`
    transform: scale(0.75);
`;

export default function Home() {
    const featured = [
        "8770856871829324",
        "9080335340204323",
        "1937825512645025",
        "8886915152314413",
        "1013914222421341",
    ];

    const featuredCats = featured.map(genes => {
        const cat = new CatModel({genes});
        return (
            <Div key={genes}>
                <Cat model={cat} />
            </Div>
        )
    });

    return (
        <div className="d-flex flex-column align-items-center">
            <div align="center" className="mt-2">
                <h1>Academy Kitties</h1>
                <p>Collect and breed furrever freinds!</p>
            </div>
            <Featured>
                {featuredCats}
            </Featured>
        </div>
    )
}
