import type { LoaderFunctionArgs, MetaFunction } from "react-router";

import { StudentDetailContainer } from "~/components/Student/StudentDetailContainer";
import { getStudentPageData } from "~/loaders/students";
import { getTokenFromRequest } from "~/lib/auth";
import { useLoaderData } from "react-router";

export const meta: MetaFunction = () => {
  return [
    {
      title: "Student Detail – MiiM CRM",
    },
    {
      name: "description",
      content: "View and manage student details, courses, and registration.",
    },
  ];
};

export async function loader({ params, request }: LoaderFunctionArgs) {
  if (!params.id) throw new Response("Missing student id", { status: 400 });
  const token = getTokenFromRequest(request) ?? undefined;
  const data = await getStudentPageData(params.id, token);

  if (!data.student) {
    throw new Response("Student not found", { status: 404 });
  }

  return data;
}

export default function StudentDetailPage() {
  const loaderData = useLoaderData<typeof loader>();
  return <StudentDetailContainer loaderData={loaderData} />;
}
