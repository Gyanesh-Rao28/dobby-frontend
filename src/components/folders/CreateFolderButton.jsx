// src/components/folders/CreateFolderButton.jsx
import React, { useState } from "react";
import { FolderPlus } from "lucide-react";
import { useCreateFolder } from "../../hooks/useFolders";
import Button from "../ui/Button";

export default function CreateFolderButton({ parentId = null }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [error, setError] = useState("");
  const createFolder = useCreateFolder();

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setFolderName("");
    setError("");
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!folderName.trim()) {
      setError("Folder name is required");
      return;
    }

    try {
      await createFolder.mutateAsync({
        name: folderName.trim(),
        parentId: parentId,
      });
      handleCloseModal();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create folder");
    }
  };

  return (
    <>
      <Button onClick={handleOpenModal} variant="outline" size="sm">
        <FolderPlus className="h-4 w-4 mr-1" />
        New Folder
      </Button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Create New Folder</h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="folderName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Folder Name
                </label>
                <input
                  id="folderName"
                  type="text"
                  value={folderName}
                  onChange={(e) => {
                    setFolderName(e.target.value);
                    setError("");
                  }}
                  className={`w-full px-3 py-2 border rounded-md ${
                    error ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="My Folder"
                  autoFocus
                />
                {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleCloseModal}
                >
                  Cancel
                </Button>
                <Button type="submit" isLoading={createFolder.isPending}>
                  Create
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
