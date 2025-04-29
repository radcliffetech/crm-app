import { InstructorDetailContainer } from "~/components/Instructor/InstructorDetailContainer";
import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: `Instructor Detail – MiiM CRM` },
    {
      name: "description",
      content: "View instructor profile, biography, and course assignments.",
    },
  ];
};

export default function InstructorDetailPage() {
  return <InstructorDetailContainer />;
}
