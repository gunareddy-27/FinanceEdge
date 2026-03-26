import Sidebar from "@/app/components/Sidebar";
import BottomNav from "@/app/components/BottomNav";
import PageTransition from "@/app/components/PageTransition";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/app/actions/user";

export default async function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const userId = await getUserId();
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { name: true, email: true }
    });

    return (
        <div className="dashboard-layout">
            <Sidebar user={user} />
            <main className="main-content">
                <PageTransition>
                    {children}
                </PageTransition>
            </main>
            <BottomNav />
        </div>
    );
}
