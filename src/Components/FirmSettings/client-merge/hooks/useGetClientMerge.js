import { useCallback, useEffect, useState } from "react";
import api from "../../../../api/api";

const useGetClientFilters = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchClients = useCallback(async () => {
    try {
      const response = await api.get(`/api/firmsetting-page/client-filter/`);
      setData(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  return { data, loading, error, refetch: fetchClients };
};

export default useGetClientFilters;

const useSaveClients = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const clientMerge = async (payload) => {
    setLoading(true);
    try {
      const response = await api.post(
        `/api/firmsetting-page/client-merge/`,
        payload
      );
      setSuccess(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return { clientMerge, loading, error, success };
};

export { useSaveClients };
