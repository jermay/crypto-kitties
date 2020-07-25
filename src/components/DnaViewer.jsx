import React from 'react';

export default function DnaViewer(props) {

    return (
        <div className="dnaDiv" id="catDNA">
            <b>
                DNA:
                {
                    props.dna.cattributes.map(cattribute =>
                        <span key={cattribute.name}>{cattribute.value}</span>
                    )
                }
            </b>
        </div>
    )
}
