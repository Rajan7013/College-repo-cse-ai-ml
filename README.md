# 🎓 EduNexus - Academic Resource Management System

> **Revolutionizing Academic Resource Sharing with Modern Web Technologies.**

## 📖 Table of Contents
1.  [Project Overview](#-project-overview)
2.  [Problem & Solution](#-problem--solution)
3.  [✨ Key Features](#-key-features)
4.  [🛠️ Technology Stack (Deep Dive)](#%EF%B8%8F-technology-stack-deep-dive)
5.  [📂 Project Structure](#-project-structure)
6.  [⚙️ Installation & Setup](#%EF%B8%8F-installation--setup)
7.  [🔒 Security & Roles](#-security--roles)
8.  [📊 Analytics System](#-analytics-system)

---

## 🚀 Project Overview
**EduNexus** is a high-performance, centralized platform designed for educational institutions to manage, share, and track academic resources (Notes, Lab Manuals, Question Papers). Built with **Next.js 14**, it offers a premium, app-like experience with a unified "Glassmorphism" Design System.

**Live Demo**: [Deployed URL Here]

## 💡 Problem & Solution

### The Problem
*   **Fragmentation**: Students struggle to find accurate notes, often shifting between WhatsApp groups, Drive links, and photocopy shops.
*   **Lack of Analytics**: Admins have no visibility into which resources are actually useful or popular.
*   **Poor UX**: Traditional college portals are clunky, slow, and mobile-unfriendly.

### The Solution (EduNexus)
*   **Centralized Hub**: A single, searchable repository for all branches, semesters, and subjects.
*   **Role-Based Control**: Strict hierarchy (SuperAdmin > Admin > Student) ensures content quality.
*   **Behavior Tracking**: Detailed analytics on what students view and search for.
*   **Lightning Speed**: Optimized with Server-Side Caching (ISR) and Edge delivery.

---

## ✨ Key Features

### 1. 🛡️ Role-Based Access Control (RBAC)
*   **SuperAdmin**: The Root User (Hardcoded Security). Can manage Admins.
*   **Admin**: Can upload resources, manage curriculums, and view analytics.
*   **Student**: Can view, search, and download resources.
*   **Auto-Sync**: Google Profile Pictures and Names are automatically synced on login.

### 2. 📂 Smart Resource Management
*   **Cloud Storage**: Files are stored in **Cloudflare R2** (S3-compatible) for zero-egress fees and high speed.
*   **Metadata Engine**: Resources are tagged by Regulation (R24, R22), Year, Branch, and Subject Code.
*   **Interactive Viewers**: Built-in PDF and Office document viewers (no need to download to view).

### 3. 📈 Behavior Analytics Dashboard
*   **Real-Time Logging**: Tracks every View, Search, and Download.
*   **Engagement Metrics**: See "Top 5 Active Students", "Most Popular Documents".
*   **Duration Tracking**: Estimates how long a student spends reading a document.

### 4. 🎨 Premium UI/UX
*   **Glassmorphism**: Modern, translucent aesthetics using backdrop-blur.
*   **Responsive**: Fully optimized for Mobile, Tablet, and Desktop.
*   **Global Theme**: Consistent Blue/Cyan gradient theme across the app.

---

## 🛠️ Technology Stack (Deep Dive)

We chose this stack to ensure **Scaler, Speed, and Security**.

### 1. Frontend: Next.js 14 (App Router)
*   **What it is**: The React framework for the web using Server Components.
*   **Why we chose it**: 
    *   **RSC (React Server Components)**: Logic runs on the server, reducing the JS bundle sent to the phone (faster load).
    *   **SEO**: Content is rendered on the server, making it indexable by Google.
    *   **ISR (Incremental Static Regeneration)**: Caches pages like the Dashboard for 60s to handle high traffic instantly.

### 2. Styling: Tailwind CSS v4
*   **What it is**: A utility-first CSS framework.
*   **Why we chose it**: 
    *   **Design System**: Allows defining a global "Blue Theme" in one place.
    *   **Performance**: Generates only the CSS used in the project (Tiny CSS file).

### 3. Database: Firebase Firestore (NoSQL)
*   **What it is**: A flexible, scalable NoSQL cloud database.
*   **Why we chose it**: 
    *   **Real-time capabilities**: Instant updates for whitelists and settings.
    *   **Schema-less**: Easy to adapt when adding new features like "Analytics Logs" without breaking old data.

### 4. Authentication: Clerk
*   **What it is**: Use Management Platform.
*   **Why we chose it**: 
    *   **Security**: Handles session management, MFA, and Google (OAuth) logins securely.
    *   **Developer Experience**: Saves 100+ hours of building login forms.

### 5. Storage: Cloudflare R2
*   **What it is**: Object Storage (like AWS S3).
*   **Why we chose it**: **Zero Egress Fees**. Unlike AWS, we don't pay when students download files. Best for academic distribution.

---

## 📂 Project Structure

```bash
/college
├── /app                  # Next.js App Router (Pages & API Routes)
│   ├── /admin            # Admin Dashboard, Upload, Analytics Pages
│   ├── /resources        # Public Resource Listing & Viewing
│   ├── /api              # Backend API Endpoints (Webhooks, etc.)
│   └── globals.css       # Global Tailwind Styles & Glassmorphism classes
├── /components           # Reusable UI Components
│   ├── /admin            # Admin-specific components (UserRoleManager, Analytics)
│   ├── /search           # SearchBar with Debounce & Logging
│   └── ResourceCard.tsx  # Display component for files
├── /lib                  # Backend Logic & Utilities
│   ├── /actions          # Server Actions (The "Backend" API layer)
│   │   ├── admin.ts      # Cached Dashboard Stats
│   │   ├── analytics.ts  # Logging & Stats Logic
│   │   └── users.ts      # Role Management Logic
│   └── firebase.ts       # Database Clients
└── /public               # Static Assets
```

---

## ⚙️ Installation & Setup

Follow these steps to deploy your own instance.

### Prerequisites
*   Node.js 18+
*   npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/edunexus.git
cd edunexus
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables (.env.local)
Create a `.env.local` file in the root. **This is CRITICAL**. Do not reveal these keys.

```env
# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Firebase Admin (Backend Access)
# Download service-account.json or use these vars
NEXT_PUBLIC_FIREBASE_PROJECT_ID=college-db-xxx
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----..."

# Cloudflare R2 (Storage)
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET_NAME=college-resources
R2_ACCOUNT_ID=...
NEXT_PUBLIC_R2_PUBLIC_URL=https://pub-xxx.r2.dev
```

### 4. Run Locally
```bash
npm run dev
```

---

## 🔒 Security & Roles

### The "SuperAdmin"
*   **Identity**: `rajanprasaila@gmail.com` (Hardcoded protection).
*   **Powers**:
    1.  Only user who can **Delete Admins**.
    2.  Immune to Deletion/Blocking/Role Changes (Backend protected).
    3.  Frontend buttons are hidden for this user.

### Role Management
*   **Whitelist System**: Admins add users by email.
*   **Logic**: 
    *   If Email in Whitelist -> Assign Role.
    *   If Email NOT in Whitelist -> Assign 'Student'.
    *   Removed from Whitelist -> Instant Downgrade to 'Student'.

---

## 📊 Analytics System
*   **Tech**: Custom Event Logging to Firestore `analytics_logs`.
*   **Privacy**: Logs user Email, Action (View/Search), and Timestamp.
*   **Performance**: Aggregates are cached for 60 seconds to prevent database overload.

---

**Developed with by Rajan Prasaila Yadav**
