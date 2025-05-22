import { useState, useEffect, useCallback } from "react";
import api from "../../../../api/api";

const useGetUserRoles = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUserRoles = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/firmsetting-page/user-roles/`);
      setData(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserRoles();
  }, [fetchUserRoles]);

  return { data, loading, error, refetch: fetchUserRoles };
};

const useGetFirmUserTypes = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFirmUserType = async () => {
      setLoading(true);
      try {
        const response = await api.get(
          `/api/firmsetting-page/firm-user-types/`
        );
        setData(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchFirmUserType();
  }, []);

  return { data, loading, error };
};

export { useGetUserRoles, useGetFirmUserTypes };
