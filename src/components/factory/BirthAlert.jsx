import React from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'react-bootstrap';

export default function BirthAlert(props) {
  const {
    show,
    handleBirthEventClose,
    event,
  } = props;
  const { kittyId, genes, } = event || {};

  return (
    <Alert
      className="w-100 ml-4"
      variant="success"
      dismissible
      show={show}
      onClose={handleBirthEventClose}
    >
      <strong>A new kitty was born! </strong>
      <span>
        KittyId:
        {kittyId}
        {' '}
        DNA:
        {genes}
      </span>
    </Alert>
  );
}

BirthAlert.propTypes = {
  show: PropTypes.bool.isRequired,
  handleBirthEventClose: PropTypes.func.isRequired,
  event: PropTypes.shape({
    owner: PropTypes.string,
    kittyId: PropTypes.string,
    mumId: PropTypes.string,
    dadId: PropTypes.string,
    genes: PropTypes.string,
  }),
};

BirthAlert.defaultProps = {
  event: {},
};
