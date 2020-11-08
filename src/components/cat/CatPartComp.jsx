import React from 'react';
import PropTypes from 'prop-types';
import '../css/cats.css';
import { CatPart } from '../js/catFactory';


export default function CatPartComp({ parts, }) {
  if (!parts) {
    return null;
  }
  const catParts = parts.length
    ? parts : [parts];

  return (
    catParts.map((part) => {
      const childCatParts = (part.childParts || []).map((child) => (
        <CatPartComp key={`comp-${child.name}`} parts={child} />
      ));

      return (
        <div
          key={part.name}
          className={part.name}
          style={part.styles}
        >
          {childCatParts}
        </div>
      );
    })
  );
}

CatPartComp.propTypes = {
  parts: PropTypes.oneOfType([
    PropTypes.instanceOf(CatPart),
    PropTypes.arrayOf(PropTypes.instanceOf(CatPart))
  ]).isRequired,
};
