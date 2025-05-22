import { useState, useEffect, useCallback } from "react";
import api from "../../../../api/api";
import axios from "axios";

const useGetAutoTaskDetails = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const tokenBearer = localStorage.getItem("token");
  const origin =
    process.env.REACT_APP_BACKEND_URL || "https://dev.simplefirm.com";

  const fetchAutoTasksDetails = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${origin}/api/firmsetting-page/auto-tasks/`,
        {
          headers: {
            Authorization: tokenBearer,
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
    fetchAutoTasksDetails();
  }, [fetchAutoTasksDetails]);

  return { data, loading, error, refetch: fetchAutoTasksDetails };
};

export default useGetAutoTaskDetails;

const useAddAutoTasks = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const saveAutoTasks = async (payload) => {
    setLoading(true);
    try {
      const response = await api.post(
        `/api/firmsetting-page/add-auto-task/`,
        payload
      );
      setSuccess(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return { saveAutoTasks, loading, error, success };
};

export { useAddAutoTasks };

const useEditAutoTasks = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const editAutoTasks = async (payload) => {
    setLoading(true);
    try {
      const response = await api.post(
        `/api/firmsetting-page/edit-auto-task/`,
        payload
      );
      setSuccess(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return { editAutoTasks, loading, error, success };
};

export { useEditAutoTasks };

const useDeleteAutoTasks = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const deleteAutoTasks = async (payload) => {
    setLoading(true);
    try {
      const response = await api.post(
        `/api/firmsetting-page/delete-auto-task/`,
        payload
      );
      setSuccess(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return { deleteAutoTasks, loading, error, success };
};

export { useDeleteAutoTasks };

const useGetPageSlots = (pageId) => {
  console.log("hi", pageId);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPageSlots = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/firmsetting-page/get-page-slots/`, {
        params: {
          page_id: pageId,
        },
      });
      setData(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPageSlots();
  }, [fetchPageSlots]);

  return { data, loading, error, refetch: fetchPageSlots };
};
export { useGetPageSlots };
