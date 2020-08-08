import React from 'react';
import { Container } from 'react-bootstrap';

import AppHeader from './components/AppHeader';
import AppFooter from './components/AppFooter';
import CatFactory from './components/CatFactory';

export default function App() {

    return (
        <div>
            <Container className="p-5">
                <AppHeader />
                <CatFactory />
                <AppFooter />
            </Container>
        </div>
    )
}
