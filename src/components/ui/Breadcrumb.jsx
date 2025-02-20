// src/components/ui/Breadcrumb.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight, Home, FolderOpen, MoreHorizontal } from "lucide-react";

export default function Breadcrumb({ items = [], currentFolder }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const navigate = useNavigate();

  // Track window resize for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Show all items on larger screens, truncate on mobile
  const visibleItems =
    isMobile && items.length > 2 ? [items[0], ...items.slice(-1)] : items;

  // Handle dropdown item click
  const handleDropdownItemClick = (path) => {
    setShowDropdown(false);
    navigate(path);
  };

  return (
    <nav className="flex items-center flex-wrap text-sm mb-4">
      {/* Home link */}
      <Link
        to="/dashboard"
        className="flex items-center text-gray-600 hover:text-blue-600"
      >
        <Home className="h-4 w-4" />
        <span className="ml-1 mr-1 hidden sm:inline">Home</span>
      </Link>

      {/* Hidden folders dropdown for mobile */}
      {isMobile && items.length > 2 && (
        <div className="relative">
          <button
            className="flex items-center mx-1 px-1 text-gray-600 hover:text-blue-600"
            onClick={() => setShowDropdown(!showDropdown)}
            aria-label="More folders"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>

          {showDropdown && (
            <div className="absolute top-full left-0 mt-1 bg-white shadow-lg rounded-md py-1 z-20 w-48">
              {items.slice(1, -1).map((item, idx) => (
                <button
                  key={idx}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                  onClick={() => handleDropdownItemClick(item.path)}
                >
                  <FolderOpen className="h-3 w-3 mr-2 text-gray-500" />
                  <span className="truncate">{item.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Visible breadcrumb items */}
      {visibleItems.map((item, idx) => (
        <React.Fragment key={idx}>
          <ChevronRight className="h-4 w-4 mx-1 text-gray-400 flex-shrink-0" />

          {idx === visibleItems.length - 1 ? (
            <span className="font-medium text-gray-800 truncate">
              {item.name}
            </span>
          ) : (
            <Link
              to={item.path}
              className="text-gray-600 hover:text-blue-600 truncate"
            >
              {item.name}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
