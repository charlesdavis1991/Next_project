import { useState, useEffect, useCallback } from "react";
import api from "../../../../api/api";
import { getCaseId, getClientId } from "../../../../Utils/helper";

const useGetDocumentVariablesTest = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDocumentVariablesTest = useCallback(async (pageId) => {
    setLoading(true);
    try {
      const response = await api.get(
        `/api/firmsetting-page/document-variable-test/`,
        {
          params: {
            case_id: getCaseId(),
            client_id: getClientId(),
            page_id: pageId === "all" ? "" : pageId,
          },
        }
      );
      setData(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, refetch: fetchDocumentVariablesTest };
};

export default useGetDocumentVariablesTest;

const useGetDocumentVariables = (payload) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDocumentsVariables = useCallback(async (pageId) => {
    setLoading(true);
    try {
      const response = await api.get(
        `/api/firmsetting-page/get-document-variables/`,
        {
          params: {
            page_id: pageId ? pageId : payload.page_id,
          },
        }
      );
      setData(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocumentsVariables();
  }, [fetchDocumentsVariables]);

  return { data, loading, error, refetch: fetchDocumentsVariables };
};

export { useGetDocumentVariables };

const useGetDocumentVariablesPages = (payload) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchVariablesPages = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(
        `/api/firmsetting-page/get-document-variables-pages/`
      );
      setData(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVariablesPages();
  }, [fetchVariablesPages]);

  return { data, loading, error, refetch: fetchVariablesPages };
};

export { useGetDocumentVariablesPages };

const useAddVariable = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const addVariable = async (payload) => {
    setLoading(true);
    try {
      const response = await api.post(
        `/api/firmsetting-page/add-document-variable/`,
        payload
      );
      setSuccess(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return { addVariable, loading, error, success };
};

export { useAddVariable };

const useEditVariable = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const editVariable = async (payload) => {
    setLoading(true);
    try {
      const response = await api.post(
        `/api/firmsetting-page/edit-document-variable/`,
        payload
      );
      setSuccess(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return { editVariable, loading, error, success };
};

export { useEditVariable };
