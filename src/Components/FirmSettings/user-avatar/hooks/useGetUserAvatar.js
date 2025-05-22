import { useState, useEffect, useCallback } from "react";
import api from "../../../../api/api";

const useGetUserAvatar = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUserAvatars = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/firmsetting-page/user-avatars/`);
      setData(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserAvatars();
  }, [fetchUserAvatars]);

  return { data, loading, error, refetch: fetchUserAvatars };
};

export default useGetUserAvatar;
