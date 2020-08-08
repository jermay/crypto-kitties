import React from 'react';
import { Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

export default function AppHeader() {
    return (
        <Nav variant="pills">
            <NavLink to="/" className="navbar-brand btn">
                <img src="logo192.png"
                    alt="React"
                    width="30" height="30" />
                Academy Kitties
            </NavLink>
            <NavLink to="/factory" className="btn nav-link">Factory</NavLink>
        </Nav>
    )
}
