import { CourseDetailContainer } from "~/components/Course/CourseDetailContainer";
import type { MetaFunction } from "@remix-run/node";

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

export default function CourseDetailPage() {
  return <CourseDetailContainer />;
}
