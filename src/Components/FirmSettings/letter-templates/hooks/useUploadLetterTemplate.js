import { useState, useEffect, useCallback } from "react";
import api from "../../../../api/api";
import axios from "axios";

const useGetUploadLetterTemplate = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUploadLetterTemplate = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(
        `/api/firmsetting-page/upload-dl-template/`
      );
      setData(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUploadLetterTemplate();
  }, [fetchUploadLetterTemplate]);

  return { data, loading, error, refetch: fetchUploadLetterTemplate };
};

export default useGetUploadLetterTemplate;

const useUploadLetterTemplate = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const token = localStorage.getItem("token");
  const origin =
    process.env.REACT_APP_BACKEND_URL || "https://dev.simplefirm.com";

  const uploadLetterTemplate = async (formData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post(
        `${origin}/api/firmsetting-page/upload-dl-template/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
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

  return { uploadLetterTemplate, loading, error, success };
};

export { useUploadLetterTemplate };



