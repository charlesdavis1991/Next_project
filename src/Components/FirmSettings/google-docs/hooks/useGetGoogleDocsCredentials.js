import { useState, useEffect, useCallback } from "react";
import api from "../../../../api/api";
import axios from "axios";
import { getToken } from "../../../../Utils/helper";

const useGetGoogleDocsCredentials = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchGoogleDocsCredentials = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(
        `/api/firmsetting-page/upload-googledocs-credentials/`
      );
      setData(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGoogleDocsCredentials();
  }, [fetchGoogleDocsCredentials]);

  return { data, loading, error, refetch: fetchGoogleDocsCredentials };
};

export default useGetGoogleDocsCredentials;

const usePostGoogleDocsCreds = () => {
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = getToken();
  const origin =
    process.env.REACT_APP_BACKEND_URL || "https://dev.simplefirm.com";

  const saveGoogleDocsCreds = async (formData) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${origin}/api/firmsetting-page/upload-googledocs-credentials/`,
        formData,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setSuccess(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return { saveGoogleDocsCreds, success, loading, error };
};

export { usePostGoogleDocsCreds };
