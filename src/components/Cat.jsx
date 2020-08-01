import React from 'react';
import styled from 'styled-components';
import CatPartComp from './CatPartComp';


const Div = styled.div`
    background-color: ${props => '#' + props.color};
`;

export default function Cat(props) {
    return (
        <Div className="cat">
            <CatPartComp parts={props.model.parts} />
        </Div>
    );
}
