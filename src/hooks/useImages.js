// src/hooks/useImages.js (update)
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ImageService } from "../services/image.service";

export const useUploadImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ImageService.uploadImage,
    onSuccess: (newImage) => {
      // Update folder contents to show new image
      queryClient.invalidateQueries({
        queryKey: ["folders", newImage.folderId],
      });
    },
  });
};

export const useUpdateImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ imageId, data }) => ImageService.updateImage(imageId, data),
    onSuccess: (updatedImage) => {
      // Update folder contents to reflect the change
      queryClient.invalidateQueries({
        queryKey: ["folders", updatedImage.folderId],
      });
      // Also update search results if they exist
      queryClient.invalidateQueries({ queryKey: ["images", "search"] });
    },
  });
};

export const useDeleteImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ImageService.deleteImage,
    onSuccess: (_, imageId) => {
      // Invalidate all folder queries as we don't know which folder the image was in
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      // Also update search results if they exist
      queryClient.invalidateQueries({ queryKey: ["images", "search"] });
    },
  });
};

export const useSearchImages = (query) => {
  return useQuery({
    queryKey: ["images", "search", query],
    queryFn: () => ImageService.searchImages(query),
    enabled: !!query && query.length > 0,
  });
};
