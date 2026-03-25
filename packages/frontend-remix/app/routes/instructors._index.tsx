import type { LoaderFunctionArgs, MetaFunction } from "react-router";

import { InstructorsPageContainer } from "~/components/Instructor/InstructorsPageContainer";
import { getAllInstructors } from "~/loaders/instructors";
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

export async function loader(args: LoaderFunctionArgs) {
  const instructors = await getAllInstructors();
  return { instructors };
}

export default function InstructorsIndexPage() {
  const loaderData = useLoaderData<typeof loader>();
  return <InstructorsPageContainer loaderData={loaderData} />;
}
