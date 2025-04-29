import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";

import { StudentDetailContainer } from "~/components/Student/StudentDetailContainer";
import { getStudentPageData } from "~/loaders/students";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

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

export async function loader({ params }: LoaderFunctionArgs) {
  if (!params.id) throw new Response("Missing student id", { status: 400 });

  const data = await getStudentPageData(params.id);

  if (!data.student) {
    throw new Response("Student not found", { status: 404 });
  }

  return json(data);
}

export default function StudentDetailPage() {
  const loaderData = useLoaderData<typeof loader>();
  return <StudentDetailContainer loaderData={loaderData} />;
}
