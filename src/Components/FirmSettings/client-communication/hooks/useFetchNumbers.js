import { useState, useEffect } from "react";
import api from "../../../../api/api";

const useFetchNumbers = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNumbers = async (search_type, search_value, numberFilter) => {
    setLoading(true);
    try {
      const response = await api.get(`/api/firmsetting-page/fetch-numbers/`, {
        params: {
          search_type,
          search_value,
          ...(numberFilter && numberFilter?.startsWith ? { filter_type: "starts_with", filter_val: numberFilter?.startsWith } : {}),
          ...(numberFilter && numberFilter?.endsWith ? { filter_type: "ends_with", filter_val: numberFilter?.endsWith } : {}),
          ...(numberFilter && numberFilter?.contains ? { filter_type: "contains", filter_val: numberFilter?.contains } : {}),
        },
      });

      if(response?.data?.errors?.length > 0) {
        setError(response.data.errors[0]);
        return;
      }
      
      setData(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { fetchNumbers, data, loading, error };
};

export { useFetchNumbers };

const usePurchaseNumber = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const savePhoneNumber = async (payload) => {
    setLoading(true);
    try {
      const response = await api.post(
        `/api/firmsetting-page/purchase-number/`,
        payload
      );
      setSuccess(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return { savePhoneNumber, loading, error, success };
};

export { usePurchaseNumber };
