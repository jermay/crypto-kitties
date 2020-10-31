import React from 'react';
import { Col } from 'react-bootstrap';
import styled from 'styled-components';

import Cat from './Cat';
import DnaViewer from './DnaViewer';
import CatFeatures from './CatFeatures';


const Box = styled(Col)`
    background-color: #e2efff;
    border-radius: 10px;
    padding-top: 2rem;
    padding-bottom: 2rem;
    min-width: 20rem;
    max-width: 20rem;
`;

export default function CatBox({ model }) {

    return (
        <Box className="m-2 light-b-shadow">
            <Cat model={model} />
            <DnaViewer dna={model.dna} />
            <CatFeatures cat={model.cat} dna={model.dna} />
        </Box>
    );
}
