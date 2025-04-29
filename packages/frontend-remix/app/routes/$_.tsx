import { Link, isRouteErrorResponse, useRouteError } from "@remix-run/react";

import { PageFrame } from "~/components/Common/PageFrame";
import { PageHeader } from "~/components/Common/PageHeader";
import { PageSubheader } from "~/components/Common/PageSubheader";

export function CatchBoundary() {
  const error = useRouteError();

  return (
    <PageFrame>
      {isRouteErrorResponse(error) ? (
        <>
          <PageHeader>
            {error.status} - {error.statusText}
          </PageHeader>
          <PageSubheader>
            Sorry, we couldn't find the page you're looking for.
          </PageSubheader>
          <p className="text-lg text-gray-700 mb-8 text-center">
            It may have been moved or deleted. Try navigating back home.
          </p>
        </>
      ) : (
        <>
          <PageHeader>Unknown Error</PageHeader>
          <PageSubheader>Something went wrong.</PageSubheader>
          <p className="text-lg text-gray-700 mb-8 text-center">
            Try refreshing the page or going back home.
          </p>
        </>
      )}
      <div className="flex justify-center">
        <Link to="/" className="btn-primary">
          Go back home
        </Link>
      </div>
    </PageFrame>
  );
}
