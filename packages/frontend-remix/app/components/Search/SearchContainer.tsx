import { useEffect, useState } from "react";
import { useFetcher, useLoaderData } from "@remix-run/react";

import { PageFrame } from "~/components/Common/PageFrame";
import { PageHeader } from "~/components/Common/PageHeader";
import { PageSubheader } from "~/components/Common/PageSubheader";
import { SearchResultsList } from "~/components/Search/SearchResultsList";

function SearchResults({
  loading,
  results,
}: {
  loading: boolean;
  results: { type: string; label: string; link: string }[] | null;
}) {
  const flatResults = results ?? [];

  return (
    <div className="mt-8">
      {loading && (
        <p className="text-gray-500 italic animate-pulse">
          Looking for matches...
        </p>
      )}
      {!loading && results && (
        <div>
          {flatResults.length === 0 ? (
            <p className="text-gray-500">No results found.</p>
          ) : (
            <>
              <p className="text-sm text-gray-600 mb-2">
                {flatResults.length} results found
              </p>
              <SearchResultsList results={flatResults} />
            </>
          )}
        </div>
      )}
      {!loading && !results && (
        <p className="text-gray-500 italic">
          Try searching for a student's name, an instructor, or a course title.
        </p>
      )}
    </div>
  );
}

function SearchForm({
  query,
  setQuery,
  loading,
  onSubmit,
}: {
  query: string;
  setQuery: (value: string) => void;
  loading: boolean;
  onSubmit: () => void;
}) {
  return (
    <div className="my-4 flex">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
        className="w-full border border-r-0 px-4 py-2 rounded-l-lg"
        autoFocus
      />
      <button
        onClick={onSubmit}
        disabled={loading || query.trim() === ""}
        className="px-4 py-2 btn-primary rounded-r-lg border border-blue-600 disabled:opacity-50"
      >
        {loading ? "Searching..." : "Search"}
      </button>
    </div>
  );
}

type LoaderData = {
  q: string;
  results: { type: string; label: string; link: string }[] | null;
};

export function SearchContainer() {
  const initialData = useLoaderData<LoaderData>();
  const fetcher = useFetcher();
  const [query, setQuery] = useState(initialData.q);
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  const data = fetcher.data as LoaderData | undefined;
  const loading = fetcher.state !== "idle";
  const results = data?.results ?? initialData.results;

  // Debounce query typing
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 400);
    return () => clearTimeout(timeout);
  }, [query]);

  // Fetch on debounced input change
  useEffect(() => {
    if (debouncedQuery !== "") {
      fetcher.load(`/search?q=${encodeURIComponent(debouncedQuery)}`);
    }
  }, [debouncedQuery]);

  function handleManualSubmit() {
    if (query.trim() !== "") {
      fetcher.load(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  }

  return (
    <PageFrame>
      <PageHeader>Search</PageHeader>
      <PageSubheader>
        Find students, instructors, courses, and registrations.
      </PageSubheader>

      <SearchForm
        query={query}
        setQuery={setQuery}
        loading={loading}
        onSubmit={handleManualSubmit}
      />

      <SearchResults loading={loading} results={results} />
    </PageFrame>
  );
}
