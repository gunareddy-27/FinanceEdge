# TaxPal

A premium Full Stack Personal Finance & Tax Estimator for Freelancers.

## Tech Stack
- **Framework:** Next.js 15 (App Router / Turbopack)
- **Styling:** Premium Vanilla CSS (Glassmorphism, CSS Variables)
- **Database:** SQLite (via Prisma ORM)
- **Charts:** Chart.js 4.0
- **Mobile:** PWA (Progressive Web App) + Mobile-First Responsive Design
- **OCR:** Tesseract.js

## 🚀 Newly Added Features

### 📱 Mobile-First Experience & PWA
- **PWA Ready**: Install TaxPal directly on your Android/iOS home screen.
- **Responsive Navigation**: Mobile-optimized bottom navigation and hidden sidebar for small viewports.
- **Glassmorphic UI**: High-fidelity dark mode and vibrant indigo gradients.

### 🤖 Advanced Finance Automations
- **"Zero-Click" Expense Mapping**: Auto-save transactions directly from receipt scans using integrated OCR.
- **Smart Debt Reminders**: One-click WhatsApp "Friendly Nudges" for unpaid split bills in the Expense Splitter.
- **Quarterly Tax Autofill**: Intelligent tax estimation based on real year-to-date income with pulsing dashboard CTAs.
- **Natural Language "Action Commands"**: Update your budgets directly through the AI Chatbot (e.g., *"Set Coffee budget to 5000"*).
- **End-of-Month PDF Archiving**: Automated generation and logging of Monthly Summary reports to the database vault.
- **Financial Health "Self-Healing"**: Automatic 20% budget caps applied to highest-spending categories when financial health is at risk.
- **"Magic Link" API**: Log transactions instantly via a simple URL (e.g., `api/transactions/add?description=Food&amount=500&secret=taxpal_magic_key`).

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

## Features Included

### 🤖 AI-Powered Financial Intelligence
- **AI Expense Categorization**: NLP-based text classification for automatic categorization.
- **AI Spending Pattern Analysis**: Hyper-personalized insights based on financial behaviors.
- **AI Fraud Detection**: Isolation Forest implementation for anomalous spend alerts. 
- **AI Budget Recommendation**: Smart default budget generation for new users.
- **AI Investment Suggestions**: Diversified portfolio generation (Mutual funds, stocks).
- **AI Tax Advisor**: Guidance on Section 80C and other deductions.
- **AI Risk Detection**: Logistic regression monitoring for financial stability warnings.
- **Cash Flow Prediction**: 3-month rolling forecasts based on historic trends.
- **Receipt & Voice Input**: Seamless OCR and voice-to-text expense parsing.

### 💹 Dedicated Financial Modules
- **Emergency Fund Tracker**: Goal tracking based on 6x overhead recommendation.
- **Expense Splitter**: Group splitting with WhatsApp settlement tracking.
- **Smart Spending Limits**: Automated adjustments based on rolling 3-month trends.
- **Lifestyle Spending Analyzer**: Discretionary spending evaluation and potential savings.
- **Auto-Savings Transfer**: Suggestions for clearing surplus funds into savings.
- **Location-based Tracking**: Precise location logging for business travel. 
- **Financial Milestone Tracker**: Gamification of savings achievements.

### 🔒 Security & Persistence
- **Prisma Database Integration**: Full persistence for Transactions, Goals, Splits, and Reports.
- **MFA (Multi-Factor Auth)**: Enforced 2FA logic for sensitive account actions.
- **End-to-End Encryption**: AES-256 for protected database fields.
- **RBAC**: Multi-role system (User, Advisor, Admin).
- **Rate Limiting**: Throttling for API security.
- **Secure File Uploads**: Restricted binary validation for PDF archiving.
