// src/pages/folders/FolderPage.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Upload, ArrowLeft, Loader, Menu, X, FolderPlus } from "lucide-react";
import AppLayout from "../../components/layout/AppLayout";
import Button from "../../components/ui/Button";
import FolderList from "../../components/folders/FolderList";
import CreateFolderButton from "../../components/folders/CreateFolderButton";
import EditFolderModal from "../../components/folders/EditFolderModal";
import ImageList from "../../components/images/ImageList";
import ImageUploadModal from "../../components/images/ImageUpload";
import Breadcrumb from "../../components/ui/Breadcrumb";
import { useFolderContent, useFolderPath } from "../../hooks/useFolders";

export default function FolderPage() {
  const { folderId } = useParams();
  const navigate = useNavigate();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Fetch folder data
  const {
    data,
    isLoading: contentLoading,
    error: contentError,
  } = useFolderContent(folderId);

  // Fetch breadcrumb path
  const { data: pathData, isLoading: pathLoading } = useFolderPath(folderId);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editFolder, setEditFolder] = useState(null);

  const handleEditFolder = (folder) => {
    setEditFolder(folder);
  };

  const handleCloseEditModal = () => {
    setEditFolder(null);
  };

  // Prepare breadcrumb items
  const breadcrumbItems =
    pathData?.map((folder) => ({
      name: folder.name,
      path: `/folder/${folder._id}`,
    })) || [];

  if (contentLoading || pathLoading) {
    return (
      <AppLayout>
        <div className="py-20 text-center">
          <Loader className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-600">Loading folder contents...</p>
        </div>
      </AppLayout>
    );
  }

  if (contentError) {
    return (
      <AppLayout>
        <div className="py-20 text-center">
          <div className="bg-red-100 p-4 rounded-lg mb-4 inline-block">
            <span className="text-red-600">Error loading folder</span>
          </div>
          <p className="text-gray-600 mb-4">{contentError.message}</p>
          <Button variant="secondary" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Dashboard
          </Button>
        </div>
      </AppLayout>
    );
  }

  const { currentFolder, subfolders, images } = data || {
    currentFolder: {},
    subfolders: [],
    images: [],
  };

  return (
    <AppLayout>
      <div className="mb-6">
        {/* Breadcrumb navigation */}
        <Breadcrumb
          items={breadcrumbItems}
          currentFolder={currentFolder.name}
        />

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-800 truncate">
            {currentFolder.name}
          </h1>

          {/* Mobile action button */}
          <div className="block sm:hidden">
            <Button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              size="sm"
              className="w-full"
            >
              {showMobileMenu ? (
                <X className="h-4 w-4 mr-1" />
              ) : (
                <Menu className="h-4 w-4 mr-1" />
              )}
              {showMobileMenu ? "Close" : "Actions"}
            </Button>
          </div>

          {/* Mobile menu */}
          {showMobileMenu && (
            <div className="flex flex-col gap-2 mt-2 sm:hidden">
              <CreateFolderButton
                parentId={folderId}
                className="w-full justify-center"
              />
              <Button
                onClick={() => {
                  setShowUploadModal(true);
                  setShowMobileMenu(false);
                }}
                className="w-full justify-center"
              >
                <Upload className="h-4 w-4 mr-1" />
                Upload Image
              </Button>
            </div>
          )}

          {/* Desktop action buttons */}
          <div className="hidden sm:flex sm:space-x-2">
            <CreateFolderButton parentId={folderId} />

            <Button size="sm" onClick={() => setShowUploadModal(true)}>
              <Upload className="h-4 w-4 mr-1" />
              Upload Image
            </Button>
          </div>
        </div>
      </div>

      {subfolders.length === 0 && images.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <FolderPlus className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-xl font-medium text-gray-800 mb-2">
            This folder is empty
          </h2>
          <p className="text-gray-600 mb-6">
            Upload an image or create a subfolder
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:space-x-4">
            <CreateFolderButton
              parentId={folderId}
              className="w-full sm:w-auto"
            />

            <Button
              onClick={() => setShowUploadModal(true)}
              className="w-full sm:w-auto"
            >
              <Upload className="h-4 w-4 mr-1" />
              Upload Image
            </Button>
          </div>
        </div>
      ) : (
        <>
          {subfolders.length > 0 && (
            <section className="mb-8">
              <h2 className="text-lg font-medium text-gray-800 mb-4">
                Folders
              </h2>
              <FolderList
                folders={subfolders}
                onEditFolder={handleEditFolder}
              />
            </section>
          )}

          {images.length > 0 && (
            <section>
              <h2 className="text-lg font-medium text-gray-800 mb-4">Images</h2>
              <ImageList images={images} folderId={folderId} />
            </section>
          )}
        </>
      )}

      <EditFolderModal
        folder={editFolder}
        isOpen={!!editFolder}
        onClose={handleCloseEditModal}
      />

      <ImageUploadModal
        isOpen={showUploadModal}
        folderId={folderId}
        onClose={() => setShowUploadModal(false)}
      />
    </AppLayout>
  );
}
