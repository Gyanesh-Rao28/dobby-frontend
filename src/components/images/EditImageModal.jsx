// src/components/images/EditImageModal.jsx
import React, { useState, useEffect } from "react";
import { useUpdateImage } from "../../hooks/useImages";
import Button from "../ui/Button";

export default function EditImageModal({ image, isOpen, onClose }) {
  const [imageName, setImageName] = useState("");
  const [error, setError] = useState("");
  const updateImage = useUpdateImage();

  useEffect(() => {
    if (image) {
      setImageName(image.name);
    }
  }, [image]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageName.trim()) {
      setError("Image name is required");
      return;
    }

    try {
      await updateImage.mutateAsync({
        imageId: image._id,
        data: { name: imageName.trim() },
      });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update image");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Rename Image</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="imageName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Image Name
            </label>
            <input
              id="imageName"
              type="text"
              value={imageName}
              onChange={(e) => {
                setImageName(e.target.value);
                setError("");
              }}
              className={`w-full px-3 py-2 border rounded-md ${
                error ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Image name"
              autoFocus
            />
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" isLoading={updateImage.isPending}>
              Save
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
