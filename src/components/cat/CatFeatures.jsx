import React from 'react'
import { Cattribute } from '../js/dna';
import { useState } from 'react';
import { useEffect } from 'react';
import { Alert } from 'react-bootstrap';
import moment from 'moment';

export default function CatFeatures(props) {
    const [onCooldown, setOnCooldown] = useState(false);
    const [toReadyTxt, setToReadyTxt] = useState('');

    useEffect(() => {
        const timer = setInterval(() => {
            const now = moment();
            const cooldownEndTime = moment.unix(props.cat.cooldownEndTime);
            if (now.isBefore(cooldownEndTime)) {
                setOnCooldown(true);
                const newReadyText = now.to(cooldownEndTime);
                setToReadyTxt(newReadyText);
            } else {
                setOnCooldown(false);
                clearInterval(timer);
            }
        }, 1000);

        return () => clearInterval(timer);

    })

    if (!props.cat.kittyId) {
        return null;
    }

    const cattributes = props.dna.cattributes
        .filter(c => c.type === Cattribute.TYPES.cattribute)
        .map(c =>
            <span key={c.name}>{c.displayName}: {c.valueName}</span>
        );

    const breedCountdown = onCooldown ?
        <Alert variant="info">
            <small>Ready to breed {toReadyTxt}</small>
        </Alert>
        : null;

    return (
        <div className="d-flex flex-column">
            <strong>
                <span># {props.cat.kittyId} </span>
                <span>Gen {props.cat.generation} </span>
                <span>
                    <span role="img" aria-label="timer clock">⏲</span>
                    <span>{props.cat.cooldown.name} ({props.cat.cooldown.durationName})</span>
                </span>
            </strong>
            {breedCountdown}
            {cattributes}
        </div>
    )
}
