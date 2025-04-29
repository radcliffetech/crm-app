import type { MetaFunction } from "@remix-run/node";
import { PageFrame } from "~/components/Common/PageFrame";
import { PageHeader } from "~/components/Common/PageHeader";

export const meta: MetaFunction = () => {
  return [
    { title: "Settings - MiiM CRM" },
    {
      name: "description",
      content:
        "Manage your personal settings and preferences in the MiiM CRM system.",
    },
  ];
};

export default function SettingsPage() {
  return (
    <PageFrame>
      <PageHeader>Settings</PageHeader>
      <p className="text-lg">Welcome!</p>
    </PageFrame>
  );
}
