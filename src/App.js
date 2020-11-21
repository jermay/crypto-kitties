/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Alert, Container } from 'react-bootstrap';

import AppHeader from './components/AppHeader';
import AppFooter from './components/AppFooter';
import CatFactory from './components/factory/CatFactory';
import CatList from './components/cat/CatList';
import Home from './Home';
import BreedPage from './components/breed/BreedPage';
import MarketPage from './components/market/MarketPage';
import TransactionStatusToast from './components/notification/TransactionStatusToast';
import { selectOnSupportedNetwork, selectSupportedNetworks } from './components/wallet/walletSlice';
import AdminPage from './components/admin/AdminPage';


export default function App() {
  const wallet = useSelector((state) => state.wallet);
  const onSupportedNetwork = useSelector(selectOnSupportedNetwork);
  const supportedNetworks = useSelector(selectSupportedNetworks);

  // make sure connected to a supported network
  let unsupportedNetwork;
  if (wallet.network) {
    unsupportedNetwork = onSupportedNetwork
      ? null
      : (
        <Alert variant="danger">
          Network
          {' '}
          {wallet.network.name}
          {' '}
          not supported. Please connect to
          {' '}
          {supportedNetworks.map((n) => n.name).join(', ')}
          {' '}
          to get started.
        </Alert>
      );
  }

  // only include feature routes if wallet connected
  // to a supported network
  let routes = null;
  if (wallet.account && onSupportedNetwork === true) {
    const factoryRoute = wallet.isKittyCreator
      ? (
        <Route exact path="/factory">
          <CatFactory />
        </Route>
      )
      : null;

    const adminRoute = wallet.isOwner
      ? (
        <Route exact path="/admin">
          <AdminPage />
        </Route>
      )
      : null;

    routes = (
      <Switch>
        {factoryRoute}
        {adminRoute}
        <Route exact path="/breed">
          <BreedPage />
        </Route>
        <Route exact path="/market">
          <MarketPage />
        </Route>
        <Route exact path="/kitties">
          <CatList />
        </Route>
        <Route exact path="/">
          <Home />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  }

  return (
    <div>
      <Container className="p-5">
        <TransactionStatusToast />
        <Router>
          <AppHeader />
          {unsupportedNetwork}
          {routes}
        </Router>
        <AppFooter />
      </Container>
    </div>
  );
}
