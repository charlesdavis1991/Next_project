// Components/CaseNavigator/CaseNavigatorModalProvider.js

import React, { useState } from 'react';
import { CaseNavigatorModalContext } from './CaseNavigatorModalContext';
import CasesModal from './CasesModal';

export const CaseNavigatorModalProvider = ({ children }) => {
  const [showCasesModal, setShowCasesModal] = useState(false);
  const [modalProps, setModalProps] = useState({});

  const handleShowModal = (props) => {
    setModalProps(props);
    setShowCasesModal(true);
  };

  const handleCloseModal = () => {
    setShowCasesModal(false);
  };

  return (
    <CaseNavigatorModalContext.Provider value={{ showCasesModal, handleShowModal, handleCloseModal }}>
      {children}
      <CasesModal show={showCasesModal} handleClose={handleCloseModal} {...modalProps} />
    </CaseNavigatorModalContext.Provider>
  );
};
