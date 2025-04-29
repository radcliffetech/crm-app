import type { MetaFunction } from "@remix-run/node";
// routes/students._index.tsx
import { StudentsPageContainer } from "~/components/Student/StudentsPageContainer";

export const meta: MetaFunction = () => {
  return [
    { title: "Students - MiiM CRM" },
    {
      name: "description",
      content: "Manage and view student records in the MiiM CRM platform.",
    },
  ];
};

export default function StudentsIndexPage() {
  return <StudentsPageContainer />;
}
