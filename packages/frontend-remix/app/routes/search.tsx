import type { LoaderFunctionArgs, MetaFunction } from "react-router";

import { SearchContainer } from "~/components/Search/SearchContainer";
import { getTokenFromRequest } from "~/lib/auth";
import { searchLoader } from "~/loaders/search";

export const meta: MetaFunction = () => {
  return [
    { title: "Search - MiiM CRM" },
    { name: "description", content: "Search through the MiiM CRM database." },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const token = getTokenFromRequest(request) ?? undefined;
  const url = new URL(request.url);
  const q = url.searchParams.get("q") || "";
  const results = q.trim() ? await searchLoader(q, token) : null;
  return { q, results };
}

export default function SearchPage() {
  return <SearchContainer />;
}
