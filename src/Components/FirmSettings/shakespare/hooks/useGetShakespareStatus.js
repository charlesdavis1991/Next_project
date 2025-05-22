import React, { useCallback, useEffect, useState } from "react";
import api from "../../../../api/api";

const useGetShakespare = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchShakespareStatus = useCallback(async () => {
    try {
      const response = await api.get(
        `/api/firmsetting-page/shakespeare-status/`
      );
      setData(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchShakespareStatus();
  }, [fetchShakespareStatus]);

  return { data, loading, error, refetch: fetchShakespareStatus };
};

export default useGetShakespare;

const useSaveShakespareStatus = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const saveShakespareStatus = async (payload) => {
    setLoading(true);
    try {
      const response = await api.post(
        `/api/firmsetting-page/shakespeare-status/`,
        payload
      );
      setSuccess(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return { saveShakespareStatus, loading, error, success };
};

export { useSaveShakespareStatus };
