import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Accordion, Alert, Button, Card
} from 'react-bootstrap';
import moment from 'moment';
import styled from 'styled-components';

import DnaViewer from './DnaViewer';
import { CatModel } from '../js/catFactory';
import Cattribute from '../js/Cattribute';


const PlainCard = styled(Card)`
  border: 0;
  background-color: transparent;
`;

const CardHeader = styled(Card.Header)`
  padding: 0 1.25rem;
`;

const BtnSecondary = styled(Button)`
  background-color: darkgray;
  border-color: darkgray;
`;

export default function CatFeatures({ model, }) {
  const { cat, dna, } = model;
  const [onCooldown, setOnCooldown] = useState(false);
  const [toReadyTxt, setToReadyTxt] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = moment();
      const cooldownEndTime = moment.unix(cat.cooldownEndTime);
      if (now.isBefore(cooldownEndTime)) {
        setOnCooldown(true);
        const newReadyText = now.to(cooldownEndTime);
        setToReadyTxt(newReadyText);
      } else {
        setOnCooldown(false);
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  });

  if (!cat.kittyId) {
    return (
      <DnaViewer dna={dna} />
    );
  }

  const cattributes = dna.cattributes
    .filter((c) => c.type === Cattribute.TYPES.cattribute)
    .map((c) => (
      <span key={c.name}>
        {c.displayName}
        :
        {' '}
        {c.valueName}
      </span>
    ));

  const breedCountdown = onCooldown
    ? (
      <Alert variant="info">
        <small>
          Ready to breed
          {toReadyTxt}
        </small>
      </Alert>
    )
    : null;

  return (
    <Accordion>
      <PlainCard>
        <CardHeader>
          <Accordion.Toggle as={BtnSecondary} eventKey="0">
            <strong>
              <span>
                #
                {cat.kittyId}
                {' '}
                Gen
                {' '}
                {cat.generation}
                {' '}
                <span role="img" aria-label="timer clock">⏲</span>
                <span>
                  {cat.cooldown.name}
                  {' '}
                  (
                  {cat.cooldown.durationName}
                  )
                </span>
              </span>
            </strong>
            <DnaViewer dna={dna} />
          </Accordion.Toggle>
        </CardHeader>
      </PlainCard>
      <Accordion.Collapse eventKey="0">
        <Card.Body>
          {breedCountdown}
          <div className="d-flex flex-column">
            {cattributes}
          </div>
        </Card.Body>
      </Accordion.Collapse>
    </Accordion>
  );
}

CatFeatures.propTypes = {
  model: PropTypes.instanceOf(CatModel).isRequired,
};
