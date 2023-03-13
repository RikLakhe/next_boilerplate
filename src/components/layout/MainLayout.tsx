import React from "react";

type Props = {
    children: React.ReactNode;
};

export default function MainLayout({ children }: Props) {
    return (
        <div>
            <h1>Main Layout</h1>
            {/* add your layout here */}
            {children}
        </div>
    );
}
