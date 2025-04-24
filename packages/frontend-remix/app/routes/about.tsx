import type { MetaFunction } from "@remix-run/node";
import { PageFrame } from "~/components/ui/PageFrame";
import { PageHeader } from "~/components/ui/PageHeader";

export const meta: MetaFunction = () => {
  return [
    { title: "About - MiiM CRM" },
    { name: "description", content: "Learn more about the MiiM CRM project and its fictional academic roots." },
  ];
};

export default function AboutPage() {
  return (
    <PageFrame>
      <PageHeader>About</PageHeader>
      <h1 className="text-xl font-semibold text-gray-900 mb-6">
        The Massachusetts Institute for Integrated Metaphysics
      </h1>
      <img src="images/logo.png" alt="MiiM Logo" className="h-64 mb-4 mx-auto" />
      <p className="text-lg text-gray-700 mb-8">
        MiiM is a fictional institute created for the purpose of this project, a mix of MIT, Miskatonic U, and Hogwarts. It serves as an abstact placeholder for a real-world organization.
      </p>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        This Project
      </h2>
      <p className="text-lg text-gray-700">
        This is a sample Customer Relationship Management (CRM) application developed as part of a software engineering portfolio. It demonstrates full-stack development skills using TypeScript, React, Remix, and Firebase.
      </p>
    </PageFrame>

  );
}