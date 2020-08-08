import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Button, Col, Row } from 'react-bootstrap';

import { CatModel } from '../js/catFactory';
import { Cattribute } from '../js/dna';

import CatSettings from './CatSettings';
import CatBox from '../cat/CatBox';
import BirthAlert from './BirthAlert';

const initialCatModel = new CatModel();


export default function CatFactory(props) {
   const [cat, setCat] = useState({ model: initialCatModel });
   const [birthEvent, setBirthEvent] = useState({});
   const [showBirthAlert, setShowBirthAlert] = useState(false)
   const service = props.service;

   useEffect(() => {
      service.birthSubscriptions.push(handleBirthEvent);
   }, [service.birthSubscriptions]);

   const handleDnaChange = (event) => {
      // set new dna value
      const cattributeName = event.target.id;
      const value = +event.target.value;
      console.log(`DNA changed > cattribute: ${cattributeName}, value: ${value}`);

      setCat(oldState => {
         console.log('setCatModel called mewtating a new state..');
         let newModel = oldState.model.mewtate(cattributeName, value);
         return { model: newModel };
      });
   }

   const handleSetDefaultKitty = () => {
      const defaultCat = new CatModel();
      setCat({ model: defaultCat });
   };

   const handleSetRandomKitty = () => {
      const randomCat = CatModel.getRandom();
      setCat({ model: randomCat });
   }

   const handleCreateKitty = () => {
      service.createGen0Kitty(cat.model.dna.dna);
   };

   const handleBirthEvent = (event) => {
      setBirthEvent(event);
      setShowBirthAlert(true);
   };

   const handleBirthEventClose = () => {
      setShowBirthAlert(false);
   }

   return (
      <React.Fragment>
      <div align="center">
         <h1>Kitties-Factory</h1>
         <p>Create your custom Kitty</p>
      </div>
      <Row>
         <Col lg={4}>
            <CatBox cat={cat.model} />
         </Col>
         <Col lg={8}>
            <Tabs variant="pills" defaultActiveKey="CatColors" id="cat-factory">
               <Tab eventKey="CatColors" title="Cat Colors">
                  <CatSettings type={Cattribute.TYPES.basic} dna={cat.model.dna} handleDnaChange={handleDnaChange} />
               </Tab>
               <Tab eventKey="Cattributes" title="Cattributes">
                  <CatSettings type={Cattribute.TYPES.cattribute} dna={cat.model.dna} handleDnaChange={handleDnaChange} />
               </Tab>
            </Tabs>
            <div>
               <Button variant="warning"
                  className="m-2"
                  onClick={handleSetDefaultKitty}>
                  Default Kitty
               </Button>
               <Button variant="warning"
                  className="m-2"
                  onClick={handleSetRandomKitty}>
                  Random Kitty
               </Button>
               <Button variant="warning"
                  className="m-2"
                  onClick={handleCreateKitty}>
                  Create Kitty
               </Button>
            </div>
            <BirthAlert
               show={showBirthAlert}
               event={birthEvent}
               handleBirthEventClose={handleBirthEventClose}
            />
         </Col>
      </Row>
      </React.Fragment>
   )
}
