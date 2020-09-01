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


export default function App() {

   return (
      <div>
         <Container className="p-5">
            <Router>
               <AppHeader />
               <Switch>
                  <Route exact path="/factory">
                     <CatFactory />
                  </Route>
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
            </Router>
            <AppFooter />
         </Container>
      </div>
   )
}
