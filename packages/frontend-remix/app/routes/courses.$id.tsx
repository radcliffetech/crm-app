import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";

import { CourseDetailContainer } from "~/components/Course/CourseDetailContainer";
import { getCoursePageData } from "~/loaders/courses";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const meta: MetaFunction = ({ params }) => {
  return [
    { title: `Course: ${params.id} – MiiM CRM` },
    {
      name: "description",
      content:
        "View course details, instructor info, and student registration.",
    },
  ];
};

export async function loader({ params }: LoaderFunctionArgs) {
  if (!params.id) throw new Response("Missing course id", { status: 400 });
  const data = await getCoursePageData(params.id);
  return json(data);
}

export default function CourseDetailPage() {
  const loaderData = useLoaderData<typeof loader>();
  return <CourseDetailContainer loaderData={loaderData} />;
}
