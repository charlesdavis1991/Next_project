import { useState, useEffect, useMemo, useCallback } from "react";
import api from "../../../../api/api";

const useUserAccounts = (activeTab) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUserAccounts = useCallback(async () => {
    if (!activeTab) return;

    setLoading(true);
    try {
      const queryParam = getQueryParam(activeTab);
      const response = await api.get(`/api/firmsetting-page/user-accounts/`, {
        params: { q: queryParam },
      });
      setData(response.data);
      setError(null);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchUserAccounts();
  }, [fetchUserAccounts]);

  return { data, loading, error, refetch: fetchUserAccounts };
};

const getQueryParam = (activeTab) => {
  switch (activeTab) {
    case "all":
      return "All";
    case "active":
      return "Active";
    case "in-active":
      return "InActive";
    default:
      return "";
  }
};

export default useUserAccounts;
