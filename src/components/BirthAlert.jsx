import React from 'react'
import { Alert } from 'react-bootstrap';

export default function BirthAlert(props) {
    return (
        <Alert className="w-100 ml-4"
            variant="success"
            dismissible
            show={props.show}
            onClose={props.handleBirthEventClose}>
            <strong>A new kitty was born! </strong>
            <span>KittyId: {props.event.kittyId} DNA: {props.event.genes}</span>
        </Alert>
    )
}
