import React from 'react'
import { Cattribute } from '../js/dna';

export default function CatFeatures(props) {
    if (!props.cat.kittyId) {
        return null;
    }

    const cattributes = props.dna.cattributes
        .filter(c => c.type === Cattribute.TYPES.cattribute)
        .map(c =>
            <span key={c.name}>{c.displayName}: {c.valueName}</span>
        );

    return (
        <div className="d-flex flex-column">
            <strong># {props.cat.kittyId} Gen {props.cat.generation}</strong>
            {cattributes}
        </div>
    )
}
