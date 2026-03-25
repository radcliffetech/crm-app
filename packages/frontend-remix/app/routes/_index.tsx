import type { LoaderFunctionArgs, MetaFunction } from "react-router";

import { DashboardContainer } from "~/components/Dashboard/DashboardContainer";
import { getDashboardData } from "~/loaders/dashboard";
import { getTokenFromRequest } from "~/lib/auth";
import { useLoaderData } from "react-router";

export const meta: MetaFunction = () => {
  return [
    { title: "MiiM CRM" },
    { name: "description", content: "Sample CRM Dashboard" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const token = getTokenFromRequest(request) ?? undefined;
  const data = await getDashboardData(token);
  return data;
}

export default function IndexPage() {
  const loaderData = useLoaderData<typeof loader>();
  return <DashboardContainer loaderData={loaderData} />;
}
