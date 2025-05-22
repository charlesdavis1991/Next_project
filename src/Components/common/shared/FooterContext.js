// FooterContext.js
import React, { createContext, useContext, useState } from "react";

const FooterContext = createContext();

export function FooterProvider({ children }) {
  const [footerState, setFooterState] = useState([]);
  return (
    <FooterContext.Provider value={{ footerState, setFooterState }}>
      {children}
    </FooterContext.Provider>
  );
}

export function useFooter() {
  return useContext(FooterContext);
}
