import { useCallback, useEffect, useState, useRef } from "react";
import { api_without_cancellation } from "../../../api/api";

export const useGetVerificationInfo = (initialId, initialRecords) => {
  // Keep track of params in a ref to avoid unnecessary re-renders
  const paramsRef = useRef({ id: initialId, records: initialRecords });
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  // Track if component is mounted to prevent state updates after unmount
  const isMountedRef = useRef(true);

  // Function to fetch data - doesn't depend on state, only refs
  const fetchVerificationInfo = useCallback(async (overrideParams) => {
    // Use override params or current ref values
    const { id, records } = overrideParams || paramsRef.current;

    if (!id || !records) return null;

    setIsLoading(true);
    setError(null);

    try {
      const response = await api_without_cancellation.get(
        `/api/treatment-opt/get-multiple-verification-info/${id}/CaseProviders/${records}/`
      );

      // Check if component is still mounted before updating state
      if (isMountedRef.current) {
        setData(response.data);
        setIsLoading(false);
      }

      return response.data;
    } catch (err) {
      // Check if component is still mounted before updating state
      if (isMountedRef.current) {
        setError(err);
        setIsLoading(false);
      }
      throw err;
    }
  }, []);

  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Initial fetch on mount
  useEffect(() => {
    fetchVerificationInfo();
  }, [fetchVerificationInfo]);

  // Refetch function - updates params and triggers fetch
  const refetch = useCallback(
    (newId, newRecords) => {
      const newParams = {
        id: newId !== undefined ? newId : paramsRef.current.id,
        records:
          newRecords !== undefined ? newRecords : paramsRef.current.records,
      };

      // Update the ref (not state, to avoid re-renders)
      paramsRef.current = newParams;

      // Return the promise for chaining
      return fetchVerificationInfo(newParams);
    },
    [fetchVerificationInfo]
  );

  return {
    data,
    error,
    isLoading,
    refetch,
    // Expose current params
    params: paramsRef.current,
  };
};
