// components/Search/SearchContainer.tsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "@remix-run/react";

import { PageFrame } from "~/components/Common/PageFrame";
import { PageHeader } from "~/components/Common/PageHeader";
import { PageSubheader } from "~/components/Common/PageSubheader";
import { SearchResultsList } from "~/components/Student/SearchResultsList";
import { searchLoader } from "~/loaders/search";

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
  onSubmit,
  loading,
}: {
  query: string;
  setQuery: (value: string) => void;
  onSubmit: () => void;
  loading: boolean;
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
        disabled={loading}
        className="px-4 py-2 btn-primary rounded-r-lg border border-blue-600 disabled:opacity-50"
      >
        {loading ? "Searching..." : "Search"}
      </button>
    </div>
  );
}

export function SearchContainer() {
  const location = useLocation();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<
    { type: string; label: string; link: string }[] | null
  >(null);
  const [loading, setLoading] = useState(false);

  async function fetchResults() {
    if (query.trim() === "") {
      setResults(null);
      return;
    }
    setLoading(true);
    const data = await searchLoader(query);
    setResults(data);
    setLoading(false);
  }

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("q");
    if (q) {
      setQuery(q);
      fetchResults();
    }
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchResults();
      navigate(`/search?q=${encodeURIComponent(query.trim())}`, {
        replace: true,
      });
    }, 500);

    return () => clearTimeout(handler);
  }, [query]);

  return (
    <PageFrame>
      <PageHeader>Search</PageHeader>
      <PageSubheader>
        Find students, instructors, courses, and registrations.
      </PageSubheader>
      <SearchForm
        query={query}
        setQuery={setQuery}
        onSubmit={fetchResults}
        loading={loading}
      />
      <SearchResults loading={loading} results={results} />
    </PageFrame>
  );
}
