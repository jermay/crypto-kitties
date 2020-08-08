import React from 'react';
import './css/cats.css';
import { Col } from 'react-bootstrap';
import Cat from './Cat';
import DnaViewer from './DnaViewer';
import styled from 'styled-components';

const Box = styled(Col)`
    background-color: #e2efff;
    border-radius: 10px;
    padding-top: 2rem;
    padding-bottom: 2rem;
`;

export default function CatBox(props) {
    return (
        <Box className="m-2 light-b-shadow">
            <Cat model={props.cat} />
            <DnaViewer dna={props.cat.dna} />
        </Box>
    );
}
