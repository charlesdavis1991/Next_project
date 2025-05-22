import { useCallback, useEffect, useState } from "react";
import api, { api_without_cancellation } from "../../../api/api";

const useGetProviderInfo = (initialId) => {
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [id, setId] = useState(initialId);

  const fetchCaseProviderInfo = useCallback(
    async (newId) => {
      if (newId !== undefined) {
        setId(newId);
        return;
      }
      if (!id) return;

      setError(null);
      setIsLoading(true);

      try {
        const response = await api_without_cancellation.get(
          `/api/treatment-opt/case-provider-contacts/${id}/`
        );
        console.log("response", response);
        setData(response.data);
      } catch (error) {
        setError(error);
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    },
    [id]
  );

  useEffect(() => {
    fetchCaseProviderInfo();
  }, [fetchCaseProviderInfo]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchCaseProviderInfo,
    setProviderId: setId,
  };
};

export { useGetProviderInfo };
