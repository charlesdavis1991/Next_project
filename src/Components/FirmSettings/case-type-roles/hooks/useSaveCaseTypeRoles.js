import { useState, useCallback } from "react";
import api from "../../../../api/api";

const useSaveCaseTypeRoles = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const saveCaseTypeRoles = async (updatedData) => {
    setLoading(true);
    try {
      const response = await api.post(
        `/api/firmsetting-page/save-case-type-roles/`,
        updatedData
      );
      setSuccess(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return { saveCaseTypeRoles, loading, error, success };
};

export default useSaveCaseTypeRoles;
