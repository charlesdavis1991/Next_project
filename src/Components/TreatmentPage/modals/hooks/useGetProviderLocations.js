import { useState, useCallback } from "react";
import api from "../../../../api/api";

const useGetProviderLocations = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProviderLocations = useCallback(async (queryParams = {}) => {
    if (!queryParams || Object.keys(queryParams).length === 0) return;

    setLoading(true);
    try {
      const response = await api.get(`/api/providers/filter-locations/`, {
        params: queryParams,
      });
      setData(response.data);
      setError(null);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, fetchProviderLocations };
};

export default useGetProviderLocations;
