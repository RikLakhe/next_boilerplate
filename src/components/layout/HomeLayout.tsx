import Link from "next/link";
import React from "react";

type Props = {
    children: React.ReactNode;
};

export default function HomeLayout({ children }: Props) {
    return (
        <div>
            <h1>Home Layout</h1>
            <Link href="/">Home</Link>
            <Link href="/contact">contact</Link>
            <Link href="/about">About</Link>
            {/* add your layout here */}
            {children}
        </div>
    );
}
