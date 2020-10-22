import React from 'react'
import { Alert } from 'react-bootstrap';

export default function BirthAlert(props) {
    const {
        show,
        handleBirthEventClose,
        event
    } = props;
    const { kittyId, genes } = event || {};

    return (
        <Alert className="w-100 ml-4"
            variant="success"
            dismissible
            show={show}
            onClose={handleBirthEventClose}>
            <strong>A new kitty was born! </strong>
            <span>KittyId: {kittyId} DNA: {genes}</span>
        </Alert>
    )
}
