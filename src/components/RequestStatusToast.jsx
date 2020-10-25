import React  from 'react';
import { Toast } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import { RequestStatus } from './js/utils';

const ToastTopRight = styled(Toast)`
    position: sticky;
    top: 0;
    z-index: 1020;
`;

export default function RequestStatusToast({ statusSelector }) {
    const status = useSelector(statusSelector);
    let show = false;
    let message = '';

    // this doesn't work
    const closeAfterDelay = () => {
        setTimeout(() => {
            show = false;
        }, 3000);
    }    

    // and for some reason show is false when status is confirmed
    switch (status) {
        case RequestStatus.loading:
            show = true;
            message = 'Waiting for result...';
            break;

        case RequestStatus.succeeded:
            break;
        case RequestStatus.confirmed:
            message = 'Success!';
            closeAfterDelay();
            break;

        case RequestStatus.failed:
            message = 'Oops... an error occured!';
            break;

        default:
            show = false;
            break;
    }
    // console.log('status: ', status, 'show: ', show, 'message:', message);

    return (
        <ToastTopRight
            className="bg-info text-white"
            show={show}>
            <Toast.Body>
                {message}
            </Toast.Body>
        </ToastTopRight>
    )
}
