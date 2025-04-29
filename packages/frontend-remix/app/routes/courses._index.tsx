import { CoursesPageContainer } from "~/components/Course/CoursesPageContainer";
import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Courses - MiiM CRM" },
    {
      name: "description",
      content: "Browse and manage courses in the MiiM CRM application.",
    },
  ];
};

export default function CoursesPage() {
  return <CoursesPageContainer />;
}
