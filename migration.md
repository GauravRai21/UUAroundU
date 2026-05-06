# Migration Plan: Vite + React (JS) to Next.js + TypeScript

This document outlines the detailed step-by-step strategy for migrating the current Vite + React JavaScript client to a modern Next.js + TypeScript setup using the Next.js App Router.

## 📌 1. Architecture Strategy
- **Frontend Framework:** Next.js (App Router).
- **Language:** TypeScript (Strict Mode).
- **Styling:** Tailwind CSS (Carrying over existing configurations).
- **Backend Connection:** The existing Express + Socket.io backend will **remain unchanged** because Next.js serverless architecture does not natively support long-polling WebSockets. The Next.js frontend will interact with the Express API and Socket.io server the exact same way the Vite app did.

---

## 🚀 Phase 1: Project Initialization

1. **Create the Next.js App**
   Instead of modifying the Vite directory directly, create a new Next.js project alongside it, and then swap them out.
   ```bash
   npx create-next-app@latest next-client
   ```
   *During setup, select:*
   - TypeScript: **Yes**
   - ESLint: **Yes**
   - Tailwind CSS: **Yes**
   - `src/` directory: **Yes**
   - App Router: **Yes**
   - Import alias (`@/*`): **Yes**

2. **Install Existing Dependencies**
   Copy necessary dependencies from the Vite project. Drop Vite-specific ones.
   ```bash
   cd next-client
   npm install axios date-fns framer-motion lucide-react socket.io-client
   ```

---

## ⚙️ Phase 2: Configuration Migration

1. **Environment Variables**
   - Rename `.env` properties: Change all `VITE_API_URL` or similar `VITE_` prefixes to `NEXT_PUBLIC_API_URL`.
   - Update your API configuration files to use `process.env.NEXT_PUBLIC_...` instead of `import.meta.env.VITE_...`.

2. **Tailwind CSS Configuration**
   - Port your custom colors, fonts, and plugins from `client/tailwind.config.js` into the new `next-client/tailwind.config.ts`.
   - Ensure `content` paths in Tailwind config include the new `src/app`, `src/components`, and `src/context` directories.

3. **Global Styles**
   - Copy `client/src/index.css` and `client/src/App.css` contents into `next-client/src/app/globals.css`.
   - Ensure Tailwind base layers are retained.

4. **Public Assets**
   - Move everything from `client/public/` to `next-client/public/`.
   - Update asset references. Next.js serves from `/` by default.

---

## 🔀 Phase 3: Routing Migration (React Router → Next.js App Router)

Next.js uses a file-system-based router. The `react-router-dom` library will be completely removed.

1. **Mapping Routes**
   Convert your `App.jsx` route definitions to Next.js directory structure:
   - `/` ➡️ `src/app/page.tsx`
   - `/login` ➡️ `src/app/login/page.tsx`
   - `/register` ➡️ `src/app/register/page.tsx`
   - `/dashboard` ➡️ `src/app/dashboard/page.tsx`
   - *Dynamic routes:* `/user/:id` ➡️ `src/app/user/[id]/page.tsx`

2. **Updating Layouts**
   - The global wrapper (e.g., Navbar, Footer, Context Providers) goes into `src/app/layout.tsx`.
   - Create a `Providers.tsx` (marked with `"use client"`) to wrap all your context providers before placing them in the root layout.

3. **Updating Navigation Elements**
   - ❌ **Remove:** `import { Link, useNavigate } from 'react-router-dom'`
   - ✅ **Replace with:** `import Link from 'next/link'` and `import { useRouter } from 'next/navigation'`

---

## 🟦 Phase 4: Component & TypeScript Conversion

This will be the most time-consuming phase. Convert `.jsx` and `.js` files to `.tsx` and `.ts`.

1. **"use client" Directive**
   - By default, Next.js components are Server Components. 
   - Add `"use client";` to the very top of any component that uses:
     - React Hooks (`useState`, `useEffect`, `useContext`)
     - Event Listeners (`onClick`, `onChange`)
     - Browser-only APIs (`window`, `document`)
     - Framer Motion animations
     - Socket.io client instances

2. **Contexts (`src/context/`)**
   - Convert context files to `.tsx`.
   - Define TypeScript `interface` for Context state and dispatch actions.
   - Example: Provide types for user session data, Socket instances, etc.

3. **Components (`src/components/`)**
   - Move components over incrementally.
   - Define `interface` or `type` for component props instead of relying on `propTypes`.

---

## 🔌 Phase 5: Socket.io Integration in Next.js

Socket.io initialization needs care in a Server-Side Rendering (SSR) environment like Next.js.

1. Only initialize the Socket connection inside a `"use client"` component, preferably inside a `useEffect` to ensure it only runs on the browser.
2. Use a singleton pattern or a Context Provider to prevent multiple connections during React re-renders.

```tsx
"use client";
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL!);
    setSocket(newSocket);
    return () => { newSocket.close(); };
  }, []);

  return socket;
};
```

---

## 🛠️ Phase 6: Finalization & Cutover

1. **Fix TypeScript Errors:** Run `npm run build` or `npx tsc --noEmit` repeatedly to hunt down missing types.
2. **CORS Update (Server):** Update the Express backend CORS configuration to accept requests from standard Next.js ports (usually `http://localhost:3000`), since Vite typically runs on `5173`.
3. **Swap Directories:**
   Once everything is tested and working:
   ```bash
   mv client client-old-vite
   mv next-client client
   ```
4. **Update Root `README.md` & Root Scripts (If Any):** Ensure instructions for starting the dev server are updated to reflect the new commands (`npm run dev` in Next.js).

---
*Status: Ready to execute upon approval.*
