import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { useIdleTimer } from "react-idle-timer";
import { useSelector } from "react-redux";
import { getToken, getCaseId, getClientId, removeToken } from "../Utils/helper";
import api from "../api/api";
import { persistor } from "../Redux/store";
import { autoLogoutAPI } from "./main";

const InactivityContext = createContext();

const useInactivitySelectors = () => {
  const inactivityTimeout = useSelector(
    (state) => state.general.inactivityTimeout
  );
  const page_id_click_record = useSelector(
    (state) => state.page_id_click_record.page_id_click_record
  );

  return useMemo(
    () => ({
      inactivityTimeout,
      page_id_click_record,
    }),
    [inactivityTimeout, page_id_click_record]
  );
};

export const InactivityProvider = ({ children }) => {
  const { inactivityTimeout, page_id_click_record } = useInactivitySelectors();

  const [modalState, setModalState] = useState({
    show: false,
    timeoutTime: null,
  });

  const handleLogout = useCallback(async () => {
    try {
      await api.post("/api/general/click_record/", {
        click: -inactivityTimeout,
        case_id: getCaseId(),
        client_id: getClientId(),
        page_id: page_id_click_record,
      });

      const response = await autoLogoutAPI(getClientId(), getCaseId());
      if (response.status === 200) {
        removeToken();
        persistor.pause();
        await persistor.flush();
        await persistor.purge();
        window.location.href = "/";
        window.location.reload();
      }
    } catch (error) {
      console.error("error occurred", error);
    }
  }, [inactivityTimeout, page_id_click_record]);

  const onIdle = useCallback(async () => {
    const token = getToken();
    if (token) {
      await handleLogout();
    }
  }, [handleLogout]);

  const onIdleWarning = useCallback(() => {
    const token = getToken();
    if (token) {
      setModalState((prev) => ({ ...prev, show: true }));
    }
  }, []);

  const idleTimerConfig = useMemo(
    () => ({
      onIdle,
      timeout: parseInt(inactivityTimeout) * 60 * 1000,
      throttle: 500,
      onPrompt: onIdleWarning,
      promptTimeout: 60 * 1000,
    }),
    [onIdle, inactivityTimeout, onIdleWarning]
  );

  const { getRemainingTime, reset } = useIdleTimer(idleTimerConfig);

  useEffect(() => {
    let rafId;
    let lastUpdate = 0;

    const updateTimeout = () => {
      const now = Date.now();
      if (now - lastUpdate >= 1000) {
        const remainingTime = Math.ceil(getRemainingTime() / 1000);
        setModalState((prev) => {
          if (prev.timeoutTime !== remainingTime) {
            return { ...prev, timeoutTime: remainingTime };
          }
          return prev;
        });
        lastUpdate = now;
      }
      rafId = requestAnimationFrame(updateTimeout);
    };

    if (modalState.show) {
      rafId = requestAnimationFrame(updateTimeout);
    }

    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [getRemainingTime, modalState.show]);

  const hideInactivityModal = useCallback(() => {
    reset(); // Reset the timer when hiding the modal
    setModalState((prev) => ({ ...prev, show: false }));
  }, [reset]);

  const value = useMemo(
    () => ({
      inactivityModalShow: modalState.show,
      timeoutTime: modalState.timeoutTime,
      hideInactivityModal,
      getRemainingTime,
      reset,
    }),
    [
      modalState.show,
      modalState.timeoutTime,
      hideInactivityModal,
      getRemainingTime,
      reset,
    ]
  );

  return (
    <InactivityContext.Provider value={value}>
      {children}
    </InactivityContext.Provider>
  );
};

export const useInactivity = () => {
  const context = useContext(InactivityContext);
  if (!context) {
    throw new Error("useInactivity must be used within an InactivityProvider");
  }
  return context;
};
