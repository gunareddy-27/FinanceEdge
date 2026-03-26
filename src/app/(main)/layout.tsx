import Sidebar from "@/app/components/Sidebar";
import BottomNav from "@/app/components/BottomNav";
import PageTransition from "@/app/components/PageTransition";

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="main-content">
                <PageTransition>
                    {children}
                </PageTransition>
            </main>
            <BottomNav />
        </div>
    );
}
