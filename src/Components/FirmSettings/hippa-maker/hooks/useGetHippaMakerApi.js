import { useState, useEffect, useCallback } from "react";
import api from "../../../../api/api";

const useGetXYValues = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchHippaMakerXYValues = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/firmsetting-page/xy-values/`);
      setData(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHippaMakerXYValues();
  }, [fetchHippaMakerXYValues]);

  return { data, loading, error, refetch: fetchHippaMakerXYValues };
};

export default useGetXYValues;

const useSaveXYValues = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const saveXYValues = async (payload) => {
    setLoading(true);
    try {
      const response = await api.post(
        `/api/firmsetting-page/xy-values/`,
        payload
      );
      setSuccess(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return { saveXYValues, loading, error, success };
};

export { useSaveXYValues };

const useGenerateHippaTempalte = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const saveTemplate = async (payload) => {
    setLoading(true);
    const formData = new FormData();
    if (payload) {
      formData.append("file", payload.file);
      formData.append("x_value", payload.x_value);
      formData.append("y_value", payload.y_value);
    }

    try {
      const response = await api.post(
        `/api/firmsetting-page/generate-hippa-template/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
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

  return { saveTemplate, loading, error, success };
};

export { useGenerateHippaTempalte };

const useDeleteHippaTemplate = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const deleteTemplate = async () => {
    setLoading(true);
    try {
      const response = await api.get(
        `/api/firmsetting-page/delete-hippa-template/`
      );
      setSuccess(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return { deleteTemplate, loading, error, success };
};

export { useDeleteHippaTemplate };
