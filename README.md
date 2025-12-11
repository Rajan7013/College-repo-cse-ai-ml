# 🎓 EduNexus - Academic Repository Platform

![EduNexus Banner](/public/banner-placeholder.png)

## 📖 Overview

**EduNexus** is a modern, full-stack academic repository platform designed for B.Tech CSE (AI & ML) students. It serves as a centralized hub for accessing, sharing, and managing educational resources like notes, question papers, lab manuals, and projects.

Built with **Next.js 16**, **Clerk Authentication**, and **Firebase**, it offers a secure, high-performance experience with "Military-Grade" security including role-based access control (Admin/Student).

---

## ✨ Features

### 👩‍🎓 Student Features
*   **📚 Resource Access:** View/Download Notes, Question Papers, Lab Manuals, Assignments.
*   **🔍 Advanced Search:** Filter by Regulation, Year, Semester, Subject Code, Unit, and Document Type.
*   **📂 Multi-Format Support:** In-browser viewing for PDF, Images, PowerPoint (PPT/PPTX), and Word (DOC/DOCX).
*   **👤 Student Profile:** Manage bio, profile picture, favorites, recently viewed items, and download history.
*   **📱 Responsive:** Optimized for both desktop and mobile devices.

### 👨‍🏫 Admin Features
*   **🛡️ Admin Dashboard:** Complete overview of platform stats (Total Users, Resources, Charts).
*   **📤 Resource Management:** Upload files to **Cloudflare R2** with metadata stored in **Firestore**.
*   **👥 User Management:** View all users, block/unblock accounts, and manage roles.
*   **📊 Analytics:** Track resource distribution by branch, type, and regulation.

---

## 🛠️ Tech Stack & Architecture

### **Frontend**
*   **Framework:** [Next.js 16 (App Router)](https://nextjs.org/)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS + Custom Animations (Poppins Font)
*   **Icons:** Lucide React
*   **Authentication:** [Clerk](https://clerk.com/)

### **Backend & Storage**
*   **Database:** Google Firebase Firestore
*   **File Storage:** Cloudflare R2 (S3-compatible object storage)
*   **Server Actions:** Next.js Server Actions (using Firebase Admin SDK)
*   **Security:** Firestore Security Rules + Server-side Role Verification

---

## 📂 Project Structure

```bash
college/
├── app/
│   ├── admin/              # Admin-only routes (Dashboard, Upload)
│   ├── dashboard/          # Student resource discovery
│   ├── profile/            # User profile management
│   ├── sign-in/            # Clerk auth pages
│   ├── globals.css         # Global styles & animations
│   ├── layout.tsx          # Root layout with Navbar & Auth
│   └── page.tsx            # Landing page
├── components/             # Reusable UI components
│   ├── AdvancedSearch.tsx  # Filtering & Search UI
│   ├── Navbar.tsx          # Responsive navigation
│   ├── PDFViewer.tsx       # PDF rendering component
│   ├── UserActions.tsx     # Admin user management buttons
│   └── ...
├── lib/
│   ├── actions/            # Server Actions (Business Logic)
│   │   ├── admin.ts        # Admin stats logic
│   │   ├── resources.ts    # Resource fetching
│   │   ├── upload.ts       # File upload (Admin SDK)
│   │   ├── users.ts        # User management
│   │   └── user.ts         # User sync
│   ├── firebase-admin.ts   # Firebase Admin SDK init
│   └── firebase.ts         # Firebase Client SDK init
└── public/                 # Static assets
```

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/edunexus.git
cd edunexus
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory and add the following keys:

```env
# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Firebase Client (from console)
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
# ... other firebase config

# Firebase Admin (from service-account.json)
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----..."

# Cloudflare R2
R2_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET_NAME=...
NEXT_PUBLIC_R2_PUBLIC_URL=...
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## 🔐 Security Information

*   **Role-Based Access:** All sensitive Server Actions use `firebase-admin` to bypass client-side rules but manually verify `userId` and `role` from Firestore before execution.
*   **Firestore Rules:** Client-side read/write is restricted. Only authenticated users can read. Writes are handled via Server Actions.
*   **Environment Variables:** Sensitive keys (service account, secrets) are never exposed to the client.

---

## 📦 Deployment

This project is optimized for deployment on **Vercel**.

1.  Push code to GitHub.
2.  Import project into Vercel.
3.  Add all environment variables from `.env.local` to Vercel settings.
4.  Deploy! 🚀

---

## 📜 License

This project is licensed under the MIT License.
