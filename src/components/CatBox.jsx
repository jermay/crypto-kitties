import React from 'react';
import './css/cats.css';
import { Col } from 'react-bootstrap';
import Cat from './Cat';
import DnaViewer from './DnaViewer';


export default function CatBox(props) {
    // console.log('catbox props: ', props);
    return (
        <Col lg={4} className="catBox m-2 light-b-shadow">
            <Cat dna={props.dna} />
            <DnaViewer dna={props.dna} />
        </Col>
    );
}
