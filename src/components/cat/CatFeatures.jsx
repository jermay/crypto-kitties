import React from 'react'
import { Cattribute } from '../js/dna';

export default function CatFeatures(props) {
    debugger;
    if (!props.cat.kittyId) {
        console.log('CatFeatures: no kitty object');
        return null;
    }

    const cattributes = props.dna.cattributes
        .filter(c => c.type === Cattribute.TYPES.cattribute)
        .map(c =>
            <React.Fragment>
                <span>{c.displayName}: {c.valueName}</span><br/>
            </React.Fragment>
        );

    return (
        <div>
            <strong># {props.cat.kittyId} Gen {props.cat.generation}</strong><br />
            {cattributes}
        </div>
    )
}
