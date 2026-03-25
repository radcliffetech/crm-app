import "./tailwind.css";

import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useRouteError,
  useLoaderData,
  useNavigate,
} from "react-router";
import type { User, UserRole } from "./types";
import type { LoaderFunctionArgs, LinksFunction } from "react-router";
import { createContext, useContext } from "react";

import { ConfirmDialogProvider } from "~/components/Common/ConfirmDialogProvider";
import { Footer } from "~/components/Common/Footer";
import { Navbar } from "~/components/Common/Navbar";
import { Toaster } from "react-hot-toast";
import { getUserFromRequest } from "~/lib/auth";

const defaultUser: User = { id: "", email: "", role: "student", name: "" };

export const AuthContext = createContext<User>(defaultUser);
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

export async function loader({ request }: LoaderFunctionArgs) {
  const user = getUserFromRequest(request);
  return { user };
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { user } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/logout");
  };

  const isLoggedIn = !!user;

  return (
    <AuthContext.Provider value={user ?? defaultUser}>
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
              <Navbar
                handleLogin={() => navigate("/login")}
                handleLogout={handleLogout}
                user={user}
                switchRole={(_newRole: UserRole) => navigate("/logout")}
              />
              <Toaster position="top-right" reverseOrder={false} />
              <div className="flex-grow">{children}</div>
              <Footer />
            </>
          ) : (
            <>{children}</>
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
    <ConfirmDialogProvider>
      <Outlet />
    </ConfirmDialogProvider>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <html lang="en">
        <head>
          <title>{`${error.status} ${error.statusText}`}</title>
          <Meta />
          <Links />
        </head>
        <body>
          <h1>
            {error.status} - {error.statusText}
          </h1>
          <p>Sorry, an unexpected error occurred.</p>
          <Scripts />
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <head>
        <title>Unknown Error</title>
        <Meta />
        <Links />
      </head>
      <body>
        <h1>Unknown Error</h1>
        <p>Sorry, an unknown error occurred.</p>
        <Scripts />
      </body>
    </html>
  );
}
