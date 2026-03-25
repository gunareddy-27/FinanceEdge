import ProfileClient from '@/app/components/ProfileClient';
import { prisma } from '@/lib/prisma';
import { getUserId } from '@/app/actions/user';

async function getUser() {
    const userId = await getUserId();
    return await prisma.user.findUnique({
        where: { id: userId },
        select: { name: true, email: true }
    });
}

export default async function ProfilePage() {
    const user = await getUser();
    return <ProfileClient user={user} />;
}
