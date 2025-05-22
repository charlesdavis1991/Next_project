import { useState, useEffect, useMemo } from "react";
import api from "../../../../api/api";

const useGetUserPermission = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserPermissions = async () => {
      setLoading(true);
      try {
        const response = await api.get(
          `/api/firmsetting-page/user-permissions/`
        );
        setData(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPermissions();
  }, []);

  return { data, loading, error };
};

export default useGetUserPermission;
