import type { LoaderFunctionArgs, MetaFunction } from "react-router";

import { StudentsPageContainer } from "~/components/Student/StudentsPageContainer";
import { getAllStudents } from "~/loaders/students";
import { useLoaderData } from "react-router";

export const meta: MetaFunction = () => {
  return [
    { title: "Students - MiiM CRM" },
    {
      name: "description",
      content: "Manage and view student records in the MiiM CRM platform.",
    },
  ];
};

export async function loader(args: LoaderFunctionArgs) {
  const students = await getAllStudents();
  return { students };
}

export default function StudentsIndexPage() {
  const loaderData = useLoaderData<typeof loader>();
  return <StudentsPageContainer loaderData={loaderData} />;
}
