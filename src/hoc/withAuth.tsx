import { isAuthenticated } from "@/utils";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

interface WithAuthOptions {
    public?: boolean;
    restricted?: boolean;
    redirectUnauthorizedTo?: string;
    redirectAuthorizedTo?: string;
    Layout: React.ComponentType<{ children: React.ReactNode }>;
}

const withAuth = (
    WrappedComponent: React.ComponentType,
    options?: WithAuthOptions
) => {
    const {
        public: isPublic,
        restricted: isRestricted,
        redirectUnauthorizedTo,
        redirectAuthorizedTo,
        Layout,
    } = options ?? {};

    return function WrappedComponentFunction(props: object) {
        const router = useRouter();
        const isAuthorized = isAuthenticated();

        useEffect(() => {
            if (!isAuthorized && !isPublic) {
                router.push(redirectUnauthorizedTo ?? "/auth/login");
            } else if (isAuthorized && isPublic && isRestricted) {
                router.push(redirectAuthorizedTo ?? "/dashboard");
            }
        }, [isAuthorized, router]);

        if (Layout) {
            return (
                <Layout>
                    <WrappedComponent {...props} />
                </Layout>
            );
        }

        return <WrappedComponent {...props} />;
    };
};

export default withAuth;
