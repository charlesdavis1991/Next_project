import { useState, useEffect, useMemo } from "react";
import api from "../../../../api/api";

const useGetRedFlagAuto = (activeTab) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRedFlagAuto = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/api/firmsetting-page/red-flag-auto/`);
        setData(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchRedFlagAuto();
  }, []);

  return { data, loading, error };
};

export default useGetRedFlagAuto;
