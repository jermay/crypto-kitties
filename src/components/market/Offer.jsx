import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { CatModel } from '../js/catFactory';
import CatActions from '../cat/CatActions';
import CatBox from '../cat/CatBox';
import { selectKittyById } from '../cat/catSlice';
import { MediumCatContainer } from '../cat/CatBoxContainers';


export default function Offer({ tokenId, }) {
  const kitty = useSelector((state) => selectKittyById(state, tokenId));
  const model = new CatModel(kitty);

  return (
    <MediumCatContainer>
      <CatActions
        kittyId={tokenId}
        isBuyMode
      />
      <CatBox model={model} />
    </MediumCatContainer>
  );
}

Offer.propTypes = {
  tokenId: PropTypes.string.isRequired,
};

