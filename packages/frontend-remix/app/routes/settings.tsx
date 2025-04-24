import { useEffect, useState } from "react";

import type { MetaFunction } from "@remix-run/node";
import { PageFrame } from "~/components/ui/PageFrame";
import { PageHeader } from "~/components/ui/PageHeader";

export const meta: MetaFunction = () => {
  return [
    { title: "Settings - MiiM CRM" },
    { name: "description", content: "Manage your personal settings and preferences in the MiiM CRM system." },
  ];
};


export default function SettingsPage() {
  const [userName, setUserName] = useState<string | null>(null);


  return (
    <PageFrame>
      <PageHeader>Settings</PageHeader>
      <p className="text-lg">Welcome!</p>
    </PageFrame>
  );
}