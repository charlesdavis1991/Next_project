import React, { createContext, useContext, useMemo, useState } from "react";

const DocumentModalContext = createContext({});

export const useDocumentModal = () => useContext(DocumentModalContext);

export const DocumentModalProvider = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [documentURL, setDocumentURL] = useState("");
  const [documentData, setDocumentData] = useState({});
  const [toggleVar, setToggleVar] = useState(true);

  const showDocumentModal = (data, documentData = {}) => {
    setDocumentURL(data);
    setDocumentData(documentData);
    setIsVisible(true);
  };

  const hideDocumentModal = () => {
    setDocumentURL("");
    setIsVisible(false);
  };
  const toggle = () => setToggleVar(!toggleVar);
  const providerValue = useMemo(
    () => ({
      toggleVar,
      toggle,
      isVisible,
      documentURL,
      documentData,
      showDocumentModal,
      hideDocumentModal,
      setDocumentData,
    }),
    [isVisible, documentURL, documentData, toggle]
  );
  return (
    <DocumentModalContext.Provider value={providerValue}>
      {children}
    </DocumentModalContext.Provider>
  );
};
