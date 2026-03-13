import { prisma } from '@/lib/prisma';
import TaxEstimatorClient from './TaxEstimatorClient';
import { getUserId } from '@/app/actions/user';

async function getLastEstimate() {
    const userId = await getUserId();
    return await prisma.taxEstimate.findFirst({
        where: { userId },
        orderBy: { id: 'desc' }
    });
}

export default async function TaxEstimatorPage() {
    const lastEstimate = await getLastEstimate();
    let initialResult = null;

    if (lastEstimate) {
        initialResult = {
            q2: Number(lastEstimate.estimatedTax),
            q3: Number(lastEstimate.estimatedTax),
        };
    }

    return <TaxEstimatorClient initialResult={initialResult} />;
}
