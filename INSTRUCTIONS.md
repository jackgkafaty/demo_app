# 🧾 Personal Finance Dashboard — Full Development Instructions

A self-hosted, AES-encrypted personal finance dashboard to track assets, budgets, and taxes. Fully supports desktop, mobile, and a native iOS app with AI chatbot functionality.

---

## ⚙️ Tech Stack Overview

### Web (Responsive Design)
- **Frontend**: React + Tailwind CSS
- **Backend**: Node.js
- **Database**: MongoDB
- **Authentication**: Passkeys (WebAuthn)
- **Charting**: Recharts
- **Deployment**: Docker or Podman

### iOS Native App (iOS 16+)
- **Framework**: React Native
- **Navigation**: React Navigation
- **Storage**: MongoDB Realm or Encrypted SQLite
- **Charting**: Victory Native
- **Auth**: Face ID / Touch ID (with Passkey fallback)

### AI Assistant
- **Provider**: OpenAI GPT-4o-mini
- **Use Case**: Private, contextual chatbot for financial questions
- **Security**: Client data redaction, no PII allowed

---

## 🤖 AI Chatbot Integration

### Purpose

Add an AI chatbot that can answer user questions about their finances, such as:

- “What category did I spend the most in this month?”
- “What expense looks unusually high?”
- “Based on this, how should I improve my portfolio?”

### Integration Code

> Install the SDK

```bash
npm install openai
```

> Example setup (Backend only — DO NOT expose key to client)

```ts
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: "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",
});

const completion = openai.chat.completions.create({
  model: "gpt-4o-mini",
  store: true,
  messages: [
    { role: "user", content: "What expense is too high this month?" },
  ],
});

completion.then((result) => console.log(result.choices[0].message));
```

### Privacy Protection

> ❗ MUST prevent the AI from seeing or storing:

- Names
- Emails
- Bank names
- Account numbers
- SSNs
- Card numbers

#### Implement Input Filtering

Use regular expressions or AI content moderation to redact or block:
```regex
(\d{4}[-\s]?){3,4}        # credit cards
\d{9,12}                  # bank accounts
(?:[A-Z]{2,3}\d{6,10})    # tax IDs
[A-Za-z0-9._%+-]+@        # email addresses
```

Block message submission if sensitive content is found.

---

## 📱 Responsive Mobile Design

### Tailwind Responsive Rules
- Mobile: `max-w-[360px]`
- Tablet: `max-w-[768px]`
- Desktop: `min-w-[1280px]`

Ensure:
- Tables stack vertically on small screens
- Buttons are thumb-friendly
- Use `flex-wrap`, `min-w-0`, and `%` widths for adaptive layout

Test on:
- Chrome Mobile
- Safari iOS
- Firefox Android

---

## 📲 React Native iOS App

> Inside project: `mobile/ios-app`

### Setup Instructions

```bash
npx create-expo-app ios-finance-app
cd ios-finance-app
npm install react-navigation react-native-svg victory-native
```

### iOS Requirements

- Target: iOS 16+
- Supported sizes: iPhone SE (375×667) to iPhone 15 Pro Max (430×932)
- Tabs:
  - Liquid Assets
  - Monthly Expenses
  - Budget Tracking
  - Retirement & Savings
  - TFSA
  - Stock Tracking

- Features:
  - Biometric login
  - Push notifications
  - Background sync
  - Secure AES-256 local storage

---

## 📁 App Tabs & Features (Web + iOS)

### 💰 Liquid Assets
- Account cards showing balance, gain/loss
- Total in USD (auto-convert)
- Horizontal bar chart

### 📉 Monthly Expenses
- Drag & drop receipts
- Automatic category/date detection
- Undo + confirmation modals

### 📊 Budget Tracking
- Monthly category budget vs. actual
- Suggestions for next month
- Visual gauge charts

### 🏦 Retirement & Savings
- Goal tracking
- Compound growth simulator

### 🇨🇦 TFSA Tracker
- Yearly limit
- Over-contribution warnings

### 📈 Stock Tracking
- Manual ticker entry
- Auto-fetch price from NASDAQ/Yahoo
- Tax estimates & realized gains

---

## 🔐 Authentication

- Web & iOS: Passkey login via WebAuthn
- Fallback: Admin-generated one-time password
- User profile fields:
  - `name`
  - `email`
  - `role` (`standard`, `admin`)
  - `passkey ID`

---

## 🧪 UX & Error Handling

| Condition | UX Behavior |
|----------|-------------|
| Market API fails | Show "cached value" |
| CAD/USD rate fails | Warn: "Estimated only" |
| Wrong drag target | Show undo or confirm modal |
| AI timeout | Retry or fallback to cached summary |
| PII in AI prompt | Block submission with alert |

---

## 🧠 AI Chatbot Placement

### Web
- Floating widget or side panel
- Activated from any tab
- Send local context to AI without PII

### iOS
- Dedicated “Ask AI” tab
- Communicates with same Node backend
- Fallback message if offline

---

## 📦 Docker/Podman Deployment

```yaml
version: "3.8"
services:
  finance-dashboard:
    build: .
    ports:
      - "3000:3000"
    volumes:
      - ./data:/app/data
    environment:
      - NODE_ENV=production
    command: ["npm", "start"]
```

- Prompt for `Admin Master Password` on first run
- Database mounts to `/app/data`
- Secure `.env` for keys:
  - `OPENAI_KEY`
  - `MONGO_URI`
  - `JWT_SECRET`

---

## 🧠 AI Agent Notes (Internal)

- Maintain consistent `data models` across web and mobile
- All user input must be sanitized before AI access
- Store AI queries only if redacted
- Avoid leaking context to frontend
- Use `componentized UI` with tab separation
- Ensure financial entries include timestamps for logs
- Encrypt all backups and user metadata (AES-256)
- Validate and sanitize financial input on both frontend and backend
- Prefer `cloud queue` for background AI processing if long tasks arise

---

## ✅ V2 Features (Optional/Future)

- PDF export & print layout
- Multilingual interface
- Banking API integrations (Plaid/Yodlee)
- Monthly digest powered by AI
- Sharing with accountant/spouse via read-only links

---

**This instruction file is to be followed by AI development agents and IDE assistants. The system must protect user privacy and comply with encryption and PII safeguards.**
