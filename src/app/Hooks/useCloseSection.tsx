import { useEffect, useRef } from "react";

export const useCloseSection = (closeSection: () => void) => {
  const ref = useRef<HTMLDivElement>(null);

  const handleClickOutsideOfCurrentSection = (e: MouseEvent) => {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      closeSection();
    }
  };

  useEffect(() => {
    document.addEventListener(
      "click",
      handleClickOutsideOfCurrentSection,
      true,
    );

    return () => {
      document.removeEventListener(
        "click",
        handleClickOutsideOfCurrentSection,
        true,
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [closeSection]);

  return ref;
};
