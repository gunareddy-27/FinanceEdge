# FinanceEdge 🚀 (TaxPal Edition)

A premium, autonomous financial intelligence system & strategic wealth engine for modern professionals.

## 🌟 High-Fidelity Intelligence & Automation

### 📊 Intelligence Hub & Auditing
- **Autonomous Audit Engine**: Real-time multi-step financial scanning (Ledger, Benchmarking, Graph Calibration).
- **Interactive Report Preview**: View high-fidelity PDF reports directly in-browser before downloading.
- **Board-Ready Strategy Exports**: Professional PDF generation with embedded visual instruments, behavioral profiling, and neural health graphs.
- **Visual Data Audit**: Automated html2canvas capture for all dashboard charts, ensuring data transparency in reports.
- **Premium PDF UI**: Dark-themed, glassmorphic report designs with rounded cards and decorative strategic elements.

### 🤖 Autonomous "Zero-Input" Automations
- **AI Auto-Categorization (NLP)**: Regex-based high-confidence classification for 50+ global merchants (Uber, Swiggy, Amazon, AWS, Netflix, etc.).
- **Smart Overdue Nudges (WhatsApp)**: Automated debt-scanning for split bills with integrated "Friendly Nudge" simulations for bills > 48 hours.
- **Zero-Input Magic Link API**: Publicly accessible endpoint (`/api/magic-link`) for external logging via webhooks (Postman/cURL compatible).
- **Security Anomaly Detection**: Real-time spending spike alerts flagging any expense > 2.5x the 3-month rolling average.
- **Autonomous Wealth Engine**: Savings Rate analysis with specific portfolio allocations (Equity/Debt/Gold) based on real-time surplus.
- **Monthly Archival Pipeline**: Automated end-of-month PDF generation and cache clearing for a fresh financial slate.

## 🛠 Tech Stack
- **Framework:** Next.js 15 (App Router / Turbopack)
- **Styling:** Premium Vanilla CSS (Glassmorphism, High-Fidelity UI)
- **Database:** SQLite (via Prisma ORM)
- **Charts:** Chart.js 4.0
- **PDF Engine:** jsPDF + autoTable + html2canvas
- **Animations:** Framer Motion
- **OCR:** Tesseract.js

## 🚀 Getting Started

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

4. **Internal API Usage:**
   - **Magic Link Logging:** `POST /api/magic-link`
   - **Body:** `{ "userId": 1, "description": "Starbucks Coffee", "amount": 450 }`

## 💎 Features Included

### 🧠 Financial Intelligence
- **AI Spending Pattern Analysis**: Hyper-personalized insights based on financial behaviors.
- **Cash Flow Prediction**: 3-month neural forecasts based on historic trends.
- **Emergency Fund Tracker**: Automated goal tracking based on 6x overhead recommendation.
- **Location-based Tracking**: Precise location logging for business travel. 
- **Financial Milestone Tracker**: Gamification of savings achievements.

### 🔒 Security & Persistence
- **Prisma Database Integration**: Full persistence for Transactions, Goals, Splits, and Reports.
- **End-to-End Encryption**: AES-256 for protected database fields.
- **Rate Limiting**: Throttling for API security & MFA (Multi-Factor Auth) logic.
- **Secure File Vault**: Encrypted binary storage for archived strategic reports.

---
*Built with ❤️ by the FinanceEdge AI Team.*
