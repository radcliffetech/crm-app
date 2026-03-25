import type { LoaderFunctionArgs, MetaFunction } from "react-router";

import { DashboardContainer } from "~/components/Dashboard/DashboardContainer";
import { getDashboardData } from "~/loaders/dashboard";
import { useLoaderData } from "react-router";

export const meta: MetaFunction = () => {
  return [
    { title: "MiiM CRM" },
    { name: "description", content: "Sample CRM Dashboard" },
  ];
};

export async function loader(args: LoaderFunctionArgs) {
  const data = await getDashboardData();
  return data;
}

export default function IndexPage() {
  const loaderData = useLoaderData<typeof loader>();
  return <DashboardContainer loaderData={loaderData} />;
}
