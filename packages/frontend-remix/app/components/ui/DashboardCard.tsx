import { Link } from "@remix-run/react";

export function DashboardCard({
    title,
    count,
    link,
    linkText,
}: {
    title: string;
    count: number;
    link: string;
    linkText: string;
}) {
    return (
        <div className="bg-gray-50 shadow rounded-lg p-6 h-full flex flex-col">
            <h2 className="text-xl font-semibold mb-2">{title}</h2>
            <p className="text-3xl font-bold">{count}</p>
            <Link to={link} className="text-blue-600 hover:underline mt-auto pt-4 block">
                {linkText}
            </Link>
        </div>
    );
}