// src/components/layout/Sidebar.jsx - Update for better mobile experience
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Folder, FolderPlus, Image, Upload, Home } from "lucide-react";
import { useFolders } from "../../hooks/useFolders";

export default function Sidebar({ onItemClick = () => {} }) {
  const location = useLocation();
  const { data: rootFolders = [], isLoading } = useFolders();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="w-full h-full overflow-y-auto py-4 px-3">
      <div className="mb-6">
        <Link
          to="/dashboard"
          className={`flex items-center p-2 rounded-md w-full ${
            isActive("/dashboard")
              ? "bg-blue-50 text-blue-700"
              : "text-gray-700 hover:bg-gray-100"
          }`}
          onClick={onItemClick}
        >
          <Home className="mr-2 h-5 w-5" />
          <span>Dashboard</span>
        </Link>
      </div>

      <div className="mb-4">
        <h3 className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Root Folders
        </h3>

        <div className="mt-2 space-y-1">
          {isLoading ? (
            <div className="p-2 text-sm text-gray-500">Loading folders...</div>
          ) : rootFolders.length === 0 ? (
            <div className="p-2 text-sm text-gray-500">
              No folders created yet
            </div>
          ) : (
            rootFolders.map((folder) => (
              <Link
                key={folder._id}
                to={`/folder/${folder._id}`}
                className={`flex items-center p-2 rounded-md text-sm ${
                  isActive(`/folder/${folder._id}`)
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={onItemClick}
              >
                <Folder className="mr-2 h-4 w-4" />
                <span className="truncate">{folder.name}</span>
              </Link>
            ))
          )}
        </div>
      </div>

      <div className="mt-6 space-y-2">
        <Link
          to="/dashboard"
          className="flex items-center p-2 rounded-md w-full text-gray-700 hover:bg-gray-100"
          onClick={onItemClick}
        >
          <FolderPlus className="mr-2 h-5 w-5" />
          <span>New Folder</span>
        </Link>

        <Link
          to={
            location.pathname.includes("/folder/")
              ? location.pathname
              : "/dashboard"
          }
          className="flex items-center p-2 rounded-md w-full text-gray-700 hover:bg-gray-100"
          onClick={() => {
            onItemClick();
            // If we're in a folder, trigger upload in that folder
            if (location.pathname.includes("/folder/")) {
              // You could emit an event or use context to trigger upload modal
            }
          }}
        >
          <Upload className="mr-2 h-5 w-5" />
          <span>Upload Image</span>
        </Link>
      </div>
    </div>
  );
}
