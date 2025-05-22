import { useState, useEffect, useCallback } from "react";
import api from "../../../../api/api";

const useGetCoPilotCaseTypes = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCoPilotCaseTypes = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(
        `/api/firmsetting-page/update-copilot-casetype/`
      );
      setData(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCoPilotCaseTypes();
  }, [fetchCoPilotCaseTypes]);

  return { data, loading, error, refetch: fetchCoPilotCaseTypes };
};

export default useGetCoPilotCaseTypes;

const useUpdateCoPilotCaseTypes = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const updateCoPilotCaseType = async (payload) => {
    setLoading(true);
    try {
      const response = await api.post(
        `/api/firmsetting-page/update-copilot-casetype/`,
        payload
      );
      setSuccess(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return { updateCoPilotCaseType, loading, error, success };
};

export { useUpdateCoPilotCaseTypes };
