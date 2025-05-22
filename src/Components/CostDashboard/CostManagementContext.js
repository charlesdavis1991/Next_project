import React, { createContext, useContext, useMemo, useState } from "react";

const CostManagementContext = createContext({});

export const useCostManagement = () => useContext(CostManagementContext);

export const CostManagementProvider = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [cost, setCost] = useState({});
  const showModal = (cost, isEdit) => {
    setCost(cost);
    setIsEdit(isEdit);
    setIsVisible(true);
  };
  const hideModal = () => {
    setCost({});

    setIsEdit(false);
    setIsVisible(false);
  };

  const providerValues = useMemo(
    () => ({
      isVisible,
      isEdit,
      cost,
      showModal,
      hideModal,
    }),
    [isVisible, cost],
  );
  return (
    <CostManagementContext.Provider value={providerValues}>
      {children}
    </CostManagementContext.Provider>
  );
};
