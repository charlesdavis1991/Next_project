import { useState, useEffect, useCallback } from "react";
import api from "../../../../api/api";
import axios from "axios";
import { getToken } from "../../../../Utils/helper";

const useGetCloudStorage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCloudStorage = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/firmsetting-page/cloud-storage/`);
      setData(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCloudStorage();
  }, [fetchCloudStorage]);

  return { data, loading, error, refetch: fetchCloudStorage };
};

export default useGetCloudStorage;

const usePostCloudStorageCredentials = () => {
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = getToken();
  const origin =
    process.env.REACT_APP_BACKEND_URL || "https://dev.simplefirm.com";

  const saveCloudStorageCreds = async (formData) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${origin}/api/firmsetting-page/save-cloudstorage-credentials/`,
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

  return { saveCloudStorageCreds, success, loading, error };
};

export { usePostCloudStorageCredentials };
