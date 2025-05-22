import { useState, useEffect, useCallback } from "react";
import api from "../../../../api/api";

const useGetLoginTimeout = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLoginTimeout = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(
        `/api/firmsetting-page/edit-logut-timeout/`
      );
      setData(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLoginTimeout();
  }, [fetchLoginTimeout]);

  return { data, loading, error, refetch: fetchLoginTimeout };
};

export default useGetLoginTimeout;

const useSaveLoginTimeout = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const saveLoginTimeout = async (payload) => {
    setLoading(true);
    try {
      const response = await api.post(
        `/api/firmsetting-page/edit-logut-timeout/`,
        payload
      );
      setSuccess(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return { saveLoginTimeout, loading, error, success };
};

export { useSaveLoginTimeout };
