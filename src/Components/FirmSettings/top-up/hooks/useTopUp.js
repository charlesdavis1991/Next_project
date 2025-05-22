import { useCallback, useEffect, useState } from "react";
import api from "../../../../api/api";

const useGetTopUp = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTopUp = useCallback(async () => {
    try {
      const response = await api.get(`/api/firmsetting-page/top-up/`);
      setData(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTopUp();
  }, [fetchTopUp]);

  return { data, loading, error, refetch: fetchTopUp };
};

export default useGetTopUp;
