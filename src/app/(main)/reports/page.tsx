import { getReports } from '@/app/actions/report';
import ReportsClient from './ReportsClient';

export default async function ReportsPage() {
    const reports = await getReports();

    return <ReportsClient reports={reports} />;
}
