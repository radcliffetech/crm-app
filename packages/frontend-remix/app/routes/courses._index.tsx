import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";

import { CoursesPageContainer } from "~/components/Course/CoursesPageContainer";
import { getCoursesPageData } from "~/loaders/courses";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Courses - MiiM CRM" },
    {
      name: "description",
      content: "Browse and manage courses in the MiiM CRM application.",
    },
  ];
};

export async function loader(args: LoaderFunctionArgs) {
  const { courses, instructors } = await getCoursesPageData();
  return json({ courses, instructors });
}

export default function CoursesPage() {
  const loaderData = useLoaderData<typeof loader>();
  return <CoursesPageContainer loaderData={loaderData} />;
}
