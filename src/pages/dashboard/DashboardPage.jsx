// src/pages/dashboard/DashboardPage.jsx
import React, { useState } from "react";
import AppLayout from "../../components/layout/AppLayout";
import FolderList from "../../components/folders/FolderList";
import CreateFolderButton from "../../components/folders/CreateFolderButton";
import EditFolderModal from "../../components/folders/EditFolderModal";
import { useFolders } from "../../hooks/useFolders";
import { Folder, Loader } from "lucide-react";

export default function DashboardPage() {
  const { data: rootFolders = [], isLoading, error } = useFolders();
  const [editFolder, setEditFolder] = useState(null);

  const handleEditFolder = (folder) => {
    setEditFolder(folder);
  };

  const handleCloseEditModal = () => {
    setEditFolder(null);
  };

  return (
    <AppLayout>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">My Files</h1>
        <CreateFolderButton />
      </div>

      {isLoading ? (
        <div className="py-20 text-center">
          <Loader className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-600">Loading your files...</p>
        </div>
      ) : error ? (
        <div className="py-20 text-center">
          <div className="bg-red-100 p-4 rounded-lg inline-block mb-4">
            <span className="text-red-600">Failed to load folders</span>
          </div>
          <p className="text-gray-600">{error.message}</p>
        </div>
      ) : rootFolders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Folder className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-xl font-medium text-gray-800 mb-2">
            No folders yet
          </h2>
          <p className="text-gray-600 mb-6">
            Create your first folder to start organizing your images
          </p>
          <CreateFolderButton />
        </div>
      ) : (
        <section>
          <h2 className="text-lg font-medium text-gray-800 mb-4">
            Root Folders
          </h2>
          <FolderList folders={rootFolders} onEditFolder={handleEditFolder} />
        </section>
      )}

      <EditFolderModal
        folder={editFolder}
        isOpen={!!editFolder}
        onClose={handleCloseEditModal}
      />
    </AppLayout>
  );
}
