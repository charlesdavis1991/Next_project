import { useState, useEffect, useCallback } from "react";
import api from "../../../../api/api";

const useGetCaseTypeRoles = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCaseTypeRoles = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/firmsetting-page/case-type-roles/`);
      setData(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCaseTypeRoles();
  }, [fetchCaseTypeRoles]);

  return { data, loading, error, refetch: fetchCaseTypeRoles };
};

export default useGetCaseTypeRoles;
