// src/components/images/ImageItem.jsx
import React, { useState } from "react";
import { MoreVertical, Download, Trash2, Edit, Eye } from "lucide-react";
import { useDeleteImage } from "../../hooks/useImages";

export default function ImageItem({ image, onEdit, onPreview }) {
  const [showOptions, setShowOptions] = useState(false);
  const deleteImage = useDeleteImage();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleOptionsClick = (e) => {
    e.stopPropagation();
    setShowOptions(!showOptions);
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    setShowOptions(false);
    onEdit(image);
  };

  const handlePreviewClick = () => {
    setShowOptions(false);
    onPreview(image);
  };

  const handleDeleteClick = async (e) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete "${image.name}"?`)) {
      setIsDeleting(true);
      try {
        await deleteImage.mutateAsync(image._id);
      } catch (error) {
        console.error("Failed to delete image:", error);
        alert("Failed to delete image. Please try again.");
      } finally {
        setIsDeleting(false);
      }
    }
    setShowOptions(false);
  };

  const handleDownloadClick = (e) => {
    e.stopPropagation();
    setShowOptions(false);

    // Create a temporary link to download the image
    const link = document.createElement("a");
    link.href = image.url;
    link.download = image.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow relative"
      onClick={handlePreviewClick}
    >
      {isDeleting && (
        <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}
      <div className="h-48 bg-gray-100 flex items-center justify-center">
        <img
          src={image.url}
          alt={image.name}
          className="h-full w-full object-cover"
          loading="lazy" // For better performance
        />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-gray-800 truncate pr-6">
            {image.name}
          </h3>
          <button
            className="absolute top-2 right-2 p-1 rounded-full bg-white bg-opacity-70 hover:bg-opacity-100"
            onClick={handleOptionsClick}
          >
            <MoreVertical className="h-5 w-5 text-gray-700" />
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          {Math.round(image.fileSize / 1024)} KB
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {new Date(image.createdAt).toLocaleDateString()}
        </p>
      </div>

      {showOptions && (
        <div className="absolute top-10 right-2 bg-white shadow-lg rounded-md py-1 z-10">
          <button
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={handlePreviewClick}
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </button>
          <button
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={handleEditClick}
          >
            <Edit className="h-4 w-4 mr-2" />
            Rename
          </button>
          <button
            className="flex items-center w-full px-4 py-2 text-sm text-blue-600 hover:bg-gray-100"
            onClick={handleDownloadClick}
          >
            <Download className="h-4 w-4 mr-2" />
            Download
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
