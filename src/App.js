import React from 'react';
import {
   BrowserRouter as Router,
   Switch,
   Route,
   Redirect
} from "react-router-dom";
import { Container } from 'react-bootstrap';

import AppHeader from './components/AppHeader';
import AppFooter from './components/AppFooter';
import CatFactory from './components/factory/CatFactory';
import CatList from './components/cat/CatList';
import Home from './Home';
import BreedPage from './components/breed/BreedPage';
import MarketPage from './components/market/MarketPage';
import { useSelector } from 'react-redux';


export default function App() {
   const wallet = useSelector(state => state.wallet);

   // only include feature routes if wallet connected
   let routes = null;
   if (wallet.account) {

      const factoryRoute = wallet.isOwner ?
         <Route exact path="/factory">
            <CatFactory />
         </Route>
         : null;

      routes =
         <Switch>
            {factoryRoute}
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
   } else {
      routes =
         <Switch>
            <Route exact path="/">
               <Home />
            </Route>
            <Redirect to="/" />
         </Switch>
   }

   return (
      <div>
         <Container className="p-5">
            <Router>
               <AppHeader />
               {routes}
            </Router>
            <AppFooter />
         </Container>
      </div>
   )
}
