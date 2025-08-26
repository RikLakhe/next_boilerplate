import { ReactElement } from "react";

export interface LayoutPageProps extends React.FC {
  getLayout?: (page: ReactElement) => ReactElement;
}
