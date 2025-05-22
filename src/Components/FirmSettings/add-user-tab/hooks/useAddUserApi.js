import { useState, useEffect, useCallback } from "react";
import api from "../../../../api/api";

const useGetUserTypes = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUserTypes = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/firmsetting-page/get-user-types/`);
      setData(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserTypes();
  }, [fetchUserTypes]);

  return { data, loading, error, refetch: fetchUserTypes };
};

export default useGetUserTypes;

const useAddUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const saveAddUser = async (payload) => {
    setLoading(true);
    try {
      const response = await api.post(
        `/api/firmsetting-page/add-user/`,
        payload
      );
      setSuccess(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return { saveAddUser, loading, error, success };
};

export { useAddUser };
