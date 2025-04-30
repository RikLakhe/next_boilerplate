import { useEffect, useState } from "react";

const useWindowViewPort = () => {
  const [windowViewport, setWindowViewport] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 0,
  );

  useEffect(() => {
    const handleResize = () => {
      setWindowViewport(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return { windowViewport, setWindowViewport };
};

export default useWindowViewPort;
