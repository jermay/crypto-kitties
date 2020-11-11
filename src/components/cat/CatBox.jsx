import React from 'react';
import PropTypes from 'prop-types';
import { Col } from 'react-bootstrap';
import styled from 'styled-components';

import Cat from './Cat';
import CatFeatures from './CatFeatures';
import { CatModel } from '../js/catFactory';


const Box = styled(Col)`
    background-color: #e2efff;
    border-radius: 10px;
    padding-top: 2rem;
    padding-bottom: 2rem;
    min-width: 20rem;
    max-width: 20rem;
`;

export default function CatBox({ model, }) {
  if (!model) {
    return <div />;
  }

  return (
    <Box className="m-2 light-b-shadow">
      <Cat model={model} />
      <CatFeatures model={model} />
    </Box>
  );
}

CatBox.propTypes = {
  model: PropTypes.instanceOf(CatModel).isRequired,
};
