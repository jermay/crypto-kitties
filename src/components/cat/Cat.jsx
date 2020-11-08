import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import CatPartComp from './CatPartComp';
import { CatModel } from '../js/catFactory';


const Div = styled.div`
    background-color: ${(props) => `#${props.color}`};
`;

export default function Cat({ model, }) {
  return (
    <Div className="cat">
      <CatPartComp parts={model.parts} />
    </Div>
  );
}


Cat.propTypes = {
  model: PropTypes.instanceOf(CatModel).isRequired,
};
