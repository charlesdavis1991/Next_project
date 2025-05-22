import { useCallback, useEffect, useState } from "react";
import api from "../../../../api/api";

const useGetFirmBilling = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFirmBilling = useCallback(async () => {
    try {
      const response = await api.get(
        `/api/firmsetting-page/edit-firm-billing/`
      );
      setData(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFirmBilling();
  }, [fetchFirmBilling]);

  return { data, loading, error, refetch: fetchFirmBilling };
};

export default useGetFirmBilling;
