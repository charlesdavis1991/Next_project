import { useEffect, useState } from "react";

const useIsClassPresent = (ref, className) => {
  const [isClassPresent, setIsClassPresent] = useState(false);

  useEffect(() => {
    const checkIfClassIsPresent = () => {
      if (ref.current) {
        setIsClassPresent(ref.current.classList.contains(className));
      }
    };

    checkIfClassIsPresent();
    const observer = new MutationObserver(checkIfClassIsPresent);
    observer.observe(ref.current, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      observer.disconnect();
    };
  }, [ref, className]);

  return isClassPresent;
};

export default useIsClassPresent;
