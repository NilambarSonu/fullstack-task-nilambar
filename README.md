# 🚀 NEXUS | Future Task Management

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-16.0.3-black?style=for-the-badge&logo=next.js" alt="Next.js"/>
  <img src="https://img.shields.io/badge/React-19.2.0-blue?style=for-the-badge&logo=react" alt="React"/>
  <img src="https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge&logo=node.js" alt="Node.js"/>
  <img src="https://img.shields.io/badge/Vercel-deployed-blue?style=for-the-badge&logo=vercel" alt="Vercel"/>
  <img src="https://img.shields.io/badge/MongoDB-4.0+-green?style=for-the-badge&logo=mongodb" alt="MongoDB"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-purple?style=for-the-badge&logo=tailwindcss" alt="Tailwind CSS"/>
  <img src="https://img.shields.io/badge/Passport.js-0.7.0-blue?style=for-the-badge&logo=passport" alt="Passport.js"/>
  <img src="https://img.shields.io/badge/Express.js-4.18+-blue?style=for-the-badge&logo=express" alt="Express.js"/>
</div>

## 🌟 Overview

Welcome to **NEXUS | Future Task Management** - a scalable, futuristic task manager built with Next.js. Featuring stunning cyberpunk-inspired UI with dynamic animated backgrounds, glassmorphism effects, and a robust backend for seamless task tracking.

