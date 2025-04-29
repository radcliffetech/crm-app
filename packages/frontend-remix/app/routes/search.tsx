import type { MetaFunction } from "@remix-run/node";
import { SearchContainer } from "~/components/Search/SearchContainer";

export const meta: MetaFunction = () => {
  return [
    { title: "Search - MiiM CRM" },
    { name: "description", content: "Search through the MiiM CRM database." },
  ];
};

export default function SearchPage() {
  return <SearchContainer />;
}
