import React from 'react';
import { Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import { Service } from './js/service';

export default function AppHeader() {
    const [init, setInit] = useState(false);
    const [showFactory, setShowFactory] = useState(false);

    useEffect(() => {
        if (!init) {
            setInit(true);
            Service.kitty.isUserOwner()
                .then(result => setShowFactory(result));
        }
    }, [init, showFactory])

    const factory = showFactory ?
        <NavLink to="/factory" className="btn nav-link">Factory</NavLink>
        : null;

    return (
        <Nav variant="pills" className="mb-2">
            <NavLink to="/" className="navbar-brand btn">
                <img src="logo192.png"
                    alt="React"
                    width="30" height="30" />
                Academy Kitties
            </NavLink>
            <NavLink to="/kitties" className="btn nav-link">My Kitties</NavLink>
            <NavLink to="/breed" className="btn nav-link">Breed</NavLink>
            <NavLink to="/market" className="btn nav-link">Marketplace</NavLink>
            {factory}
        </Nav>
    )
}
