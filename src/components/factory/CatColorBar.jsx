import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { colorObj } from '../js/colors';

const ColorWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 0.5rem;
  padding-left: 0.225rem;
  padding-right: 0.225rem
`;

const ColorSection = styled.div`
  flex: 1 1 auto;
`;

export default function CatColorBar({ show, }) {
  if (!show) {
    return null;
  }

  return (
    <ColorWrapper>
      {Object.values(colorObj).map((obj) => (
        <ColorSection key={obj.name} style={{ backgroundColor: obj.color, }} />
      ))}
    </ColorWrapper>
  );
}

CatColorBar.propTypes = {
  show: PropTypes.bool.isRequired,
};
