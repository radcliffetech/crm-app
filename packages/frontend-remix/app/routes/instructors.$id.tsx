import type { LoaderFunctionArgs, MetaFunction } from "react-router";

import { InstructorDetailContainer } from "~/components/Instructor/InstructorDetailContainer";
import { getInstructorPageData } from "~/loaders/instructors";
import { getTokenFromRequest } from "~/lib/auth";
import { useLoaderData } from "react-router";

export const meta: MetaFunction = ({ params }) => {
  return [
    { title: `Instructor: ${params.id} – MiiM CRM` },
    {
      name: "description",
      content: "View instructor profile, biography, and course assignments.",
    },
  ];
};

export async function loader({ params, request }: LoaderFunctionArgs) {
  if (!params.id) throw new Response("Missing instructor id", { status: 400 });
  const token = getTokenFromRequest(request) ?? undefined;
  const data = await getInstructorPageData(params.id, token);
  return data;
}

export default function InstructorDetailPage() {
  const loaderData = useLoaderData<typeof loader>();
  return <InstructorDetailContainer loaderData={loaderData} />;
}
