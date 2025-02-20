// src/components/images/ImagePreviewModal.jsx
import React from "react";
import { X, ArrowLeft, ArrowRight, Download, Trash2, Edit } from "lucide-react";
import { useDeleteImage } from "../../hooks/useImages";
import Button from "../ui/Button";

export default function ImagePreviewModal({
  image,
  isOpen,
  onClose,
  onNext,
  onPrevious,
  totalImages,
  currentIndex,
  onEdit,
}) {
  const deleteImage = useDeleteImage();

  if (!isOpen || !image) return null;

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = image.url;
    link.download = image.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete "${image.name}"?`)) {
      try {
        await deleteImage.mutateAsync(image._id);
        onClose();
      } catch (error) {
        console.error("Failed to delete image:", error);
        alert("Failed to delete image. Please try again.");
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowRight" && onNext) {
      onNext();
    } else if (e.key === "ArrowLeft" && onPrevious) {
      onPrevious();
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-90 flex flex-col z-50"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Header */}
      <div className="flex justify-between items-center p-4 text-white">
        <h3 className="font-medium text-xl truncate">{image.name}</h3>
        <div className="flex items-center space-x-4">
          {totalImages > 1 && (
            <span className="text-sm">
              {currentIndex + 1} of {totalImages}
            </span>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-800"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center relative">
        {/* Navigation buttons */}
        {onPrevious && (
          <button
            onClick={onPrevious}
            className="absolute left-4 p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 text-white"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
        )}

        {/* Image */}
        <div className="max-h-full max-w-full">
          <img
            src={image.url}
            alt={image.name}
            className="max-h-[80vh] max-w-full object-contain"
          />
        </div>

        {onNext && (
          <button
            onClick={onNext}
            className="absolute right-4 p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 text-white"
          >
            <ArrowRight className="h-6 w-6" />
          </button>
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-900 p-4">
        <div className="flex justify-between items-center text-white">
          <div>
            <p className="font-medium">{image.name}</p>
            <p className="text-sm text-gray-400">
              {Math.round(image.fileSize / 1024)} KB •
              {new Date(image.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex space-x-2">
            {onEdit && (
              <Button
                onClick={() => {
                  onClose();
                  onEdit(image);
                }}
                variant="outline"
                size="sm"
                className="text-white border-gray-600 hover:bg-gray-700"
              >
                <Edit className="h-4 w-4 mr-1" />
                Rename
              </Button>
            )}
            <Button
              onClick={handleDownload}
              variant="outline"
              size="sm"
              className="text-white border-gray-600 hover:bg-gray-700"
            >
              <Download className="h-4 w-4 mr-1" />
              Download
            </Button>
            <Button
              onClick={handleDelete}
              variant="outline"
              size="sm"
              className="text-red-500 border-gray-600 hover:bg-gray-700"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
