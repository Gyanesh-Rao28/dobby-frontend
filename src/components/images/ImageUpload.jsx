// src/components/images/ImageUpload.jsx
import React, { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon, Edit } from "lucide-react";
import { useUploadImage } from "../../hooks/useImages";
import Button from "../ui/Button";

export default function ImageUploadModal({ isOpen, folderId, onClose }) {
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [isDragging, setIsDragging] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const fileInputRef = useRef(null);

  const uploadImage = useUploadImage();

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    validateAndAddFiles(selectedFiles);
  };

  const validateAndAddFiles = (selectedFiles) => {
    const newFiles = [];
    const newErrors = { ...errors };

    selectedFiles.forEach((file) => {
      // Validate file type
      if (!file.type.match("image.*")) {
        newErrors[file.name] = "Only image files are allowed";
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        newErrors[file.name] = "Image size should be less than 5MB";
        return;
      }

      // Get file name without extension
      const nameParts = file.name.split(".");
      const extension = nameParts.pop();
      const nameWithoutExtension = nameParts.join(".");

      // Add preview
      const reader = new FileReader();
      reader.onload = (e) => {
        file.preview = e.target.result;
        setFiles((current) => [...current]);
      };
      reader.readAsDataURL(file);

      newFiles.push({
        file,
        name: nameWithoutExtension,
        extension: extension,
        preview: null,
        uploaded: false,
      });
    });

    setFiles((current) => [...current, ...newFiles]);
    setErrors(newErrors);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    validateAndAddFiles(droppedFiles);
  };

  const removeFile = (index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  const updateFileName = (index, newName) => {
    const updatedFiles = [...files];
    updatedFiles[index].name = newName;
    setFiles(updatedFiles);
    setEditingIndex(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (files.length === 0) {
      setErrors({ general: "Please select at least one image to upload" });
      return;
    }

    // Check for empty names
    const emptyNameIndex = files.findIndex((file) => !file.name.trim());
    if (emptyNameIndex !== -1) {
      setErrors({
        ...errors,
        [emptyNameIndex]: "Image name is required",
        general: "Please provide names for all images",
      });
      return;
    }

    setUploading(true);
    const newProgress = {};
    const newErrors = {};

    try {
      // Upload files one by one
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        newProgress[i] = 0;
        setUploadProgress({ ...newProgress });

        const formData = new FormData();
        formData.append("image", file.file);
        formData.append("name", `${file.name.trim()}.${file.extension}`);
        formData.append("folderId", folderId);

        try {
          console.log(
            `Uploading file ${i + 1}/${files.length}: ${file.name}.${
              file.extension
            }`
          );
          await uploadImage.mutateAsync(formData);
          newProgress[i] = 100;
          setUploadProgress({ ...newProgress });

          // Mark as uploaded
          const updatedFiles = [...files];
          updatedFiles[i].uploaded = true;
          setFiles(updatedFiles);
        } catch (err) {
          console.error(`Error uploading file ${i + 1}:`, err);
          newErrors[i] =
            err.response?.data?.message || "Failed to upload image";
          newProgress[i] = -1; // Error state
        }
      }

      if (Object.keys(newErrors).length === 0) {
        // All uploads successful
        resetForm();
        onClose();
      } else {
        setErrors(newErrors);
      }
    } catch (err) {
      console.error("General upload error:", err);
      setErrors({ general: "An error occurred during upload" });
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setFiles([]);
    setErrors({});
    setUploadProgress({});
    setEditingIndex(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Upload Images</h2>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
            disabled={uploading}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {files.length === 0 ? (
            <div
              className={`border-2 border-dashed rounded-lg p-8 mb-4 text-center ${
                isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <ImageIcon className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-600 mb-4">
                Drag and drop images here, or click to select
              </p>
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                  multiple
                  ref={fileInputRef}
                />
                <span className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 inline-block">
                  Select Images
                </span>
              </label>
            </div>
          ) : (
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Selected Images</h3>
                <button
                  type="button"
                  className="text-sm text-blue-600 hover:underline"
                  onClick={() => fileInputRef.current.click()}
                  disabled={uploading}
                >
                  + Add More
                </button>
              </div>

              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                multiple
                ref={fileInputRef}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="relative border rounded-md overflow-hidden"
                  >
                    {!uploading && (
                      <button
                        type="button"
                        className="absolute top-1 right-1 z-10 bg-red-600 text-white rounded-full p-1"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}

                    <div className="h-32 overflow-hidden">
                      {file.preview ? (
                        <img
                          src={file.preview}
                          alt={file.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <div className="animate-pulse">
                            Loading preview...
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="p-2">
                      {editingIndex === index ? (
                        <div className="flex items-center">
                          <input
                            type="text"
                            value={file.name}
                            onChange={(e) => {
                              const updatedFiles = [...files];
                              updatedFiles[index].name = e.target.value;
                              setFiles(updatedFiles);
                            }}
                            className="w-full text-sm px-2 py-1 border rounded"
                            autoFocus
                            onBlur={() => updateFileName(index, file.name)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                updateFileName(index, file.name);
                              }
                            }}
                          />
                          <span className="ml-1 text-sm text-gray-500">
                            .{file.extension}
                          </span>
                        </div>
                      ) : (
                        <div className="flex justify-between items-center">
                          <p className="text-sm truncate">
                            {file.name}.{file.extension}
                          </p>
                          {!uploading && (
                            <button
                              type="button"
                              onClick={() => setEditingIndex(index)}
                              className="text-blue-500 p-1"
                            >
                              <Edit className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      )}

                      {errors[index] && (
                        <p className="text-xs text-red-600">{errors[index]}</p>
                      )}

                      {uploadProgress[index] !== undefined && (
                        <div className="mt-1">
                          {uploadProgress[index] === 100 ? (
                            <div className="text-xs text-green-600 flex items-center">
                              <svg
                                className="w-4 h-4 mr-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                              Uploaded
                            </div>
                          ) : uploadProgress[index] === -1 ? (
                            <div className="text-xs text-red-600">Failed</div>
                          ) : (
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div
                                className="bg-blue-600 h-1.5 rounded-full"
                                style={{ width: `${uploadProgress[index]}%` }}
                              ></div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
              {errors.general}
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="secondary"
              onClick={uploading ? null : onClose}
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={files.length === 0 || uploading}
              isLoading={uploading}
            >
              {!uploading && <Upload className="h-4 w-4 mr-1" />}
              {uploading
                ? `Uploading (${
                    Object.values(uploadProgress).filter((p) => p === 100)
                      .length
                  }/${files.length})`
                : "Upload"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
