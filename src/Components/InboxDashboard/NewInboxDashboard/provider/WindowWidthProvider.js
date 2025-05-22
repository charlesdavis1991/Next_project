import React, { createContext, useState, useEffect, useContext } from "react";

const WindowWidthContext = createContext(null);

export const WindowWidthProvider = ({ children }) => {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <WindowWidthContext.Provider value={width}>
      {children}
    </WindowWidthContext.Provider>
  );
};

export const useWindowWidth = () => {
  const width = useContext(WindowWidthContext);
  if (width === null) {
    throw new Error("useWindowWidth must be used within a WindowWidthProvider");
  }
  return width;
};
