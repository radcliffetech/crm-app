import { DashboardContainer } from "~/components/Dashboard/DashboardContainer";
import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "MiiM CRM" },
    { name: "description", content: "Sample CRM Dashboard" },
  ];
};

export default function IndexPage() {
  return <DashboardContainer />;
}
