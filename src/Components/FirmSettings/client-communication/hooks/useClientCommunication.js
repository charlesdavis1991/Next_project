import { useState, useEffect, useCallback } from "react";
import api from "../../../../api/api";

const useClientCommuincation = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchClientCommunciationData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(
        `/api/firmsetting-page/client-communication/`
      );
      setData(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClientCommunciationData();
  }, [fetchClientCommunciationData]);

  return { data, loading, error, refetch: fetchClientCommunciationData };
};

export default useClientCommuincation;

const useSaveClientCommunication = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const SaveClientCommunication = async (payload) => {
    setLoading(true);
    try {
      const response = await api.post(
        `/api/firmsetting-page/client-communication/`,
        payload
      );
      setSuccess(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return { SaveClientCommunication, loading, error, success };
};

export { useSaveClientCommunication };
