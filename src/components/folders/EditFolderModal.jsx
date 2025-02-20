// src/components/folders/EditFolderModal.jsx
import React, { useState, useEffect } from "react";
import { useUpdateFolder } from "../../hooks/useFolders";
import Button from "../ui/Button";

export default function EditFolderModal({ folder, isOpen, onClose }) {
  const [folderName, setFolderName] = useState("");
  const [error, setError] = useState("");
  const updateFolder = useUpdateFolder();

  useEffect(() => {
    if (folder) {
      setFolderName(folder.name);
    }
  }, [folder]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!folderName.trim()) {
      setError("Folder name is required");
      return;
    }

    try {
      await updateFolder.mutateAsync({
        folderId: folder._id,
        data: { name: folderName.trim() },
      });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update folder");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Rename Folder</h2>

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
              placeholder="Folder name"
              autoFocus
            />
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" isLoading={updateFolder.isPending}>
              Save
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
