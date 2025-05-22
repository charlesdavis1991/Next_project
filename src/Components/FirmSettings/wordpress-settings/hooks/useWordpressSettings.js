import { useCallback, useEffect, useState } from "react";
import api from "../../../../api/api";

const useWordPressSettings = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWordPressSettings = useCallback(async () => {
    try {
      const response = await api.get(
        `/api/firmsetting-page/wordpress-setting/`
      );
      setData(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWordPressSettings();
  }, [fetchWordPressSettings]);

  return { data, loading, error, refetch: fetchWordPressSettings };
};

export default useWordPressSettings;
