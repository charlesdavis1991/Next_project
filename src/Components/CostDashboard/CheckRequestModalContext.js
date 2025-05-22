import React, { createContext, useContext, useMemo, useState } from "react";

const CheckRequestModalContext = createContext({});

export const useCheckRequestModal = () => useContext(CheckRequestModalContext);

export const CheckRequestModalProvider = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [modalData, setModalData] = useState({});

  const showModal = (data) => {
    setModalData(data);
    setIsVisible(true);
  };

  const hideModal = () => {
    setIsVisible(false);
    setModalData({});
  };
  const providerValue = useMemo(
    () => ({
      isVisible,
      modalData,
      showModal,
      hideModal,
    }),
    [isVisible, modalData],
  );
  return (
    <CheckRequestModalContext.Provider value={providerValue}>
      {children}
    </CheckRequestModalContext.Provider>
  );
};
