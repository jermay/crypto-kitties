import React from 'react';
import { Col } from 'react-bootstrap';
import styled from 'styled-components';

import Cat from './Cat';
import DnaViewer from './DnaViewer';


const Box = styled(Col)`
    background-color: #e2efff;
    border-radius: 10px;
    padding-top: 2rem;
    padding-bottom: 2rem;
    min-width: 22rem;
    max-width: 22rem;
`;

export default function CatBox(props) {
    return (
        <Box className="m-2 light-b-shadow">
            <Cat model={props.cat} />
            <DnaViewer dna={props.cat.dna} />
        </Box>
    );
}
