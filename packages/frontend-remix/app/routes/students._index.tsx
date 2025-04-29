import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";

import { StudentsPageContainer } from "~/components/Student/StudentsPageContainer";
import { getAllStudents } from "~/loaders/students";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

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
  return json({ students });
}

export default function StudentsIndexPage() {
  const loaderData = useLoaderData<typeof loader>();
  return <StudentsPageContainer loaderData={loaderData} />;
}
