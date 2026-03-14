import { 
    analyzeSpendingBehavior, 
    predictNextMonthExpense, 
    detectAnomalies, 
    getOptimizedBudget, 
    getInvestmentRecommendations, 
    predictFinancialRisk 
} from '@/app/actions/ml';
import AILabClient from './AILabClient';

export default async function AILabPage() {
    const behaviorData = await analyzeSpendingBehavior();
    const predictionData = await predictNextMonthExpense();
    const anomaliesData = await detectAnomalies();
    const budgetData = await getOptimizedBudget();
    const investmentData = await getInvestmentRecommendations();
    const riskData = await predictFinancialRisk();

    return (
        <AILabClient 
            behaviorData={behaviorData} 
            predictionData={predictionData} 
            anomaliesData={anomaliesData} 
            budgetData={budgetData} 
            investmentData={investmentData} 
            riskData={riskData} 
        />
    );
}
