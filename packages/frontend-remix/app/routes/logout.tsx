import type { LoaderFunctionArgs } from "react-router";
import { redirect } from "react-router";
import { makeClearCookies } from "~/lib/auth";

export async function loader(_args: LoaderFunctionArgs) {
  const headers = new Headers();
  for (const cookie of makeClearCookies()) {
    headers.append("Set-Cookie", cookie);
  }
  return redirect("/login", { headers });
}
