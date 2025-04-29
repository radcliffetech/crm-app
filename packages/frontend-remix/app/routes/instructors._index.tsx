import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";

import { InstructorsPageContainer } from "~/components/Instructor/InstructorsPageContainer";
import { getAllInstructors } from "~/loaders/instructors";
// routes/instructors._index.tsx
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

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
  return json({ instructors });
}

export default function InstructorsIndexPage() {
  const loaderData = useLoaderData<typeof loader>();
  return <InstructorsPageContainer loaderData={loaderData} />;
}
