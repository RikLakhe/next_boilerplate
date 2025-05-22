import { ReactElement } from "react";

import AdminLayout from "@/client/components/layout/AdminLayout";
import { LayoutPageProps } from "@/types";

const CalendarGeneralPage: LayoutPageProps = () => {
  return <div>This is CalendarGeneralPage</div>;
};

CalendarGeneralPage.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default CalendarGeneralPage;
