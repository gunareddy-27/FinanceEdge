# TaxPal

A premium Full Stack Personal Finance & Tax Estimator for Freelancers.

## Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Styling:** Premium Vanilla CSS (Glassmorphism, CSS Variables)
- **Database:** SQLite (via Prisma ORM)
- **Charts:** Chart.js

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Initialize Database:**
   ```bash
   npx prisma db push
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Login:**
   - Navigate to `http://localhost:3000`
   - Use Demo Creds: Any email/password (Mock Auth)

## Features Implemented
- **Premium UI/UX:** Glassmorphism design system.
- **Dashboard:** Real-time financial overview with charts.
- **Database Schema:** Complete Prisma schema for Users, Transactions, Budgets, and Reports.
- **Responsive Layout:** Sidebar navigation and grid layouts.

### 🤖 Advanced AI Features
- **AI Expense Categorization:** NLP-based text classification for automatic categorization.
- **AI Spending Pattern Analysis & Insights:** Automatic insight generation based on financial behaviors.
- **AI Fraud Detection:** Isolation Forest implementation to detect anomalous spending. 
- **AI Budget Recommendation:** Reinforcement learning concepts for generating smart automated budget defaults.
- **AI Investment Suggestions:** Model-based portfolio generation (Mutual funds, stocks, etc.).
- **AI Tax Optimization Advisor:** Tax rule engine to suggest optimal tax saving methods (e.g., Section 80C).
- **AI Risk Detection:** Logistic regression monitoring to warn about financial instability.
- **Cash Flow Prediction Model:** Forecast generation based on historic transaction trends.
- **Receipt & Voice Input:** Seamless receipt OCR and intelligent voice-to-text expense parsing.

### 💹 Dedicated Financial Modules
- **Emergency Fund Tracker:** Automated goal tracking built on 6x overhead recommendation calculations.
- **Expense Splitter:** Splitwise-style group expense splitting and settlement tracking.
- **Smart Spending Limits:** Proactive adjustments to budget limits reflecting 3-month rolling trends.
- **Lifestyle Spending Analyzer:** Discretionary lifestyle spending evaluations pointing out exact potential savings.
- **Auto-Savings Transfer Suggestions:** Intelligent advice on how much to automatically clear into savings per month.
- **Location-based Expense Tracking:** Log and review expenses based precisely on where they occurred. 
- **Financial Milestone Tracker:** Gamification and tracking of financial achievements.

### 🔒 Enterprise-Grade Security
- **MFA (Multi-Factor Authentication):** Enforced 2FA checks using Authenticator/OTP.
- **End-to-End Encryption:** AES-256 enabled for sensitive field storage.
- **Password Hashing:** Utilizing secure hash logic with generated salts.
- **Secure Sessions:** Sessions protected with HttpOnly, Secure, and Strict policies.
- **RBAC:** Core Role-Based Access Control logic separating Admin, Advisor, and standard users.
- **API Rate Limiting:** 100 requests per minute API Throttle restrictions dynamically enforced.
- **Login Attempt Monitoring:** Automatic 15-minute system lockouts triggered upon 5 concurrent failed login attempts.
- **Secure File Upload Utility:** Binary protection constraining uploads to standard PDFs/Images under 5MB.
- **Audit Logging System:** Complete historical trace logging of every major dataset mutation.
- **Automated Cloud Backup Utility:** Cloud database syncing and snapshots tracking.
