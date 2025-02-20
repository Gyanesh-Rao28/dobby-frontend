// src/services/image.service.js
import api from "./api";

export const ImageService = {
  uploadImage: async (formData) => {
    const response = await api.post("/images", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.image;
  },

  getImage: async (imageId) => {
    const response = await api.get(`/images/${imageId}`);
    return response.data.image;
  },

  updateImage: async (imageId, data) => {
    const response = await api.put(`/images/${imageId}`, data);
    return response.data.image;
  },

  deleteImage: async (imageId) => {
    const response = await api.delete(`/images/${imageId}`);
    return response.data;
  },

  searchImages: async (query) => {
    const response = await api.get(`/images/search?query=${query}`);
    return response.data.images;
  },
};
