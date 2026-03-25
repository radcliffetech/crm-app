import type { LoaderFunctionArgs, MetaFunction } from "react-router";

import { InstructorsPageContainer } from "~/components/Instructor/InstructorsPageContainer";
import { getAllInstructors } from "~/loaders/instructors";
import { getTokenFromRequest } from "~/lib/auth";
import { useLoaderData } from "react-router";

export const meta: MetaFunction = () => {
  return [
    { title: "Instructors - MiiM CRM" },
    {
      name: "description",
      content:
        "Manage instructor profiles and view their associated course information.",
    },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const token = getTokenFromRequest(request) ?? undefined;
  const instructors = await getAllInstructors(token);
  return { instructors };
}

export default function InstructorsIndexPage() {
  const loaderData = useLoaderData<typeof loader>();
  return <InstructorsPageContainer loaderData={loaderData} />;
}
