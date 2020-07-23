import React from 'react';
import AppHeader from './components/AppHeader';
import AppFooter from './components/AppFooter';
import Cat from './components/Cat';
import CatSettings from './components/CatSettings'

export default function App() {
    // TODO: div style="margin-top: 12vh;margin-bottom: 10vh;"
    return (
        <div>
            <div className="container p-5" >
                <AppHeader />
                <div className="row">
                    <Cat />
                    <CatSettings />
                    <AppFooter />
                </div>
            </div>
        </div>
    )
}
