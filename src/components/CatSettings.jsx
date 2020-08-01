import React from 'react';
import './css/mystyle.css';
import { Badge, Col } from 'react-bootstrap';
import styled from 'styled-components';


const Cattributes = styled(Col)`
  padding: 25px;
  background-color: #ededed;
  border-radius: 10px;
`;

export default function CatSettings(props) {

  return (
    <Cattributes className="m-2 light-b-shadow">
      <div id="catColors">
        {
          props.dna.cattributes
            .filter(cattribute => cattribute.type === props.type)
            .map(cattribute => (
              <div className="form-group" key={cattribute.name}>
                <label htmlFor="formControlRange">
                  <b>{cattribute.displayName}</b>
                  <Badge variant="dark" className="ml-2" id="headcode">
                    {cattribute.valueName}
                  </Badge>
                </label>
                <input type="range" className="form-control-range"
                  id={cattribute.name}
                  min={cattribute.minValue}
                  max={cattribute.maxValue}
                  onChange={props.handleDnaChange}
                  defaultValue={cattribute.value}
                />
              </div>
            ))
        }
      </div>
    </Cattributes>
  )
}
