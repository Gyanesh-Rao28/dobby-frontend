// src/components/folders/FolderList.jsx
import React from "react";
import FolderItem from "./FolderItem";

export default function FolderList({ folders, onEditFolder }) {
  if (!folders || folders.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">No folders found.</div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {folders.map((folder) => (
        <FolderItem key={folder._id} folder={folder} onEdit={onEditFolder} />
      ))}
    </div>
  );
}
