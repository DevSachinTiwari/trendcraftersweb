import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// For client-side operations (public access)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// For server-side operations (bypasses RLS)
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
export const supabaseAdmin = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : supabase; // Fallback to regular client if no service key

// Storage bucket names
export const STORAGE_BUCKETS = {
  PROFILE_IMAGES: 'profile-images',
  PRODUCT_IMAGES: 'product-images', // For future use
} as const;

// Storage helper functions
export const storageHelpers = {
  // Generate a unique filename with user ID prefix
  generateFileName: (userId: string, originalFileName: string): string => {
    const timestamp = Date.now();
    const fileExtension = originalFileName.split('.').pop() || 'jpg';
    return `${userId}/${timestamp}.${fileExtension}`;
  },

  // Get public URL for an image
  getPublicUrl: (bucket: string, path: string): string => {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  },

  // Extract storage path from public URL
  extractPathFromUrl: (publicUrl: string): string | null => {
    try {
      const url = new URL(publicUrl);
      const pathSegments = url.pathname.split('/');
      
      // Find the bucket name in the path and extract everything after it
      const bucketIndex = pathSegments.findIndex(segment => segment === 'profile-images');
      if (bucketIndex === -1) return null;
      
      // Return the path after the bucket name
      return pathSegments.slice(bucketIndex + 1).join('/');
    } catch (error) {
      console.error('Failed to extract path from URL:', error);
      return null;
    }
  },

  // Delete an image from storage
  deleteImage: async (bucket: string, path: string): Promise<{ error: Error | null }> => {
    try {
      console.log(`🗑️ Attempting to delete: ${bucket}/${path}`);
      const { error } = await supabaseAdmin.storage.from(bucket).remove([path]);
      
      if (error) {
        console.error('Storage deletion error:', error);
        return { error };
      }
      
      console.log(`✅ Successfully deleted: ${bucket}/${path}`);
      return { error: null };
    } catch (err) {
      console.error('Delete function error:', err);
      return { 
        error: err instanceof Error ? err : new Error('Delete failed') 
      };
    }
  },

  // Upload an image
  uploadImage: async (
    bucket: string,
    path: string,
    file: File
  ): Promise<{ data: unknown; error: Error | null; publicUrl?: string }> => {
    try {
      // Use admin client for server-side uploads (bypasses RLS)
      const { data, error } = await supabaseAdmin.storage
        .from(bucket)
        .upload(path, file, {
          cacheControl: '3600',
          upsert: true // Replace if file exists
        });

      if (error) {
        console.error('Storage upload error:', error);
        return { data: null, error };
      }

      // Get the public URL using regular client
      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path);
      
      return { data, error: null, publicUrl: urlData.publicUrl };
    } catch (err) {
      console.error('Upload function error:', err);
      return { 
        data: null, 
        error: err instanceof Error ? err : new Error('Upload failed') 
      };
    }
  }
};

// Image validation helpers
export const imageValidation = {
  // Allowed file types (PNG and JPG only)
  ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png'],
  
  // Maximum file size (1MB)
  MAX_FILE_SIZE: 1 * 1024 * 1024,
  
  // Validate file
  validateFile: (file: File): { isValid: boolean; error?: string } => {
    // Check file type
    if (!imageValidation.ALLOWED_TYPES.includes(file.type)) {
      return {
        isValid: false,
        error: 'Please select a valid image file (PNG or JPG only)'
      };
    }

    // Check file size
    if (file.size > imageValidation.MAX_FILE_SIZE) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      return {
        isValid: false,
        error: `Image size (${sizeMB}MB) must be less than 1MB`
      };
    }

    return { isValid: true };
  }
};