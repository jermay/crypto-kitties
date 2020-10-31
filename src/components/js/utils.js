import { useLocation } from 'react-router-dom';

export const RequestStatus = {
    idle: 'idle',
    loading: 'loading',
    succeeded: 'succeeded',
    confirmed: 'confirmed',
    failed: 'failed'
}

export function useQuery() {
    return new URLSearchParams(useLocation().search);
}

export function setRequestStatusLoading(state, action) {
    state.status = RequestStatus.loading;
}

export function setRequestStatusSucceeded(state, action) {
    state.status = RequestStatus.succeeded;
}

export function setRequestStatusFailed(state, action) {
    state.status = RequestStatus.failed;
    state.error = action.error.message;
}