import React from "react";
import Layout from "../components/Layout";

interface UseLayoutOptions {
  header: React.ReactNode;
  footer: React.ReactNode;
}

const useLayout = ({ header, footer }: UseLayoutOptions) => {
  const withLayout = (PageComponent: React.FC) => {
    return (props: any) => {
      return (
        <Layout header={header} footer={footer}>
          <PageComponent {...props} />
        </Layout>
      );
    };
  };

  return withLayout;
};

export default useLayout;
