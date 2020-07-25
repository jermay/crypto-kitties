import React from 'react';
import './css/cats.css';
import styled from 'styled-components';

const Div = styled.div`
    background-color: ${props => '#' + props.color}
`;

export default function Cat(props) {
    // console.log('cat props: ', props);
    let colorPrimary = props.dna.getCattribute('bodyColor').getCssColor();
    let accentColor = props.dna.getCattribute('accentColor').getCssColor();
    let eyeColor = props.dna.getCattribute('eyeColor').getCssColor();
    let earColor = props.dna.getCattribute('earColor').getCssColor();

    return (
        <Div className="cat">
            <Div className="cat-head-container">
                <Div className="cat-ears">
                    <Div color={colorPrimary} className="cat-ear cat-left-ear cat-color-body">
                        <Div color={earColor} className="cat-inner-ear cat-color-ears"></Div>
                    </Div>
                    <Div color={colorPrimary} className="cat-ear cat-right-ear cat-color-body">
                        <Div color={earColor} className="cat-inner-ear cat-inner-ear-right cat-color-ears"></Div>
                    </Div>
                </Div>

                <Div color={colorPrimary} className="cat-head cat-color-body">

                    <Div className="cat-eyes">
                        <Div color={eyeColor} className="cat-eye cat-color-eyes">
                            <Div className="cat-pupils"></Div>
                        </Div>
                        <Div color={eyeColor} className="cat-eye cat-color-eyes">
                            <Div className="cat-pupils"></Div>
                        </Div>
                    </Div>

                    <Div className="cat-muzzle">
                        <Div className="cat-nose"></Div>
                        <Div color={accentColor} className="cat-mouth cat-color-accent"></Div>
                        <Div color={accentColor} className="cat-mouth cat-mouth-right cat-color-accent"></Div>
                        <Div color={accentColor} className="cat-mouth cat-mouth-bottom cat-color-accent"></Div>
                    </Div>
                </Div>
            </Div>

            <Div className="cat-body-container">
                <Div color={colorPrimary} className="cat-body cat-color-body">
                    <Div color={accentColor} className="cat-belly cat-color-accent"></Div>

                    <Div color={colorPrimary} className="cat-leg cat-color-body">
                        <Div color={accentColor} className="cat-foot cat-color-accent"></Div>
                    </Div>
                    <Div color={colorPrimary} className="cat-leg cat-leg-right cat-color-body">
                        <Div color={accentColor} className="cat-foot cat-color-accent"></Div>
                    </Div>
                </Div>

                <Div color={colorPrimary} className="cat-tail cat-color-body"></Div>
            </Div>
        </Div>
    );
}
