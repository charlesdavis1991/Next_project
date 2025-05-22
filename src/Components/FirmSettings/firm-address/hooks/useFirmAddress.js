import { useCallback, useState } from "react";
import api from "../../../../api/api";
import { useEffect } from "react";

const useFirmAddress = () => {
  const [firmAddress, setFirmAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const GetFirmAddress = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(
        `/api/firmsetting-page/get-firm-addresses/`
      );
      setFirmAddress(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    GetFirmAddress();
  }, [GetFirmAddress]);

  return { firmAddress, loading, error, refetch: GetFirmAddress };
};

export default useFirmAddress;

const useSaveAddress = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const saveAddress = async (payload) => {
    setLoading(true);
    try {
      const response = await api.post(
        `/api/firmsetting-page/add-firm-address/`,
        payload
      );
      setSuccess(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return { saveAddress, loading, error, success };
};

export { useSaveAddress };

const useEditSaveAddress = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const editAddress = async (payload) => {
    setLoading(true);
    try {
      const response = await api.post(
        `/api/firmsetting-page/edit-firm-address/`,
        payload
      );
      setSuccess(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return { editAddress, loading, error, success };
};

export { useEditSaveAddress };
