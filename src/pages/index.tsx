import { useRouter } from "next/router";
import { useEffect } from "react";

const HomePage = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/app");
  }, []);

  return <h1>Preparing your application ...</h1>;
};

export default HomePage;
