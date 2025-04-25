import { ArrowRightEndOnRectangleIcon, Cog6ToothIcon, HomeIcon, InformationCircleIcon } from "@heroicons/react/24/solid";
import { Link, useLocation } from "@remix-run/react";
import { User, UserRole } from "~/types";
import { useEffect, useRef, useState } from "react";

export function Navbar({
  user,
  handleLogout,
}: {
  user: User,
  handleLogin: () => void;
  handleLogout: () => void;
  switchRole: (newRole: UserRole) => void;
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    const params = new URLSearchParams(location.search);
    const q = params.get("q");
    if (q) {
      setSearchQuery(q);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [location]);
  return (
    <div>
      <nav className="flex justify-between items-center p-4 text-white mb-0" style={{ backgroundColor: "rgb(33, 74, 55)" }}>
        <div className="flex items-center gap-4">
          <Link to="/" className="text-xl font-semibold flex items-center gap-2">
            <HomeIcon className="h-6 w-6 text-white" />
            MiiM
          </Link>
          {user && (
            <>
              <Link to="/students" className="text-lg hover:underline">
                Students
              </Link>
              <Link to="/courses" className="text-lg hover:underline">
                Courses
              </Link>
              <Link to="/instructors" className="text-lg hover:underline">
                Instructors
              </Link>
            </>
          )}
        </div>
        {user ? (
          <>
          <div className="relative" ref={dropdownRef}>
            <button
              className="flex items-center gap-2 focus:outline-none"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
                    <span className="text-sm text-gray-200">{user.name}</span>
              <svg className="w-4 h-4 text-gray-200 hover:text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5.23 7.21a.75.75 0 011.06.02L10 11.293l3.71-4.06a.75.75 0 111.1 1.02l-4.25 4.65a.75.75 0 01-1.1 0l-4.25-4.65a.75.75 0 01.02-1.06z" />
              </svg>
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10">
                <Link
                  to="/about"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <InformationCircleIcon className="h-4 w-4" />
                  About
                </Link>
                <div className="border-t my-1" />
                <Link
                  to="/settings"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Cog6ToothIcon className="h-4 w-4" />
                  Settings
                </Link>
                <button
                  onClick={() => {
                    if (window.confirm("Are you sure you want to log out?")) {
                      setDropdownOpen(false);
                      handleLogout();
                    }
                  }}
                  className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <ArrowRightEndOnRectangleIcon className="h-4 w-4" />
                  Log Out
                </button>
              </div>
                     
            )}
          </div>
          </>
        ) : (
  <>  </>  
        )}
      </nav>
      {user && location.pathname !== "/search" && (
        <div className="flex justify-end px-4 py-2 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (searchQuery.trim()) {
                window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
              }
            }}
            className="flex"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="px-2 py-1 rounded-l-md border border-gray-300"
            />
            <button
              type="submit"
              className="px-3 py-1 btn-primary rounded-r-md border border-blue-600"
            >
              Go
            </button>
          </form>
        </div>
      )}
    </div>
  );
}