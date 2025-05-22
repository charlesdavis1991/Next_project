import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

const UpdateTriggerContext = createContext({});

export const useUpdateTrigger = () => useContext(UpdateTriggerContext);

export const UpdateTriggerProvider = ({ children }) => {
  const [triggerUpdate, setTriggerUpdate] = useState(false);

  const toggleTriggerUpdate = useCallback(() => {
    setTriggerUpdate((prevState) => !prevState);
  }, []);

  const providerValues = useMemo(
    () => ({ triggerUpdate, toggleTriggerUpdate }),
    [triggerUpdate],
  );

  return (
    <UpdateTriggerContext.Provider value={providerValues}>
      {children}
    </UpdateTriggerContext.Provider>
  );
};
