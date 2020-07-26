import React from 'react';
import styled from 'styled-components';

const Div = styled.div`
    position: absolute;
    left: 20px;
    bottom: 5px;
`;

const Span = styled.span`
    margin-left: 0.25rem;
`;

export default function DnaViewer(props) {

    return (
        <Div id="catDNA">
            <b>
                DNA:
                {
                    props.dna.cattributes.map(cattribute =>
                        <Span key={cattribute.name}>{cattribute.strValue}</Span>
                    )
                }
            </b>
        </Div>
    )
}
