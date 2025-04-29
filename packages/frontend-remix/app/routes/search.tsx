import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";

import { SearchContainer } from "~/components/Search/SearchContainer";
import { json } from "@remix-run/node";
import { searchLoader } from "~/loaders/search";

export const meta: MetaFunction = () => {
  return [
    { title: "Search - MiiM CRM" },
    { name: "description", content: "Search through the MiiM CRM database." },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q") || "";
  const results = q.trim() ? await searchLoader(q) : null;
  return json({ q, results });
}

export default function SearchPage() {
  return <SearchContainer />;
}
