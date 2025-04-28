import { Link, isRouteErrorResponse, useRouteError } from "@remix-run/react";

export function CatchBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <h1 className="text-4xl font-bold mb-4">
          {error.status} - {error.statusText}
        </h1>
        <p className="mb-4">Sorry, we couldn't find the page you're looking for.</p>
        <Link to="/" className="btn-primary">
          Go back home
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h1 className="text-4xl font-bold mb-4">Unknown Error</h1>
      <p className="mb-4">Something went wrong.</p>
      <Link to="/" className="btn-primary">
        Go back home
      </Link>
    </div>
  );
}