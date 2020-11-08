import { useLocation } from 'react-router-dom';

export const RequestStatus = {
  idle: 'idle',
  loading: 'loading',
  succeeded: 'succeeded',
  confirmed: 'confirmed',
  failed: 'failed',
};

export function useQuery() {
  return new URLSearchParams(useLocation().search);
}
