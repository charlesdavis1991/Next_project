import { useState, useEffect, useCallback } from "react";
import api from "../../../../api/api";

const useGetCoPilotStates = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCoPilotStates = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(
        `/api/firmsetting-page/update-copilot-states/`
      );
      setData(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCoPilotStates();
  }, [fetchCoPilotStates]);

  return { data, loading, error, refetch: fetchCoPilotStates };
};

export default useGetCoPilotStates;

const useUpdateCoPilotStates = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const updateCoPilotStates = async (payload) => {
    setLoading(true);
    try {
      const response = await api.post(
        `/api/firmsetting-page/update-copilot-states/`,
        payload
      );
      setSuccess(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return { updateCoPilotStates, loading, error, success };
};

export { useUpdateCoPilotStates };
