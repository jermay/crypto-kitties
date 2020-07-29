import React from 'react';
import styled from 'styled-components';

const CatElement = styled.div`
    background-color: ${props => props.backgroundColor};
    background: ${props => props.background};
    background-image: ${props => props.backgroundImage};
    background-position: ${props => props.backgroundPosition};
    background-size: ${props => props.backgroundSize};
    width: ${props => props.width};
    height: ${props => props.height};
    display: ${props => props.display};
    position: ${props => props.position};
    top: ${props => props.top};
    left: ${props => props.left};
    margin: ${props => props.margin};
    padding: ${props => props.padding};
    border-radius: ${props => props.borderRadius};
    border: ${props => props.border};
    border-top: ${props => props.borderTop};
    border-right: ${props => props.borderRight};
    border-bottom: ${props => props.borderBottom};
    border-left: ${props => props.borderLeft};
    transform: ${props => props.transform};
    z-index: ${props => props.zIndex};
`;

export default function CatPartComp(props) {
    // console.log('props', props);
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

            return <CatElement key={part.name} className={part.name}
                backgroundColor={part.color}
                background={part.background}
                backgroundImage={part.backgroundImage}
                backgroundPosition={part.backgroundPosition}
                backgroundSize={part.backgroundSize}
                width={part.width}
                height={part.height}
                display={part.display}
                position={part.position}
                top={part.top}
                left={part.left}
                margin={part.margin}
                padding={part.padding}
                borderRadius={part.borderRadius}
                border={part.border}
                borderTop={part.borderTop}
                borderRight={part.borderRight}
                borderBottom={part.borderBottom}
                borderLeft={part.borderLeft}
                transform={part.transform}
                zIndex={part.zIndex}
            >
                {childCatParts}
            </CatElement>
        })
    );
}
