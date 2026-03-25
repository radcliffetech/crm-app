import type { LoaderFunctionArgs, MetaFunction } from "react-router";

import { CourseDetailContainer } from "~/components/Course/CourseDetailContainer";
import { getCoursePageData } from "~/loaders/courses";
import { useLoaderData } from "react-router";

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
  return data;
}

export default function CourseDetailPage() {
  const loaderData = useLoaderData<typeof loader>();
  return <CourseDetailContainer loaderData={loaderData} />;
}