![TaskForge Preview](https://via.placeholder.com/800x200/050511/ffffff?text=TaskForge+Cyberpunk+UI)

## ✨ Features

### 🎯 Core Functionality
- 🔐 **Secure Authentication** - JWT-based registration/login + OAuth (Google & GitHub)
- 🔑 **OAuth Integration** - Sign in with Google or GitHub accounts instantly
- 📋 **Task Management** - Create, read, update, and delete tasks with ease
- ✅ **Task Completion** - Mark tasks as complete with visual feedback
- 🔍 **Real-time Search** - Instantly search through your tasks
- 🔔 **Real-time Notifications** - Get instant alerts when tasks are created/updated
- 📊 **Progress Tracking** - Visual progress bar showing completed vs total tasks
- 📱 **Responsive Design** - Optimized for desktop and mobile devices

### 🎨 UI/UX Highlights
- 🌌 **Cyberpunk Theme** - Immersive animated grid background and floating particles
- ✨ **Glassmorphism Design** - Modern translucent UI elements
- 🎭 **Dynamic Styling** - Smooth transitions and hover effects
- 🎨 **Dark Mode Optimized** - Midnight navy color scheme 
- 🚀 **Fast Performance** - Built with Next.js 16 for optimal loading

## 🛠 Tech Stack

### Frontend
- **Framework:** Next.js 16.0.3
- **UI Library:** React 19.2.0
- **Styling:** Tailwind CSS v4
- **Icons:** Font Awesome 6.0
- **Authentication:** Custom JWT hooks

### Backend
- **Runtime:** Node.js
- **Server:** Express.js 4.18+
- **Database:** MongoDB with Mongoose
- **Security:** JWT Authentication + bcrypt hashing
- **Middleware:** CORS, Authentication middleware

## 📋 Prerequisites

Before running this application, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (local installation or cloud service like MongoDB Atlas)
- **npm** or **yarn** package manager

## 🚀 Installation

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Configuration:**
   Create a `.env` file in the backend root with the following variables:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/taskforge
   JWT_SECRET=your_super_secret_jwt_key_here

   # OAuth Configuration
   GOOGLE_CLIENT_ID=your_google_client_id_here
   GOOGLE_CLIENT_SECRET=your_google_client_secret_here
   GITHUB_CLIENT_ID=your_github_client_id_here
   GITHUB_CLIENT_SECRET=your_github_client_secret_here

   # URLs (Update for production deployment)
   FRONTEND_URL=http://localhost:3000
   BACKEND_URL=http://localhost:5000
   ```

4. **OAuth Setup:** (Required for Google/GitHub login)

   **Google OAuth:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable Google+ API
   - Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
   - Set Authorized JavaScript origins: `http://localhost:3000` (or your Vercel URL)
   - Set Authorized redirect URIs: `http://localhost:5000/api/auth/google/callback` (or your deployed backend URL)
   - Copy Client ID and Client Secret to `.env`

   **GitHub OAuth:**
   - Go to [GitHub Developer Settings](https://github.com/settings/developers)
   - Select "OAuth Apps" → "New OAuth App"
   - Fill in app details (name, description, etc.)
   - Set Authorization callback URL: `http://localhost:5000/api/auth/github/callback` (or your deployed backend URL)
   - Copy Client ID and Client Secret to `.env`

4. **Start the backend server:**
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

### Frontend Setup

1. **Open a new terminal and navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Access the application:**
   - Open [http://localhost:3000](http://localhost:3000) in your browser
   - Backend API runs on [http://localhost:5000](http://localhost:5000)

## 🎯 Usage

1. **Registration:** Create a new account via the `/register` page
2. **Login:** Authenticate using your credentials at `/login`
3. **Dashboard:** Access your personalized task management dashboard
4. **Manage Tasks:** Add, edit, complete, and delete tasks effortlessly
5. **Track Progress:** Monitor your productivity with the built-in progress bar
6. **Search:** Find specific tasks quickly using the search functionality

## 🔌 API Endpoints

### Authentication Routes
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/google` - Initiate Google OAuth login
- `GET /auth/google/callback` - Google OAuth callback
- `GET /auth/github` - Initiate GitHub OAuth login
- `GET /auth/github/callback` - GitHub OAuth callback
- `GET /auth/me` - Get current user info

### Task Routes (Protected)
- `GET /tasks` - Retrieve all user tasks
- `POST /tasks` - Create a new task
- `PUT /tasks/:id` - Update a specific task
- `DELETE /tasks/:id` - Delete a specific task

## 📁 Project Structure

```
fullstack-task-nilambar/
├── backend/
│   ├── models/
│   │   ├── User.js          # User schema
│   │   └── Task.js          # Task schema
│   ├── routes/
│   │   ├── auth.js          # Authentication routes
│   │   └── task.js          # Task management routes
│   ├── middleware/
│   │   └── authMiddleware.js # JWT authentication middleware
│   ├── .env                 # Environment variables
│   ├── package.json         # Backend dependencies
│   └── server.js            # Main server file
│
├── frontend/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.js    # Login page
│   │   │   └── register/
│   │   │       └── page.js    # Registration page
│   │   ├── dashboard/
│   │   │   └── page.js        # Task dashboard
│   │   ├── globals.css        # Global styles & cyberpunk animations
│   │   ├── layout.js          # Root layout with navigation
│   │   └── page.js            # Homepage
│   ├── hooks/
│   │   └── useAuth.js         # Authentication hook
│   ├── utils/
│   │   └── api.js             # API utility functions
│   ├── package.json           # Frontend dependencies
│   └── tailwind.config.js     # Tailwind configuration
│
└── README.md                  # Project documentation
```

## 🚀 Deployment to Vercel

### Frontend Deployment

1. **Connect your repository to Vercel:**
   - Push your code to GitHub/GitLab/Bitbucket
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project" and import your repository

2. **Configure build settings:**
   - Build Command: `npm run build` or `cd frontend && npm run build`
   - Output Directory: `frontend/.next` (if deploying from monorepo)
   - Custom Domain: Optional

3. **Environment Variables:**
   Add these to Vercel Environment Variables:
   ```env
   NEXT_PUBLIC_BACKEND_URL=https://your-backend-url.vercel.app
   ```

4. **Deploy:** Click "Deploy" - your frontend is live!

### Backend Deployment

1. **Create a Vercel API project:**
   - Connect your backend repository
   - Configure build settings for API routes

2. **Environment Variables:**
   ```env
   MONGODB_URI=mongodb+srv://...
   JWT_SECRET=your_super_secret_jwt_key_here
   GOOGLE_CLIENT_ID=...
   GOOGLE_CLIENT_SECRET=...
   GITHUB_CLIENT_ID=...
   GITHUB_CLIENT_SECRET=...
   FRONTEND_URL=https://your-frontend.vercel.app
   BACKEND_URL=https://your-backend.vercel.app
   SESSION_SECRET=your_session_secret_here
   ```

3. **Update OAuth redirect URIs:**
   - Google Cloud Console: Add `https://your-backend.vercel.app/api/auth/google/callback`
   - GitHub OAuth App: Update callback URL to `https://your-backend.vercel.app/api/auth/github/callback`

4. **Frontend Environment:** Update `NEXT_PUBLIC_BACKEND_URL` in Vercel to point to deployed backend

### Pre-deployment Checklist
- ✅ All environment variables configured
- ✅ MongoDB Atlas connection string updated
- ✅ OAuth redirect URIs updated for production URLs
- ✅ Frontend/backend URLs properly configured
- ✅ Database models support OAuth users (`googleId`, `githubId` fields)

## 📄 License

This project is licensed under the ISC License - see the package.json files for details.

## 🙏 Acknowledgments

- **Icons:** Font Awesome for beautiful iconography
- **Fonts:** Google Fonts (Roboto) for typography
- **Cyberpunk Inspiration:** Retrowave aesthetics for the UI design
- **Community:** Thanks to the open-source developers who made this stack possible

---

**made with one plate biriyani** 🍛 **NilambarSonu**
