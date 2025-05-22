import React, { createContext, useContext, useMemo, useState } from "react";
import { photoData } from "../Photo/utils";
import { getCaseId } from "../../Utils/helper";

const DocumentModalContext = createContext({});

export const useDocumentModal = () => useContext(DocumentModalContext);

export const DocumentModalProvider = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [documentURL, setDocumentURL] = useState("");
  const [documentURLfordownload, setDocumentURLfordownload] = useState("");
  const [documentData, setDocumentData] = useState({});
  const [photoListData, setPhotoListData] = useState({});
  const [toggleVar, setToggleVar] = useState(true);

  const [currentFetchPhotoListData, setCurrentFetchPhotoListData] = useState(null);


  const showDocumentModal = (data, documentData = {}, photoListData = {},fetchPhotoListData,documenturl2) => {
    console.log("showDocumentModal Component: Data ------" + data);
    console.log(
      "showDocumentModal Component: documentData ------" +
        JSON.stringify(documentData)
    );
    setDocumentURL(data);
    setDocumentURLfordownload(documenturl2);
    setDocumentData(documentData);
    setPhotoListData(photoListData);
    setCurrentFetchPhotoListData(() => fetchPhotoListData);
    setIsVisible(true);
  };

  const hideDocumentModal = async() => {
    console.log("Modal Hide");
    if (currentFetchPhotoListData) {
      await currentFetchPhotoListData(); // Call the function stored in state
    }
    setDocumentURL("");
    setIsVisible(false);
    setCurrentFetchPhotoListData(null); // Clear the stored function after use
  };
  const toggle = () => setToggleVar(!toggleVar);
  const providerValue = useMemo(
    () => ({
      toggleVar,
      toggle,
      isVisible,
      documentURL,
      documentData,
      photoListData,
      showDocumentModal,
      hideDocumentModal,
      currentFetchPhotoListData,
      setDocumentData,
      documentURLfordownload
    }),
    [isVisible, documentURL, documentData, photoListData, toggle]
  );
  return (
    <DocumentModalContext.Provider value={providerValue}>
      {children}
    </DocumentModalContext.Provider>
  );
};
