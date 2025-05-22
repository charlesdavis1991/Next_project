import { useState, useEffect, useCallback } from "react";
import api from "../../../../api/api";

const useGetLetterTemplates = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLetterTemplates = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/firmsetting-page/get-dl-templates/`);
      setData(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLetterTemplates();
  }, [fetchLetterTemplates]);

  return { data, loading, error, refetch: fetchLetterTemplates };
};

export default useGetLetterTemplates;

const useEditLetterTemplate = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const editLetterTemplate = async (payload) => {
    setLoading(true);
    try {
      const response = await api.post(
        `/api/firmsetting-page/edit-dl-template/`,
        payload,
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

  return { editLetterTemplate, loading, error, success };
};

export { useEditLetterTemplate };

const useDeleteLetterTemplate = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const deleteTemplate = async (payload) => {
    setLoading(true);
    try {
      const response = await api.get(
        `/api/firmsetting-page/delete-dl-template/`,
        {
          params: {
            template_id: payload,
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

  return { deleteTemplate, loading, error, success };
};

export { useDeleteLetterTemplate };

const useCopyLetterTemplate = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const copyTemplate = async (payload) => {
    setLoading(true);
    try {
      const response = await api.post(
        `/api/firmsetting-page/copy-dl-template/`,
        payload
      );
      setSuccess(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return { copyTemplate, loading, error, success };
};

export { useCopyLetterTemplate };
