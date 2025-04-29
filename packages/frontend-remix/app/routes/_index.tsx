import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";

import { DashboardContainer } from "~/components/Dashboard/DashboardContainer";
import { getDashboardData } from "~/loaders/dashboard";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "MiiM CRM" },
    { name: "description", content: "Sample CRM Dashboard" },
  ];
};

export async function loader(args: LoaderFunctionArgs) {
  const data = await getDashboardData();
  return json(data);
}

export default function IndexPage() {
  const loaderData = useLoaderData<typeof loader>();
  return <DashboardContainer loaderData={loaderData} />;
}
