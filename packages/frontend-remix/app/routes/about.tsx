import type { MetaFunction } from "@remix-run/node";
import { PageFrame } from "~/components/ui/PageFrame";
import { PageHeader } from "~/components/ui/PageHeader";
import PageSubheader from "~/components/ui/PageSubheader";

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
      <PageSubheader>The Massachusetts Institute for Integrated Metaphysics</PageSubheader>
      <img src="images/logo.png" alt="MiiM Logo" className="h-64 mb-4 mx-auto" />
      <p className="text-lg text-gray-700 mb-8">
        MiiM is a fictional institute created for the purpose of this project, a mix of MIT, Miskatonic U, and Hogwarts. It serves as an abstact placeholder for a real-world organization.
      </p>
      <PageSubheader>About This Project</PageSubheader>
      <p className="text-lg text-gray-700">
        This is a sample Customer Relationship Management (CRM) application developed as part of a software engineering portfolio. It demonstrates full-stack development skills using TypeScript, React, Remix, and Firebase.
      </p>
    </PageFrame>

  );
}