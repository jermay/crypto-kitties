import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import KittyDNA from '../js/dna';

const Span = styled.span`
    margin-left: 0.25rem;
`;

export default function DnaViewer({ dna, }) {
  return (
    <div id="catDNA">
      <b>
        DNA:
        {
          dna.cattributes.map((cattribute) => (
            <Span key={cattribute.name}>{cattribute.strValue}</Span>
          ))
        }
      </b>
    </div>
  );
}

DnaViewer.propTypes = {
  dna: PropTypes.instanceOf(KittyDNA).isRequired,
};
