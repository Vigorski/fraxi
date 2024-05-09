import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

const useQueryParameter = () => {
  const { search } = useLocation();
  const query = useMemo(() => new URLSearchParams(search), [search]);
  const getQuery = paramKey => query.get(paramKey);

  return [getQuery];
};

export default useQueryParameter;
