import { useState, useEffect, useCallback } from "react";
import api from "../../../../api/api";
import axios from "axios";
import { getToken } from "../../../../Utils/helper";

const useGetFirmLogo = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFirmLogo = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/firmsetting-page/edit-firm-logo/`);
      setData(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFirmLogo();
  }, [fetchFirmLogo]);

  return { data, loading, error, refetch: fetchFirmLogo };
};

export default useGetFirmLogo;

const useGetPrintLogo = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPrintLogo = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/firmsetting-page/edit-print-logo/`);
      setData(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrintLogo();
  }, [fetchPrintLogo]);

  return { data, loading, error, refetch: fetchPrintLogo };
};

export { useGetPrintLogo };

const useDeletePrintLogo = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const deletePrintLogo = async () => {
    setLoading(true);
    try {
      const response = await api.get(
        `/api/firmsetting-page/delete-print-logo/`
      );
      setSuccess(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return { deletePrintLogo, loading, error, success };
};

export { useDeletePrintLogo };

const useEditPrintLogo = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const token = getToken();
  const origin =
    process.env.REACT_APP_BACKEND_URL || "https://dev.simplefirm.com";

  const editPrintLogo = async (formData) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${origin}/api/firmsetting-page/edit-print-logo/`,
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

  return { editPrintLogo, loading, error, success };
};

export { useEditPrintLogo };

const useEditFirmLogo = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const token = getToken();
  const origin =
    process.env.REACT_APP_BACKEND_URL || "https://dev.simplefirm.com";

  const editFirmLogo = async (formData) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${origin}/api/firmsetting-page/edit-firm-logo/`,
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

  return { editFirmLogo, loading, error, success };
};

export { useEditFirmLogo };

const useDeleteFirmLogo = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const deleteFirmLogo = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/firmsetting-page/remove-firm-logo/`);
      setSuccess(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return { deleteFirmLogo, loading, error, success };
};

export { useDeleteFirmLogo };

const useRestoreDefaultBrandSettings = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const restoreBrandSettings = async () => {
    setLoading(true);
    try {
      const response =
        await api.get(`/api/firmsetting-page/restore-default-settings
/`);
      setSuccess(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return { restoreBrandSettings, loading, error, success };
};

export { useRestoreDefaultBrandSettings };
