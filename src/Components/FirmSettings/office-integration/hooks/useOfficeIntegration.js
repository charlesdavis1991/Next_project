import { useState, useEffect, useCallback } from "react";
import api from "../../../../api/api";

const usePostOfficeLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const postOffice = async (payload) => {
    setLoading(true);
    try {
      const response = await api.post(`/api/firmsetting-page/office/`, payload);
      setSuccess(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return { postOffice, loading, error, success };
};

export { usePostOfficeLogin };

const useGetOfficeIntegration = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOfficeIntegration = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/firmsetting-page/office/`);
      setData(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOfficeIntegration();
  }, [fetchOfficeIntegration]);

  return { data, loading, error, refetch: fetchOfficeIntegration };
};

export default useGetOfficeIntegration;
