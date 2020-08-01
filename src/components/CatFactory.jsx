import React from 'react';
import { Tabs, Tab, Button, Col } from 'react-bootstrap';
import CatSettings from './CatSettings';
import { Cattribute } from './js/dna';

export default function CatFactory(props) {
    return (
        <Col lg={7}>
            <Tabs variant="pills" defaultActiveKey="CatColors" id="cat-factory">
                <Tab eventKey="CatColors" title="Cat Colors">
                    <CatSettings type={Cattribute.TYPES.basic} dna={props.dna} handleDnaChange={props.handleDnaChange} />
                </Tab>
                <Tab eventKey="Cattributes" title="Cattributes">
                    <CatSettings type={Cattribute.TYPES.cattribute} dna={props.dna} handleDnaChange={props.handleDnaChange} />
                </Tab>
            </Tabs>
            <div>
                <Button variant="warning"
                    className="m-2"
                    onClick={props.handleSetDefaultKitty}>
                    Default Kitty
                </Button>
                <Button variant="warning"
                    className="m-2"
                    onClick={props.handleSetRandomKitty}>
                    Random Kitty
                </Button>
                <Button variant="warning"
                    className="m-2"
                    onClick={props.handleCreateKitty}>
                    Create Kitty
                </Button>
            </div>
        </Col>
    )
}
