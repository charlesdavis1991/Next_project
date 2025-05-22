import React, { createContext, useContext, useMemo, useState } from "react";

const AlertCheckNotRequestedContext = createContext({});

export const useAlertCheckNotRequestedModal = () =>
  useContext(AlertCheckNotRequestedContext);

export const AlertCheckNotRequestedProvider = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);

  const showModal = (data) => {
    setIsVisible(true);
  };

  const hideModal = () => {
    setIsVisible(false);
  };
  const providerValue = useMemo(
    () => ({
      isVisible,
      showModal,
      hideModal,
    }),
    [isVisible],
  );
  return (
    <AlertCheckNotRequestedContext.Provider value={providerValue}>
      {children}
    </AlertCheckNotRequestedContext.Provider>
  );
};
