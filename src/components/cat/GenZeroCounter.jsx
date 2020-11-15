import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

export default function GenZeroCounter({ msg, }) {
  const gen0Count = useSelector((state) => state.kitties.genZeroCount);
  const gen0Limit = useSelector((state) => state.kitties.genZeroLimit);

  if (!gen0Limit) {
    return null;
  }

  return (
    <span>
      {gen0Count}
      {' '}
      of
      {' '}
      {gen0Limit}
      {' '}
      {msg}
    </span>
  );
}

GenZeroCounter.propTypes = {
  msg: PropTypes.string,
};

GenZeroCounter.defaultProps = {
  msg: 'Gen 0',
};
