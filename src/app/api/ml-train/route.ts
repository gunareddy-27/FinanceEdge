import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

export async function POST() {
    try {
        const scriptPath = path.join(process.cwd(), 'ml-research', 'train.py');
        const cwd = path.join(process.cwd(), 'ml-research');

        // Spawn is better for long-running scripts
        const process_child = spawn('python', ['train.py'], {
            cwd: cwd,
            detached: true,
            stdio: 'ignore'
        });

        process_child.unref(); // Allow the parent to exit independently

        return NextResponse.json({
            message: "Academic Training Started",
            estimated_time: "~15 seconds",
            models: ["XGBoost (Forecasting)", "Logistic Regression (Classification)", "Isolation Forest (Anomaly)"],
            status: "Running in background"
        });
    } catch (error) {
        console.error("Failed to start training:", error);
        return NextResponse.json({ error: "Retraining initialization failed." }, { status: 500 });
    }
}
