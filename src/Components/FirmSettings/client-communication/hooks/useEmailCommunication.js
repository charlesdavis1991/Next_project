import { useState, useEffect, useCallback } from "react";
import api from "../../../../api/api";

const useEmailCommunication = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchEmailCommunication = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get(`/api/firmsetting-page/firm-email/`);
            setData(response.data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchEmailCommunication();
    }, [fetchEmailCommunication]);

    return { data, loading, error, refetch: fetchEmailCommunication };
};

export default useEmailCommunication;

const useFirmEmail = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const changeEmail = async (new_email) => {
        setLoading(true);
        try {
            const response = await api.post(`/api/firmsetting-page/change-firm-mailing-email/`, {
                mailing_email: new_email
            });
            return response.status >= 200 && response.status < 300;
        } catch (err) {
            setError(err);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { changeEmail, loading, error };
};

const useGoogle = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const fetchGoogleLoginURL = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/api/firmsetting-page/gmail-auth-redirect/`);
            return response.data?.authorization_url;
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const disableGoogle = async () => {
        setLoading(true);
        try {
            const response = await api.post(`/api/firmsetting-page/disable-email-gmail/`);
            return response.status >= 200 && response.status < 300;
        } catch (err) {
            setError(err);
            return false;
        } finally {
            setLoading(false);
        }
    }
    
    return { fetchGoogleLoginURL, disableGoogle, loading, error };
};

const useOutlook = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const fetchOutlookLoginURL = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/api/firmsetting-page/outlook-auth-redirect/`);
            return response.data?.authorization_url;
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const disableOutlook = async () => {
        setLoading(true);
        try {
            const response = await api.post(`/api/firmsetting-page/disable-email-outlook/`);
            return response.status >= 200 && response.status < 300;
        } catch (err) {
            setError(err);
            return false;
        } finally {
            setLoading(false);
        }
    }
    
    return { fetchOutlookLoginURL, disableOutlook, loading, error };
}

const useSaveSelfHostedEmail = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const postSelfHostedEmail = async (payload) => {
        setLoading(true);
        try {
            const response = await api.post(`/api/firmsetting-page/firm-email/`, payload);
            setData(response.data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

  return { postSelfHostedEmail, data, loading, error };
};

export { useFirmEmail, useSaveSelfHostedEmail, useGoogle, useOutlook };
