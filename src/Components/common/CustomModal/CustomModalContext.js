import React, { createContext, useContext, useMemo, useState } from "react";

const DocumentModalContext = createContext({});

export const useDocumentModal = () => useContext(DocumentModalContext);

export const DocumentModalProvider = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isPhotoModal, setIsPhotoModal] = useState(false);
  const [isAssembleModal, setIsAssembleModal] = useState(false);

  const [documentURL, setDocumentURL] = useState("");
  const [documentURLfordownload, setDocumentURLfordownload] = useState("");
  const [documentData, setDocumentData] = useState({});
  const [photoListData, setPhotoListData] = useState({});
  const [toggleVar, setToggleVar] = useState(true);
  const [currentFetchPhotoListData, setCurrentFetchPhotoListData] =
    useState(null);

  const [assembleDocuments, setAssembleDocuments] = useState("");
  const [refetchDocumentData, setRefetchDocumentData] = useState(null);

  const showDocumentModal = (
    componentId,
    data,
    documentData = {},
    photoListData = {},
    fetchPhotoListData,
    documenturl2
  ) => {
    if (typeof photoListData === "function") {
      console.log("Hello");
      setRefetchDocumentData(() => photoListData);
    }

    setDocumentURL(data);
    setDocumentURLfordownload(documenturl2 || "");
    setDocumentData(documentData);
    setPhotoListData(photoListData || {});
    setCurrentFetchPhotoListData(() => fetchPhotoListData || null);
    if (componentId === "document") {
      setIsVisible(true);
      setIsPhotoModal(false);
    } else if (
      componentId === "photo" &&
      photoListData &&
      Object.keys(photoListData).length > 0
    ) {
      setIsPhotoModal(true);
      setIsVisible(false);
    } else if (componentId === "assemble") {
      setIsAssembleModal(true);
      setIsVisible(false);
    }
    if (photoListData && Object.keys(photoListData).length > 0) {
      setIsPhotoModal(true);
    } else {
      if (componentId === "assemble") {
        setIsAssembleModal(true);
      } else {
        setIsVisible(true);
      }
    }
  };

  const showAssembleDocumentModal = (doc_ids) => {
    setIsAssembleModal(true);
    setIsVisible(false);

    setAssembleDocuments(doc_ids);
  };

  const hideDocumentModal = async () => {
    if (currentFetchPhotoListData) {
      await currentFetchPhotoListData();
    }

    setDocumentURL("");
    setIsVisible(false);
    setIsPhotoModal(false);
    setIsAssembleModal(false);
    setRefetchDocumentData(null);
    setCurrentFetchPhotoListData(null);
  };

  const toggle = () => setToggleVar(!toggleVar);

  const providerValue = useMemo(
    () => ({
      toggleVar,
      toggle,
      isVisible,
      isAssembleModal,
      isPhotoModal,
      documentURL,
      documentData,
      photoListData,
      documentURLfordownload,
      showDocumentModal,
      hideDocumentModal,
      setDocumentData,
      setIsAssembleModal,
      setDocumentURL,
      showAssembleDocumentModal,
      assembleDocuments,
      refetchDocumentData,
    }),
    [
      isVisible,
      isPhotoModal,
      isAssembleModal,
      documentURL,
      documentData,
      photoListData,
      toggle,
      documentURLfordownload,
      assembleDocuments,
      refetchDocumentData,
    ]
  );

  return (
    <DocumentModalContext.Provider value={providerValue}>
      {children}
    </DocumentModalContext.Provider>
  );
};
