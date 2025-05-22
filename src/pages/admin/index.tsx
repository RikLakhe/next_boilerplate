import { ReactElement } from "react";

import AdminLayout from "@/client/components/layout/AdminLayout";

const Home = () => {
  return <div>This is admin Home Page</div>;
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default Home;
