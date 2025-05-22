import { useCallback, useEffect, useState } from "react";
import api from "../../../../api/api";

const useGetObjections = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchObjections = useCallback(async () => {
    try {
      const response = await api.get(`/api/firmsetting-page/get-objections/`);
      setData(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchObjections();
  }, [fetchObjections]);

  return { data, loading, error, refetch: fetchObjections };
};

export default useGetObjections;

const useObjectionsFilters = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchObjectionsFilters = useCallback(async () => {
    try {
      const response = await api.get(
        `/api/firmsetting-page/objections-filter-data/`
      );
      setData(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchObjectionsFilters();
  }, [fetchObjectionsFilters]);

  return { data, loading, error, refetch: fetchObjectionsFilters };
};

export { useObjectionsFilters };

const useSaveObjection = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const saveObjection = async (payload) => {
    setLoading(true);
    try {
      const response = await api.post(
        `/api/firmsetting-page/add-objection/`,
        payload
      );
      setSuccess(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return { saveObjection, loading, error, success };
};

export { useSaveObjection };

const useEditObjection = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const editObjection = async (payload) => {
    setLoading(true);
    try {
      const response = await api.post(
        `/api/firmsetting-page/edit-objection/`,
        payload
      );
      setSuccess(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return { editObjection, loading, error, success };
};

export { useEditObjection };

const useGetObjectionById = (objectionId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEditObjectionById = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/firmsetting-page/edit-objection/`, {
        params: { objection_id: objectionId },
      });
      setData(response.data);
      setError(null);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [objectionId]);

  useEffect(() => {
    fetchEditObjectionById();
  }, [fetchEditObjectionById]);

  return { data, loading, error, refetch: fetchEditObjectionById };
};

export { useGetObjectionById };

const useGetCaseType = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCaseTypes = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/general/case_types/`);
      setData(response.data);
      setError(null);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCaseTypes();
  }, [fetchCaseTypes]);

  return { data, loading, error, refetch: fetchCaseTypes };
};

export { useGetCaseType };
