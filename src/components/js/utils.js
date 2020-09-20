import { useLocation } from 'react-router-dom';

export const requestStatus = {
    idle: 'idle',
    loading: 'loading',
    succeeded: 'succeeded',
    failed: 'failed'
}

export function useQuery() {
    return new URLSearchParams(useLocation().search);
}
