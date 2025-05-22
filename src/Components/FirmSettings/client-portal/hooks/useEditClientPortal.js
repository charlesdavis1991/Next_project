import { useCallback, useEffect, useState } from "react";
import api from "../../../../api/api";

const useGetClientPortalSettings = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchClientPortal = useCallback(async () => {
    try {
      const response = await api.get(
        `/api/firmsetting-page/edit-clientportal-settings/`
      );
      setData(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClientPortal();
  }, [fetchClientPortal]);

  return { data, loading, error, refetch: fetchClientPortal };
};

export default useGetClientPortalSettings;
