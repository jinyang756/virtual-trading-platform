import useSWR from 'swr';
import apiClient from '../services/api';

const fetcher = (url) => apiClient.get(url);

export default function usePositions(userId) {
  const { data, error, isLoading } = useSWR(
    userId ? `/trade/positions/${userId}` : null, 
    fetcher
  );
  
  return {
    positions: data || [],
    isLoading,
    isError: !!error
  };
}