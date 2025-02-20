// src/pages/images/SearchPage.jsx
import React, { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search as SearchIcon, ArrowLeft, Folder, Loader } from "lucide-react";
import AppLayout from "../../components/layout/AppLayout";
import { useSearchImages } from "../../hooks/useImages";
import ImageList from "../../components/images/ImageList";
import EditImageModal from "../../components/images/EditImageModal";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const [editImage, setEditImage] = useState(null);

  const { data: images = [], isLoading, error } = useSearchImages(query);

  const handleEditImage = (image) => {
    setEditImage(image);
  };

  const handleCloseEditModal = () => {
    setEditImage(null);
  };

  return (
    <AppLayout>
      <div className="mb-8">
        <Link
          to="/dashboard"
          className="inline-flex items-center text-blue-600 hover:underline mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </Link>

        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          <SearchIcon className="h-6 w-6 mr-2 text-gray-600" />
          Search Results for: "{query}"
        </h1>
      </div>

      {isLoading ? (
        <div className="py-20 text-center">
          <Loader className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-600">Searching for images...</p>
        </div>
      ) : error ? (
        <div className="py-20 text-center">
          <div className="bg-red-100 p-4 rounded-lg mb-4 inline-block">
            <span className="text-red-600">Error searching images</span>
          </div>
          <p className="text-gray-600">{error.message}</p>
        </div>
      ) : images.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <SearchIcon className="h-8 w-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-medium text-gray-800 mb-2">
            No images found
          </h2>
          <p className="text-gray-600">
            We couldn't find any images matching "{query}"
          </p>
        </div>
      ) : (
        <div>
          <p className="text-gray-600 mb-4">
            Found {images.length} {images.length === 1 ? "result" : "results"}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image) => (
              <div
                key={image._id}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="h-48 bg-gray-100 flex items-center justify-center">
                  <img
                    src={image.url}
                    alt={image.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-800 truncate">
                    {image.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {Math.round(image.fileSize / 1024)} KB
                  </p>
                  <Link
                    to={`/folder/${image.folderId}`}
                    className="inline-flex items-center text-xs text-blue-600 mt-2 hover:underline"
                  >
                    <Folder className="h-3 w-3 mr-1" />
                    View in folder
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <EditImageModal
        image={editImage}
        isOpen={!!editImage}
        onClose={handleCloseEditModal}
      />
    </AppLayout>
  );
}
