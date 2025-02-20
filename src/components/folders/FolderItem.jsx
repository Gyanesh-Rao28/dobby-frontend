// src/components/folders/FolderItem.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Folder, MoreVertical, Edit, Trash2 } from "lucide-react";
import { useDeleteFolder } from "../../hooks/useFolders";

export default function FolderItem({ folder, onEdit }) {
  const navigate = useNavigate();
  const [showOptions, setShowOptions] = useState(false);
  const deleteFolder = useDeleteFolder();

  const handleClick = (e) => {
    navigate(`/folder/${folder._id}`);
  };

  const handleOptionsClick = (e) => {
    e.stopPropagation();
    setShowOptions(!showOptions);
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    setShowOptions(false);
    onEdit(folder);
  };

  const handleDeleteClick = async (e) => {
    e.stopPropagation();
    if (
      confirm(
        `Are you sure you want to delete "${folder.name}"? This will delete all contents inside.`
      )
    ) {
      try {
        await deleteFolder.mutateAsync(folder._id);
      } catch (error) {
        console.error("Failed to delete folder:", error);
      }
    }
    setShowOptions(false);
  };

  return (
    <div
      className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow relative"
      onClick={handleClick}
    >
      <div className="h-32 bg-blue-50 flex items-center justify-center">
        <Folder className="h-16 w-16 text-blue-500" />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-gray-800 truncate pr-6">
            {folder.name}
          </h3>
          <button
            className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100"
            onClick={handleOptionsClick}
          >
            <MoreVertical className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          {new Date(folder.createdAt).toLocaleDateString()}
        </p>
      </div>

      {showOptions && (
        <div className="absolute top-10 right-2 bg-white shadow-lg rounded-md py-1 z-10">
          <button
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={handleEditClick}
          >
            <Edit className="h-4 w-4 mr-2" />
            Rename
          </button>
          <button
            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            onClick={handleDeleteClick}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
