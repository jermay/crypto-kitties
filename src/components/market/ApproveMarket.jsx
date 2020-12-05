import React from 'react';
import { Alert, Button, Col } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { approveMarket } from '../wallet/walletSlice';

const KittyAlert = styled(Alert)`
  width: 19rem;
`;

export default function ApproveMarket({ show = true, handleApproveCancel, }) {
  const dispatch = useDispatch();

  if (!show) {
    return null;
  }

  const onApproveClicked = () => dispatch(approveMarket());

  return (
    <Col>
      <KittyAlert
        variant="info"
      >
        In order to sell your kitties you need to give the
        Marketplace permission to transfer your kitties on your behalf.
        This is required so the buyer and seller do not need to be online
        at the same time.
      </KittyAlert>
      <Button onClick={onApproveClicked}>
        YES. It&apos;s OK. You are approved!
      </Button>
      <Button
        variant="warning"
        onClick={handleApproveCancel}
      >
        Cancel
      </Button>
    </Col>

  );
}

ApproveMarket.propTypes = {
  handleApproveCancel: PropTypes.func.isRequired,
  show: PropTypes.bool,
};

ApproveMarket.defaultProps = {
  show: true,
};
