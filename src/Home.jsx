import React from 'react';
import styled from 'styled-components';
import { Button, Col, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import Cat from './components/cat/Cat';
import { CatModel } from './components/js/catFactory';
import { connect } from './components/wallet/walletSaga';
import GenZeroCounter from './components/cat/GenZeroCounter';

const Featured = styled(Row)`
    max-width: 40rem;
`;

const Div = styled(Col)`
    transform: scale(0.75);
`;

export default function Home() {
  const dispatch = useDispatch();
  const featured = [
    '8770856871829324',
    '9080335340204323',
    '1937825512645025',
    '8886915152314413',
    '1013914222421341',
  ];

  const featuredCats = featured.map((genes) => {
    const cat = new CatModel({ genes, });
    return (
      <Div key={genes}>
        <Cat model={cat} />
      </Div>
    );
  });

  const wallet = useSelector((state) => state.wallet);
  const connectWallet = wallet.account
    ? null
    : (
      <h3>
        <Button size="lg" onClick={() => dispatch(connect())}>
          Connect to get started
        </Button>
      </h3>
    );

  return (
    <div className="d-flex flex-column align-items-center">
      <div align="center" className="mt-2">
        <h1>Academy Kitties</h1>
        <p>
          Collect and breed furrever freinds!
          <br />
          <GenZeroCounter msg="geneneration zero Kittes already created. Get yours before they're all gone!" />
        </p>
      </div>
      {connectWallet}
      <Featured>
        {featuredCats}
      </Featured>
    </div>
  );
}
