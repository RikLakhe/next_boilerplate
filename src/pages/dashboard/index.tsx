import withAuth from "@/hoc/withAuth";
import dynamic from "next/dynamic";

const MainLayout = dynamic(() => import("@/components/layout/MainLayout"));

function Dashboard() {
    return (
        <>
            <div>Dashboard</div>
            <div>Dashboard</div>
            <div>Dashboard</div>
        </>
    );
}

export default withAuth(Dashboard, {
    public: false,
    restricted: false,
    Layout: MainLayout,
});
