import { ReactElement } from "react";

import AdminLayout from "@/app/components/layout/AdminLayout";

const Database = () => {
  return (
    <iframe
      width="100%"
      height="1000px"
      src="https://dbdiagram.io/e/681110db1ca52373f5dd2705/6826144d5b2fc4582fcb0525"
      title="Database Diagram"
    />
  );
};

Database.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default Database;
