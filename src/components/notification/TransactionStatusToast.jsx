import React from 'react';
import { Spinner, Toast } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { RequestStatus } from '../js/utils';
import { dismissTransStatus, selectAllTransStatus } from './transStatusSlice';

const ToastTopLeft = styled(Toast)`
    position: absolute;
    left: 1rem;
    top: 4rem;
    z-index: 1020;
    box-shadow: 4px 6px 10px 0px #00000087;
`;

export default function TransactionStatusToast() {
  const dispatch = useDispatch();
  const transStatuses = useSelector(selectAllTransStatus);

  const toasts = transStatuses.map((trans) => {
    const color = trans.status === RequestStatus.failed
      ? 'bg-warning' : 'bg-info text-white';

    const spinner = trans.status === RequestStatus.loading
      ? <Spinner animation="grow" /> : null;

    const autoHideDelay = trans.status === RequestStatus.succeeded
      ? 3000 : 99999999;

    return (
      <ToastTopLeft
        key={trans.id}
        className={color}
        show
        autohide
        delay={autoHideDelay}
        onClose={() => dispatch(dismissTransStatus(trans.id))}
      >
        <Toast.Header>
          <small className="mr-auto">Transaction Status</small>
        </Toast.Header>
        <Toast.Body>
          {spinner}
          {' '}
          {trans.message}
        </Toast.Body>
      </ToastTopLeft>
    );
  });

  return (
    <>
      {toasts}
    </>
  );
}
