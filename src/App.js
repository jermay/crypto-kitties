import React from 'react';
import {
   BrowserRouter as Router,
   Switch,
   Route,
   Redirect
} from "react-router-dom";
import { Container } from 'react-bootstrap';

import { KittyService } from './components/js/kitty.service';
import AppHeader from './components/AppHeader';
import AppFooter from './components/AppFooter';
import CatFactory from './components/factory/CatFactory';
import CatList from './components/cat/CatList';
import Home from './Home';

const kittyService = new KittyService();

export default function App() {

   return (
      <div>
         <Container className="p-5">
            <Router>
               <AppHeader />
               <Switch>
                  <Route exact path="/factory">
                     <CatFactory service={kittyService} />
                  </Route>
                  <Route exact path="/kitties">
                     <CatList service={kittyService} />
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
