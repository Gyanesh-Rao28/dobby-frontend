// src/services/folder.service.js
import api from "./api";

export const FolderService = {
  getRootFolders: async () => {
    const response = await api.get("/folders/root");
    return response.data.folders;
  },

  getFolderContents: async (folderId) => {
    const response = await api.get(`/folders/${folderId}`);
    return response.data.data;
  },

  createFolder: async (folderData) => {
    const response = await api.post("/folders", folderData);
    return response.data.folder;
  },

  updateFolder: async (folderId, data) => {
    const response = await api.put(`/folders/${folderId}`, data);
    return response.data.folder;
  },

  deleteFolder: async (folderId) => {
    const response = await api.delete(`/folders/${folderId}`);
    return response.data;
  },
  getFolderPath: async (folderId) => {
    try {
      const response = await api.get(`/folders/${folderId}/path`);
      return response.data.path;
    } catch (error) {
      console.error("Error fetching folder path:", error);
      return []; 
    }
  },
};

export const getFolderPath = async (folderId) => {
  const response = await api.get(`/folders/${folderId}/path`);
  return response.data.path;
};