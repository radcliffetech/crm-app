import "./tailwind.css";

import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { useEffect, useState } from "react";

import { Footer } from "./components/ui/Footer";
import type { LinksFunction } from "@remix-run/node";
import { Navbar } from "./components/ui/Navbar";

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

  const [isLoggedIn, setIsLoggedIn] = useState(true)
  

const handleLogin = () => {
    console.log("Logging in...");
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    console.log("Logging out...");
    setIsLoggedIn(false);
  };

  return (
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
            <Navbar handleLogin={handleLogin} handleLogout={handleLogout} user={{ displayName: "Demo User" }} />
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
  );
}

export default function App() {
  return <Outlet />;
}
