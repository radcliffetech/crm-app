// routes/instructors._index.tsx
import { InstructorsPageContainer } from "~/components/Instructor/InstructorsPageContainer";
import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Instructors - MiiM CRM" },
    {
      name: "description",
      content:
        "Manage instructor profiles and view their associated course information.",
    },
  ];
};

export default function InstructorsIndexPage() {
  return <InstructorsPageContainer />;
}
