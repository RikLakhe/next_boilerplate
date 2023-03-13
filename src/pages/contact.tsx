import withAuth from "@/hoc/withAuth";
import Head from "next/head";
import dynamic from "next/dynamic";

const HomeLayout = dynamic(() => import("@/components/layout/HomeLayout"));

function Contact() {
    return (
        <>
            <Head>
                <title>Contact</title>
                <meta
                    name="description"
                    content="Generated by create next app"
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                <div>Contact</div>
            </main>
        </>
    );
}

export default withAuth(Contact, {
    public: true,
    Layout: HomeLayout,
});
