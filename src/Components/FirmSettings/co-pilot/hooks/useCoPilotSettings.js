import { useState, useEffect, useCallback } from "react";
import api from "../../../../api/api";

const useGetCoPilot = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCoPilot = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/firmsetting-page/update-copilot/`);
      setData(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCoPilot();
  }, [fetchCoPilot]);

  return { data, loading, error, refetch: fetchCoPilot };
};

export default useGetCoPilot;

const useUpdateCoPilot = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const updateCoPilot = async (payload) => {
    setLoading(true);
    try {
      const response = await api.post(
        `/api/firmsetting-page/update-copilot/`,
        payload
      );
      setSuccess(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return { updateCoPilot, loading, error, success };
};

export { useUpdateCoPilot };

const useGetCoPilotUserControls = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCoPilotUserControls = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(
        `/api/firmsetting-page/update-copilot-usercontrols/`
      );
      setData(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCoPilotUserControls();
  }, [fetchCoPilotUserControls]);

  return { data, loading, error, refetch: fetchCoPilotUserControls };
};

export { useGetCoPilotUserControls };

const useUpdateUserControl = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const updateUserControl = async (payload) => {
    setLoading(true);
    try {
      const response = await api.post(
        `/api/firmsetting-page/update-copilot-usercontrols/`,
        payload
      );
      setSuccess(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return { updateUserControl, loading, error, success };
};

export { useUpdateUserControl };
