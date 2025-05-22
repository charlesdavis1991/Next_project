import { useState, useCallback } from "react";
import api, { api_without_cancellation } from "../../../../api/api";

const useGetProviderBySearchTerms = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProviderBySearchTerm = useCallback(async (queryParams = {}) => {
    if (!queryParams || Object.keys(queryParams).length === 0) return;

    setLoading(true);
    console.log(queryParams);
    try {
      const response = await api_without_cancellation.get(
        `/api/providers/search-provider-locations/`,
        {
          params: queryParams,
        }
      );
      setData(response.data);
      setError(null);
    } catch (error) {
      console.log(error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, fetchProviderBySearchTerm };
};

export default useGetProviderBySearchTerms;
