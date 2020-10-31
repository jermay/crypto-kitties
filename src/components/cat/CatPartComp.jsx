import React from 'react';
import '../css/cats.css';


export default function CatPartComp(props) {
    if (!props.parts) {
        return null;
    }
    let catParts = props.parts.length ?
        props.parts : [props.parts];

    return (
        catParts.map(part => {
            const childCatParts = (part.childParts || []).map(child =>
                <CatPartComp key={'comp-' + child.name} parts={child} />
            );

            return <div key={part.name}
                className={part.name}
                style={part.styles}
                >
                {childCatParts}
            </div>
        })
    );
}
