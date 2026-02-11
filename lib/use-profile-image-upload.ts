import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from './auth-store';
import { storageHelpers, STORAGE_BUCKETS, imageValidation } from './supabase-storage';

interface UploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
}

interface UseProfileImageUploadReturn {
  uploadState: UploadState;
  uploadImage: (file: File) => Promise<void>;
  removeImage: () => Promise<void>;
  resetState: () => void;
}

export function useProfileImageUpload(): UseProfileImageUploadReturn {
  const { setUser } = useAuthStore();
  const queryClient = useQueryClient();
  
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    error: null,
  });

  // Mutation for uploading profile image
  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      // Get fresh user state and token
      const currentUser = useAuthStore.getState().user;
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth-token='))
        ?.split('=')[1];

      console.log('Upload attempt:', { user: currentUser, hasToken: !!token });

      if (!currentUser) {
        throw new Error('User not authenticated - please log in again');
      }

      if (!token) {
        throw new Error('Authentication token not found - please log in again');
      }

      // Validate file
      const validation = imageValidation.validateFile(file);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      // Generate unique filename
      const fileName = storageHelpers.generateFileName(currentUser.id, file.name);

      // If user already has a profile image, delete the old one first
      if (currentUser.profileImage) {
        console.log('🗑️ Deleting old profile image:', currentUser.profileImage);
        try {
          const oldPath = storageHelpers.extractPathFromUrl(currentUser.profileImage);
          if (oldPath) {
            const { error: deleteError } = await storageHelpers.deleteImage(
              STORAGE_BUCKETS.PROFILE_IMAGES, 
              oldPath
            );
            if (deleteError) {
              console.warn('Failed to delete old profile image:', deleteError);
            } else {
              console.log('✅ Successfully deleted old profile image');
            }
          } else {
            console.warn('Could not extract path from old profile image URL');
          }
        } catch (error) {
          console.warn('Error during old profile image deletion:', error);
          // Continue with upload even if deletion fails
        }
      }

      // Upload new image
      console.log('📤 Uploading new profile image:', fileName);
      const { error, publicUrl } = await storageHelpers.uploadImage(
        STORAGE_BUCKETS.PROFILE_IMAGES,
        fileName,
        file
      );

      if (error) {
        throw new Error(error.message || 'Failed to upload image');
      }

      if (!publicUrl) {
        throw new Error('Failed to get image URL');
      }

      console.log('✅ Profile image uploaded successfully:', publicUrl);
      return { publicUrl, token };
    },
    onMutate: () => {
      setUploadState({
        isUploading: true,
        progress: 0,
        error: null,
      });
    },
    onSuccess: async ({ publicUrl, token }) => {
      const hadPreviousImage = useAuthStore.getState().user?.profileImage;
      
      console.log('=== PROFILE UPDATE SUCCESS ===');
      console.log('New profile image URL:', publicUrl);
      if (hadPreviousImage) {
        console.log('✅ Old profile image was automatically replaced');
      } else {
        console.log('✅ First profile image added');
      }

      // Update user profile in database
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ profileImage: publicUrl }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Profile update API error:', errorData);
        throw new Error(errorData.error || 'Failed to update profile');
      }

      const updatedResponse = await response.json();
      console.log('Profile update API response:', updatedResponse);

      const updatedUser = updatedResponse.user;
      console.log('Updated user data:', {
        email: updatedUser.email,
        profileImage: updatedUser.profileImage
      });

      // Update auth store
      setUser(updatedUser);

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['user'] });

      setUploadState({
        isUploading: false,
        progress: 100,
        error: null,
      });

      console.log('=== PROFILE UPDATE COMPLETE ===');
    },
    onError: (error: Error) => {
      setUploadState({
        isUploading: false,
        progress: 0,
        error: error.message,
      });
    },
  });

  // Mutation for removing profile image
  const removeMutation = useMutation({
    mutationFn: async () => {
      // Get fresh user state and token
      const currentUser = useAuthStore.getState().user;
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth-token='))
        ?.split('=')[1];

      if (!currentUser?.profileImage) {
        throw new Error('No profile image to remove');
      }

      if (!token) {
        throw new Error('Authentication token not found');
      }

      // Extract path from the profile image URL using helper
      const imagePath = storageHelpers.extractPathFromUrl(currentUser.profileImage);
      
      if (!imagePath) {
        throw new Error('Could not extract image path from URL');
      }

      console.log('🗑️ Removing profile image:', imagePath);

      // Delete from storage
      const { error } = await storageHelpers.deleteImage(
        STORAGE_BUCKETS.PROFILE_IMAGES,
        imagePath
      );

      if (error) {
        throw new Error('Failed to delete image from storage');
      }

      return { success: true, token };
    },
    onSuccess: async ({ token }) => {
      // Update user profile in database
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ profileImage: null }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update profile');
      }

      const updatedUser = await response.json();

      // Update auth store
      setUser(updatedUser.user);

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (error: Error) => {
      setUploadState(prev => ({
        ...prev,
        error: error.message,
      }));
    },
  });

  const uploadImage = async (file: File) => {
    uploadMutation.mutate(file);
  };

  const removeImage = async () => {
    removeMutation.mutate();
  };

  const resetState = () => {
    setUploadState({
      isUploading: false,
      progress: 0,
      error: null,
    });
  };

  return {
    uploadState: {
      ...uploadState,
      isUploading: uploadMutation.isPending || removeMutation.isPending,
    },
    uploadImage,
    removeImage,
    resetState,
  };
}