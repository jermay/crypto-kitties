import React from 'react';
import PropTypes from 'prop-types';
import { Badge, Col } from 'react-bootstrap';
import styled from 'styled-components';

import '../css/mystyle.css';
import KittyDNA from '../js/dna';
import CatColorBar from './CatColorBar';
import ColorCattribute from '../js/ColorCattribute';

const Cattributes = styled(Col)`
  padding: 25px;
  background-color: #ededed;
  border-radius: 10px;
`;

export default function CatSettings({ dna, type, handleDnaChange, }) {
  return (
    <Cattributes className="m-2 light-b-shadow">
      <div id="catColors">
        {
          dna.cattributes
            .filter((cattribute) => cattribute.type === type)
            .map((cattribute) => (
              <div className="form-group" key={cattribute.name}>
                <label htmlFor="formControlRange">
                  <b>{cattribute.displayName}</b>
                  <Badge variant="dark" className="ml-2" id="headcode">
                    {cattribute.valueName}
                  </Badge>
                </label>
                <CatColorBar show={cattribute instanceof ColorCattribute} />
                <input
                  type="range"
                  className="form-control-range"
                  id={cattribute.name}
                  min={cattribute.minValue}
                  max={cattribute.maxValue}
                  onChange={handleDnaChange}
                  defaultValue={cattribute.value}
                />
              </div>
            ))
        }
      </div>
    </Cattributes>
  );
}

CatSettings.propTypes = {
  dna: PropTypes.instanceOf(KittyDNA).isRequired,
  type: PropTypes.string.isRequired,
  handleDnaChange: PropTypes.func.isRequired,
};
