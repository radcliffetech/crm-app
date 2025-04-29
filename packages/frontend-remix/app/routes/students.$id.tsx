import type { MetaFunction } from "@remix-run/node";
import { StudentDetailContainer } from "~/components/Student/StudentDetailContainer";

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

export default function StudentDetailPage() {
  return <StudentDetailContainer />;
}
