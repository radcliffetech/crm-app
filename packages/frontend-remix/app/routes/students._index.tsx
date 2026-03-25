import type { LoaderFunctionArgs, MetaFunction } from "react-router";

import { StudentsPageContainer } from "~/components/Student/StudentsPageContainer";
import { getAllStudents } from "~/loaders/students";
import { getTokenFromRequest } from "~/lib/auth";
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

export async function loader({ request }: LoaderFunctionArgs) {
  const token = getTokenFromRequest(request) ?? undefined;
  const students = await getAllStudents(token);
  return { students };
}

export default function StudentsIndexPage() {
  const loaderData = useLoaderData<typeof loader>();
  return <StudentsPageContainer loaderData={loaderData} />;
}
