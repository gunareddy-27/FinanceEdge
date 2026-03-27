---
description: FinanceEdge Autonomous Automation Engine Workflow
---

# FinanceEdge Autonomous Lifecycle

Follow these steps to execute and verify the platform's multi-agent automation pipeline.

## 1. Trigger the Smart Cycle
Execute the primary orchestration engine that runs the 9-agent automation suite.
// turbo
1. Navigate to the **Automations** tab in the sidebar.
2. Click the **"RUN SMART CYCLE"** button.
3. Monitor the **Operation Logs** for:
   - `Wealth Engine` portfolio suggestions.
   - `WhatsApp Nudge` notifications for split bills.
   - `Anomaly Detection` security flags.

## 2. Generate Intelligence Audit & Preview
Create a board-ready strategic report with the embedded PDF viewer.
1. Go to the **Dashboard** or **Reports** section.
2. Click **"INTELLIGENCE HUB"**.
3. Wait for the autonomous scanning audit to complete (4 key steps).
4. Select **"PREVIEW"** to launch the high-fidelity in-browser PDF viewer.
5. Verify visual instruments (charts) and strategic recommendations.
6. Click **"DOWNLOAD PDF"** to export.

## 3. Test Zero-Input "Magic Link" API
Manually trigger an external transaction log via the public endpoint.
// turbo
1. Use `curl` or Postman to send a POST request:
   ```bash
   curl -X POST http://localhost:3000/api/magic-link \
     -H "Content-Type: application/json" \
     -d '{"userId": 1, "description": "Starbucks Coffee", "amount": 450}'
   ```
2. Verify the response contains the `ai: { category: "Food", confidence: 99 }` metadata.

## 4. Evaluate Financial Health Interventions
Test the self-healing and budget adjustment logic.
1. Add a transaction that exceeds `2.5x` your average spend.
2. Run the **Smart Cycle**.
3. Confirm the `Anomaly Detected` security flag in logs.
4. Check **Budgets** to see if the engine applied a 20% cap or a 15% resilience adjustment.

## 5. End-of-Month Archival
Verify the automatic report generation.
1. On the 1st of any month, the system auto-executes `autoArchiveMonthReport`.
2. check the **Reports** database vault for the generated PDF Monthly Summary.
