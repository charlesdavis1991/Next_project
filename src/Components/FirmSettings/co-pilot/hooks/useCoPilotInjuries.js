import { useState, useEffect, useCallback } from "react";
import api from "../../../../api/api";

const useGetCoPilotInjuries = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCoPilotInjuries = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(
        `/api/firmsetting-page/update-copilot-injuries/`
      );
      setData(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCoPilotInjuries();
  }, [fetchCoPilotInjuries]);

  return { data, loading, error, refetch: fetchCoPilotInjuries };
};

export default useGetCoPilotInjuries;

const useUpdateCoPilotInjuries = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const updateCoPilotInjuries = async (payload) => {
    setLoading(true);
    try {
      const response = await api.post(
        `/api/firmsetting-page/update-copilot-injuries/`,
        payload
      );
      setSuccess(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return { updateCoPilotInjuries, loading, error, success };
};

export { useUpdateCoPilotInjuries };
