import { useCallback, useEffect, useState } from "react";
import api from "../../../../api/api";

const useGetTaskDefault = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTaskDefault = useCallback(async () => {
    try {
      const response = await api.get(
        `/api/firmsetting-page/edit-task-defaults/`
      );
      setData(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTaskDefault();
  }, [fetchTaskDefault]);

  return { data, loading, error, refetch: fetchTaskDefault };
};

export default useGetTaskDefault;
