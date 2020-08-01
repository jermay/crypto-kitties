import React from 'react';
import './css/cats.css';
import { Col } from 'react-bootstrap';
import Cat from './Cat';
import DnaViewer from './DnaViewer';
import styled from 'styled-components';

const Box = styled(Col)`
    background-color: #e2efff;
    border-radius: 10px;
    padding-top: 50px;
    padding-bottom: 100px;
`;

export default function CatBox(props) {
    // console.log('catbox props: ', props);
    return (
        <Box lg={4} className="m-2 light-b-shadow">
            <Cat model={props.cat} />
            <DnaViewer dna={props.cat.dna} />
        </Box>
    );
}
