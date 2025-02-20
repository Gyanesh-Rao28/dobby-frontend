// src/components/images/ImageList.jsx
import React, { useState } from "react";
import ImageItem from "./ImageItem";
import EditImageModal from "./EditImageModal";
import ImagePreviewModal from "./ImagePreviewModal";

export default function ImageList({ images, folderId }) {
  const [editImage, setEditImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleEditImage = (image) => {
    setEditImage(image);
  };

  const handlePreviewImage = (image) => {
    const index = images.findIndex((img) => img._id === image._id);
    setCurrentImageIndex(index);
    setPreviewImage(image);
  };

  const handleCloseEditModal = () => {
    setEditImage(null);
  };

  const handleClosePreviewModal = () => {
    setPreviewImage(null);
  };

  const handleNextImage = () => {
    const nextIndex = (currentImageIndex + 1) % images.length;
    setCurrentImageIndex(nextIndex);
    setPreviewImage(images[nextIndex]);
  };

  const handlePrevImage = () => {
    const prevIndex = (currentImageIndex - 1 + images.length) % images.length;
    setCurrentImageIndex(prevIndex);
    setPreviewImage(images[prevIndex]);
  };

  if (!images || images.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No images found in this folder.
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image) => (
          <ImageItem
            key={image._id}
            image={image}
            onEdit={handleEditImage}
            onPreview={handlePreviewImage}
          />
        ))}
      </div>

      <EditImageModal
        image={editImage}
        isOpen={!!editImage}
        onClose={handleCloseEditModal}
      />

      <ImagePreviewModal
        image={previewImage}
        isOpen={!!previewImage}
        onClose={handleClosePreviewModal}
        onNext={images.length > 1 ? handleNextImage : null}
        onPrevious={images.length > 1 ? handlePrevImage : null}
        totalImages={images.length}
        currentIndex={currentImageIndex}
      />
    </>
  );
}
