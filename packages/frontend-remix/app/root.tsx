import "./tailwind.css";

import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import type { User, UserRole } from "./types";
import { createContext, useContext } from "react";

import { Footer } from "./components/ui/Footer";
import type { LinksFunction } from "@remix-run/node";
import { Navbar } from "./components/ui/Navbar";
import { Toaster } from "react-hot-toast";
import { useState } from "react";

export const mockUser: User = {
  id: "123",
  email: "admin@miim.edu",
  role: "admin", // try switching to "faculty" or "student"
  name: "Admin User",
};

export const AuthContext = createContext(mockUser);
export const useAuth = () => useContext(AuthContext);


export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];


function LandingPage({
  handleLogin,
}: {
  handleLogin: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-2">
      <img src="/images/logo.png" alt="Logo" width="500" />
      <button
        onClick={handleLogin}
        className="px-6 py-2 btn-primary"
      >
        Log In
      </button>
    </div>
  );
}



export function Layout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState(mockUser);
  const [isLoggedIn, setIsLoggedIn] = useState(true)


  const handleLogin = () => {
    console.log("Logging in...");
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    console.log("Logging out...");
    setIsLoggedIn(false);
  };

  const switchRole = (newRole: UserRole) => {
    setUser({ ...user, role: newRole });
  };

  return (
    <AuthContext.Provider value={user}>
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <Meta />
          <Links />
        </head>
        <body className="min-h-screen flex flex-col">
          {isLoggedIn ? (
            <>
              <Navbar handleLogin={handleLogin} handleLogout={handleLogout} user={user} switchRole={switchRole} />
<Toaster position="top-right" reverseOrder={false} />
              <div className="flex-grow">
                {children}
              </div>
              <Footer />
            </>
          ) : (
            <LandingPage handleLogin={handleLogin} />
          )}
          <ScrollRestoration />
          <Scripts />
        </body>
      </html>
    </AuthContext.Provider>
  );
}

export default function App() {
  return (
    <Outlet />
  )
}
