# CampusConnect Pro

An advanced, hyperlocal social networking platform built for communities. This application functions similarly to Nextdoor and Facebook, allowing users to join a specific community via a **Unique ID**, and interact with localized feeds, events, and a marketplace.

## 🚀 Features

- **UID-Based Communities:** Users join a dedicated community using a Unique ID instead of an email domain.
- **Advanced Social Feed:** 
  - Dynamic Tabs: "For You", "Nearby", and "Trending".
  - Rich Posts: Standard text, Image uploads, Polls, and Emergency Alerts.
- **Events System:** Create community events, view calendar, and RSVP (Going/Interested).
- **Marketplace:** Buy/sell items with category filters and price tags.
- **User Profiles:** Modern profiles with bios, avatars, and a Follow/Unfollow system.
- **Real-Time Ready:** Backend is configured with `socket.io` for community-isolated real-time updates.
- **Modern UI/UX:** Built with Tailwind CSS, Lucide icons, and Framer Motion for a premium, responsive interface.

## 🛠 Tech Stack & Dependencies

### **Frontend (`/client`)**
To run the frontend, the following npm packages are installed:
- **Core:** `react`, `react-dom`, `react-router-dom` (Routing), `axios` (API requests)
- **Styling:** `tailwindcss`, `postcss`, `autoprefixer`
- **UI & Animations:** `framer-motion` (Animations), `lucide-react` (Icons)
- **Utilities:** `date-fns` (Date formatting), `socket.io-client` (Real-time connection)

### **Backend (`/server`)**
To run the backend, the following npm packages are installed:
- **Core:** `express` (Server framework), `mongoose` (MongoDB ORM), `cors` (Cross-Origin Resource Sharing)
- **Authentication:** `jsonwebtoken` (JWT Auth), `bcryptjs` (Password hashing)
- **Real-Time:** `socket.io` (WebSockets)
- **Utilities:** `dotenv` (Environment variables)
- **DevDependencies:** `nodemon` (Hot reloading)

## 📁 Folder Structure

```
CampusConnect/
├── client/                 # Frontend React application (Vite)
│   ├── src/
│   │   ├── components/     # React components (Dashboard, Events, Marketplace, Profile, Sidebar, etc.)
│   │   ├── context/        # AuthContext for global state
│   │   ├── App.jsx         # Main React application with 3-column layout
│   │   └── index.css       # Global styles (Tailwind directives)
│   ├── package.json
│   └── tailwind.config.js  # Tailwind configuration
└── server/                 # Backend Node.js/Express application
    ├── middleware/         # Custom middleware (JWT verification)
    ├── models/             # Mongoose schemas (User, Post, Comment, Event, Listing, Message, Notification)
    ├── routes/             # Express API routes (Auth, Posts, Events, Marketplace, Users)
    ├── index.js            # Main server entry point (HTTP & Socket.io)
    ├── .env                # Environment variables
    └── package.json
```

## ⚙️ Setup Instructions

### Prerequisites
- Node.js installed
- MongoDB Atlas cluster (or local MongoDB)

### 1. Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Ensure your `server/.env` file has your database URI:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@cluster...
   JWT_SECRET=mysecretkeycampusconnect2026
   ```
4. Start the backend server:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup

1. Open a new terminal and navigate to the client directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```

### 3. Usage

1. Open your browser to the URL provided by Vite (e.g., `http://localhost:5173`).
2. Register a new account. Provide a **College Name** and a **Unique ID**.
3. You will be redirected to your community's Dashboard.
4. Use the left sidebar to navigate to the **Marketplace**, **Events**, or view your **Profile**.
