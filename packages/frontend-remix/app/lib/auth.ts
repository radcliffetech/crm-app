import type { User } from "~/types";

export function getTokenFromRequest(request: Request): string | null {
  const cookie = request.headers.get("Cookie") || "";
  const match = cookie.match(/access_token=([^;]+)/);
  return match ? match[1] : null;
}

export function getTokenFromDocument(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/access_token=([^;]+)/);
  return match ? match[1] : null;
}

export function getUserFromRequest(request: Request): User | null {
  const cookie = request.headers.get("Cookie") || "";
  const match = cookie.match(/user_info=([^;]+)/);
  if (!match) return null;
  try {
    return JSON.parse(decodeURIComponent(match[1]));
  } catch {
    return null;
  }
}

export function makeAuthCookies(
  access: string,
  refresh: string,
  user: User,
): string[] {
  return [
    `access_token=${access}; Path=/; SameSite=Lax; Max-Age=3600`,
    `refresh_token=${refresh}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`,
    `user_info=${encodeURIComponent(JSON.stringify(user))}; Path=/; SameSite=Lax; Max-Age=3600`,
  ];
}

export function makeClearCookies(): string[] {
  return [
    "access_token=; Path=/; Max-Age=0",
    "refresh_token=; Path=/; HttpOnly; Max-Age=0",
    "user_info=; Path=/; Max-Age=0",
  ];
}
