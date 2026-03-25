import type { ActionFunctionArgs, MetaFunction } from "react-router";
import { redirect, useActionData, Form } from "react-router";
import { makeAuthCookies } from "~/lib/auth";

const API_URL = import.meta.env.VITE_API_BASE_URL;

export const meta: MetaFunction = () => {
  return [{ title: "Login – MiiM CRM" }];
};

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  const res = await fetch(`${API_URL}/auth/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    return { error: "Invalid username or password." };
  }

  const { access, refresh, user } = await res.json();

  const headers = new Headers();
  for (const cookie of makeAuthCookies(access, refresh, user)) {
    headers.append("Set-Cookie", cookie);
  }

  return redirect("/", { headers });
}

const DEMO_ACCOUNTS = [
  { label: "Admin", username: "admin", password: "admin123" },
  { label: "Faculty", username: "faculty", password: "faculty123" },
  { label: "Student", username: "student", password: "student123" },
];

export default function LoginPage() {
  const actionData = useActionData<typeof action>();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <img
            src="/images/logo.png"
            alt="MiiM Logo"
            className="mx-auto h-32 mb-4"
          />
          <h1 className="text-2xl font-bold text-gray-900">Sign in to MiiM CRM</h1>
        </div>

        <Form method="post" className="bg-white shadow rounded-lg p-6 space-y-4">
          {actionData?.error && (
            <div className="bg-red-50 text-red-700 p-3 rounded text-sm">
              {actionData.error}
            </div>
          )}

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <button type="submit" className="w-full btn-primary py-2">
            Sign In
          </button>
        </Form>

        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-sm text-gray-500 mb-3 text-center">Demo Accounts</p>
          <div className="flex gap-2">
            {DEMO_ACCOUNTS.map((account) => (
              <Form method="post" key={account.username} className="flex-1">
                <input type="hidden" name="username" value={account.username} />
                <input type="hidden" name="password" value={account.password} />
                <button
                  type="submit"
                  className="w-full border border-gray-300 rounded py-2 px-3 text-sm hover:bg-gray-50"
                >
                  {account.label}
                </button>
              </Form>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
