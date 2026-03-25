import Sidebar from "@/app/components/Sidebar";
import BottomNav from "@/app/components/BottomNav";

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="main-content">
                {children}
            </main>
            <BottomNav />
        </div>
    );
}
