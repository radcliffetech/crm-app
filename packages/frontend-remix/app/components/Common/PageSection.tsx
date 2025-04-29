import { PageSubheader } from "./PageSubheader";

export function PageSection({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`my-4 border border-gray-300 rounded p-4 ${className}`}>
      <PageSubheader>{title}</PageSubheader>
      {children}
    </div>
  );
}
