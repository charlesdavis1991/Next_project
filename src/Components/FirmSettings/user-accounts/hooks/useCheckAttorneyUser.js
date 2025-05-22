import { useState, useEffect } from "react";
import api from "../../../../api/api";

const useCheckAttorneyUser = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserAccounts = async () => {
      setLoading(true);
      try {
        const response = await api.get(
          `/api/firmsetting-page/check-attorney-user/`
        );
        setData(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAccounts();
  }, []);

  return { data, loading, error };
};

export default useCheckAttorneyUser;
