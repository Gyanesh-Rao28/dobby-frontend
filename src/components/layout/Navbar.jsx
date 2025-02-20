// src/components/layout/Navbar.jsx - Update for mobile
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Search, Folder, LogOut, User, Menu } from "lucide-react";

export default function Navbar({ onMenuClick }) {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearch(false);
    }
  };

  return (
    <nav className="bg-white shadow fixed top-0 inset-x-0 z-40">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Left side - Logo and menu button */}
          <div className="flex items-center">
            {/* Mobile menu button */}
            <button
              className="mr-2 p-2 rounded-md text-gray-500 lg:hidden"
              onClick={onMenuClick}
              aria-label="Toggle menu"
            >
              <Menu className="h-6 w-6" />
            </button>

        
            <div
              className="flex-shrink-0 flex items-center cursor-pointer"
              onClick={() => navigate("/dashboard")}
            >
              <Folder className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-semibold hidden sm:block">
                DobbyAds
              </span>
            </div>
          </div>

          {showSearch ? (
            <div className="absolute inset-x-0 top-0 bg-white h-16 flex items-center px-4 z-50">
              <form onSubmit={handleSearch} className="w-full flex">
                <div className="relative flex-1">
                  <input
                    id="search"
                    name="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Search images..."
                    type="search"
                    autoFocus
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
                <button
                  type="button"
                  className="ml-2 text-gray-500"
                  onClick={() => setShowSearch(false)}
                >
                  Cancel
                </button>
              </form>
            </div>
          ) : (
            <>
              {/* Search icon for mobile */}
              <div className="flex sm:hidden items-center">
                <button
                  onClick={() => setShowSearch(true)}
                  className="p-2 text-gray-500"
                  aria-label="Search"
                >
                  <Search className="h-5 w-5" />
                </button>
              </div>

              {/* Normal search bar for desktop */}
              <div className="hidden sm:flex flex-1 items-center justify-center px-2 lg:ml-6 lg:justify-end">
                <form onSubmit={handleSearch} className="max-w-lg w-full">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="search-desktop"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Search images..."
                      type="search"
                    />
                  </div>
                </form>
              </div>
            </>
          )}

          {/* User menu and logout */}
          <div className="flex items-center">
            <div className="ml-3 relative">
              <div className="flex items-center">
                <span className="hidden md:block mr-3 text-sm font-medium text-gray-700">
                  {currentUser?.username}
                </span>
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <User className="h-5 w-5 text-blue-700" />
                </div>
                <button
                  onClick={logout}
                  className="ml-4 p-1 border-2 border-transparent text-gray-500 rounded-full hover:text-red-600 focus:outline-none"
                  title="Sign out"
                >
                  <LogOut className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
