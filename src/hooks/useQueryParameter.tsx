import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

type UseQueryParameterReturn = (paramKey: string) => string | null;

const useQueryParameter = (): UseQueryParameterReturn => {
  const { search } = useLocation();
  const query = useMemo(() => new URLSearchParams(search), [search]);
  const getQuery = (paramKey: string) => query.get(paramKey);

  return getQuery;
};

export default useQueryParameter;
