// src/hooks/useFolders.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FolderService } from "../services/folder.service";

export const useFolders = () => {
  return useQuery({
    queryKey: ["folders", "root"],
    queryFn: FolderService.getRootFolders,
  });
};

export const useFolderContent = (folderId) => {
  return useQuery({
    queryKey: ["folders", folderId],
    queryFn: () => FolderService.getFolderContents(folderId),
    enabled: !!folderId,
  });
};

export const useCreateFolder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: FolderService.createFolder,
    onSuccess: (newFolder) => {
      // Update root folders cache
      queryClient.invalidateQueries({ queryKey: ["folders", "root"] });

      // If it's a subfolder, update parent folder contents
      if (newFolder.parentId) {
        queryClient.invalidateQueries({
          queryKey: ["folders", newFolder.parentId],
        });
      }
    },
  });
};

export const useUpdateFolder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ folderId, data }) =>
      FolderService.updateFolder(folderId, data),
    onSuccess: (updatedFolder) => {
      // Update both folder list and specific folder
      queryClient.invalidateQueries({ queryKey: ["folders", "root"] });
      queryClient.invalidateQueries({
        queryKey: ["folders", updatedFolder._id],
      });

      // If it has a parent, update parent folder contents
      if (updatedFolder.parentId) {
        queryClient.invalidateQueries({
          queryKey: ["folders", updatedFolder.parentId],
        });
      }
    },
  });
};

export const useDeleteFolder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: FolderService.deleteFolder,
    onSuccess: (_, variables) => {
      // Invalidate all related queries
      queryClient.invalidateQueries({ queryKey: ["folders"] });
    },
  });
};

export const useFolderPath = (folderId) => {
  return useQuery({
    queryKey: ["folder-path", folderId],
    queryFn: () => FolderService.getFolderPath(folderId),
    enabled: !!folderId,
    staleTime: 5 * 60 * 1000, // Cache path for 5 minutes
  });
};