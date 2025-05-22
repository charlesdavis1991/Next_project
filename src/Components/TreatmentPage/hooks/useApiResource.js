import { useCallback, useEffect, useState } from "react";
import api, { api_without_cancellation } from "../../../api/api";
import { getCaseId } from "../../../Utils/helper";

const createApiHook = (endpoint, getIdParam) => {
  return () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [lastFetched, setLastFetched] = useState(null);

    const idParam = getIdParam ? getIdParam() : null;
    const fullEndpoint = idParam ? `${endpoint}/${idParam}/` : endpoint;

    const fetchData = useCallback(
      async (force = false) => {
        console.log("force", force);
        if (force || !lastFetched) {
          try {
            setLoading(true);
            const response = await api_without_cancellation.get(fullEndpoint);
            setData(response.data);
            setLastFetched(new Date());
          } catch (error) {
            console.error(error);
            setError(error);
          } finally {
            setLoading(false);
          }
        }
      },
      [fullEndpoint, lastFetched]
    );

    useEffect(() => {
      const abortController = new AbortController();

      const initialFetch = async () => {
        try {
          setLoading(true);
          const response = await api_without_cancellation.get(fullEndpoint, {
            signal: abortController.signal,
          });
          setData(response.data);
          setLastFetched(new Date());
        } catch (error) {
          console.error(error);
          if (error.name !== "AbortError") {
            setError(error);
          }
        } finally {
          if (!abortController.signal.aborted) {
            setLoading(false);
          }
        }
      };

      initialFetch();

      return () => {
        abortController.abort();
      };
    }, [fullEndpoint]);

    return { data, loading, error, refetch: fetchData };
  };
};

export const useGetCaseProviders = createApiHook(
  "/api/treatment/case-providers",
  getCaseId
);
export const useGetTreatmentDates = createApiHook(
  "/api/treatment/dates_treatment",
  getCaseId
);
export const useGetCaseSpecialities = createApiHook(
  "/api/treatment/specialities",
  getCaseId
);
