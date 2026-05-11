# Business Nexus — Investor & Entrepreneur Collaboration Platform

A full-featured React platform connecting investors and entrepreneurs with advanced collaboration tools.

🔗 **Live Demo:** https://nexus-lml4729w2-rushda-s-projects.vercel.app  
📁 **GitHub:** https://github.com/Rushda355/Nexus

---

## 🚀 Tech Stack

| Technology | Purpose |
|------------|---------|
| React + TypeScript | Frontend framework |
| Vite | Build tool |
| Tailwind CSS | Styling |
| React Router DOM | Client-side routing |
| FullCalendar | Meeting scheduling |
| Lucide React | Icons |

---

## 📁 Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── DashboardLayout.tsx   # Main layout wrapper
│   │   ├── Navbar.tsx            # Top navigation bar
│   │   └── Sidebar.tsx           # Side navigation menu
│   ├── collaboration/
│   │   └── CollaborationRequestCard.tsx
│   ├── investor/
│   │   └── InvestorCard.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Card.tsx
│       └── Badge.tsx
├── pages/
│   ├── auth/
│   │   ├── LoginPage.tsx         # Login with role selection
│   │   └── RegisterPage.tsx      # User registration
│   ├── dashboard/
│   │   ├── EntrepreneurDashboard.tsx  # Entrepreneur home
│   │   └── InvestorDashboard.tsx      # Investor home
│   ├── calendar/
│   │   └── CalendarPage.tsx      # Meeting scheduling calendar
│   ├── videocall/
│   │   └── VideoCallPage.tsx     # Video calling UI
│   ├── documentchamber/
│   │   └── DocumentChamberPage.tsx  # Document management
│   ├── payment/
│   │   └── PaymentPage.tsx       # Payment & wallet
│   ├── security/
│   │   └── SecurityPage.tsx      # Password & 2FA
│   ├── profile/
│   ├── messages/
│   ├── notifications/
│   ├── deals/
│   ├── settings/
│   └── help/
├── context/
│   └── AuthContext.tsx           # Global auth state
├── data/
│   ├── users.ts                  # Mock user data
│   └── collaborationRequests.ts  # Mock requests
├── types/
│   └── index.ts                  # TypeScript interfaces
├── App.tsx                       # Main routing
└── main.tsx                      # Entry point
```

---

## ✨ Features

### Week 1 — Scheduling & Setup
- ✅ Consistent UI theme with Tailwind CSS
- ✅ Meeting Scheduling Calendar (FullCalendar)
- ✅ Add/modify availability slots
- ✅ Send, accept, decline meeting requests
- ✅ Confirmed meetings displayed on dashboard

### Week 2 — Video Calling & Documents
- ✅ Video Call UI with WebRTC mock
- ✅ Start/End call, audio/video toggle, screen share
- ✅ Document Chamber for deals & contracts
- ✅ PDF upload & preview
- ✅ E-signature mockup with signature pad
- ✅ Status labels: Draft / In Review / Signed

### Week 3 — Payments, Security & Polish
- ✅ Mock Payment UI (Stripe/PayPal style)
- ✅ Deposit, Withdraw, Transfer simulation
- ✅ Transaction history table
- ✅ Wallet balance on dashboard
- ✅ Investor → Entrepreneur funding flow
- ✅ Password strength meter
- ✅ Multi-step 2FA mockup with OTP input
- ✅ Role-based UI (Investor vs Entrepreneur)
- ✅ Guided walkthrough tour
- ✅ Fully responsive design

---

## 🔐 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Entrepreneur | Use "Entrepreneur Demo" button | Auto login |
| Investor | Use "Investor Demo" button | Auto login |

---

## 🛠️ Local Setup

```bash
# 1. Clone the repo
git clone https://github.com/Rushda355/Nexus.git

# 2. Go into the folder
cd Nexus

# 3. Install dependencies
npm install

# 4. Start development server
npm run dev

# 5. Open in browser
http://localhost:5173
```

---

## 📱 Pages & Routes

| Route | Page |
|-------|------|
| `/login` | Login Page |
| `/register` | Register Page |
| `/dashboard/entrepreneur` | Entrepreneur Dashboard |
| `/dashboard/investor` | Investor Dashboard |
| `/calendar` | Meeting Calendar |
| `/videocall` | Video Call |
| `/documentchamber` | Document Chamber |
| `/payment` | Payment Center |
| `/security` | Security & 2FA |
| `/messages` | Messages |
| `/notifications` | Notifications |
| `/deals` | Deals |
| `/settings` | Settings |

---

## 👩‍💻 Developer

**Rushda** — Frontend Intern  
Deadline: 25 May 2026