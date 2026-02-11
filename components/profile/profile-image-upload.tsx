'use client';

import { useState, useCallback, useEffect } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import { useProfileImageUpload } from '../../lib/use-profile-image-upload';
import { useAuthStore } from '../../lib/auth-store';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { 
  Upload, 
  User, 
  X, 
  AlertCircle, 
  CheckCircle2, 
  Camera,
  Trash2 
} from 'lucide-react';
import Image from 'next/image';

interface ProfileImageUploadProps {
  showTitle?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ProfileImageUpload({ 
  showTitle = true, 
  size = 'md', 
  className = '' 
}: ProfileImageUploadProps) {
  const { user, isLoading: authLoading } = useAuthStore();
  const { uploadState, uploadImage, removeImage, resetState } = useProfileImageUpload();
  const [preview, setPreview] = useState<string | null>(null);
  const [, forceUpdate] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Force re-render when user.profileImage changes
  useEffect(() => {
    setPreview(null); // Clear any preview when user data updates
    forceUpdate({}); // Force component re-render
  }, [user?.profileImage]);

  // Clear success message after 3 seconds
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload image
    try {
      await uploadImage(file);
      setPreview(null); // Clear preview on successful upload
      
      // Show success message
      setSuccessMessage('Profile image updated successfully! Old image was automatically removed.');
      setShowSuccess(true);
      
      // Force component refresh after successful upload
      setTimeout(() => {
        // This will trigger the auth store to re-sync
        window.dispatchEvent(new Event('storage'));
      }, 100);
    } catch (error) {
      console.error('Upload failed:', error);
      setPreview(null);
    }
  }, [uploadImage]);

  const onDropRejected = useCallback((fileRejections: FileRejection[]) => {
    const rejection = fileRejections[0];
    if (rejection) {
      let errorMessage = 'File upload rejected: ';
      
      const errors = rejection.errors;
      if (errors.find(e => e.code === 'file-too-large')) {
        const sizeMB = (rejection.file.size / (1024 * 1024)).toFixed(2);
        errorMessage = `File size (${sizeMB}MB) exceeds 1MB limit`;
      } else if (errors.find(e => e.code === 'file-invalid-type')) {
        errorMessage = 'Only PNG and JPG files are allowed';
      } else {
        errorMessage = errors[0]?.message || 'Invalid file';
      }
      
      // Show error message 
      alert(errorMessage);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, isDragReject, isDragAccept } = useDropzone({
    onDrop,
    onDropRejected,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg']
    },
    multiple: false,
    maxSize: 1 * 1024 * 1024, // 1MB
  });

  const handleRemoveImage = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to remove your profile image? This will permanently delete the image and show a default icon instead.'
    );
    
    if (!confirmed) return;
    
    try {
      console.log('🗑️ User confirmed profile image removal');
      await removeImage();
      setSuccessMessage('Profile image removed successfully! Default icon will now be shown.');
      setShowSuccess(true);
      console.log('✅ Profile image removed successfully');
    } catch (error) {
      console.error('❌ Remove failed:', error);
      alert('Failed to remove profile image. Please try again.');
    }
  };

  const currentImageUrl = preview || user?.profileImage;
  const hasImage = !!currentImageUrl;

  // Show loading state while auth is being restored
  if (authLoading) {
    return (
      <Card className={className}>
        {showTitle && (
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Camera className="h-5 w-5" />
              <span>Profile Picture</span>
            </CardTitle>
          </CardHeader>
        )}
        <CardContent className="space-y-4">
          <div className="flex justify-center">
            <div className={`${sizeClasses[size]} relative rounded-full overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center`}>
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            </div>
          </div>
          <p className="text-center text-sm text-gray-500">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  if (showTitle) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Camera className="h-5 w-5" />
            <span>Profile Picture</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ProfileImageContent />
        </CardContent>
      </Card>
    );
  }

  return <ProfileImageContent />;

  function ProfileImageContent() {
    return (
      <>
        {/* Current Image / Preview */}
        <div className="flex justify-center">
          <div className={`${sizeClasses[size]} relative rounded-full overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300`}>
            {hasImage ? (
              <div className="relative w-full h-full">
                <Image
                  key={currentImageUrl} // Force re-render when URL changes
                  src={currentImageUrl!}
                  alt="Profile"
                  fill
                  className="object-cover"
                  unoptimized // Bypass Next.js image optimization to avoid caching issues
                  onError={(error) => {
                    console.error('❌ Image load error:', error);
                    console.error('Failed image URL:', currentImageUrl);
                    setPreview(null);
                  }}
                />
                {user?.profileImage && !preview && (
                  <Button
                    size="icon"
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                    onClick={handleRemoveImage}
                    disabled={uploadState.isUploading}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center w-full h-full bg-linear-to-br from-gray-100 to-gray-200">
                <User className="h-8 w-8 text-gray-400 mb-1" />
                <span className="text-xs text-gray-500">No Image</span>
              </div>
            )}
          </div>
        </div>

        {/* Upload Area */}
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
            ${isDragAccept 
              ? 'border-green-500 bg-green-50' 
              : isDragReject 
                ? 'border-red-500 bg-red-50' 
                : isDragActive
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
            }
            ${uploadState.isUploading ? 'pointer-events-none opacity-50' : ''}
          `}
        >
          <input {...getInputProps()} />
          
          <div className="space-y-2">
            <Upload className={`h-8 w-8 mx-auto ${
              isDragAccept 
                ? 'text-green-500' 
                : isDragReject 
                  ? 'text-red-500' 
                  : isDragActive
                    ? 'text-blue-500'
                    : 'text-gray-400'
            }`} />
            
            {isDragActive ? (
              <p className={`${
                isDragAccept 
                  ? 'text-green-600' 
                  : isDragReject 
                    ? 'text-red-600' 
                    : 'text-blue-600'
              }`}>
                {isDragAccept 
                  ? 'Drop the image here!' 
                  : isDragReject 
                    ? 'File not supported (PNG/JPG up to 1MB only)' 
                    : 'Drop the image here...'
                }
              </p>
            ) : (
              <div>
                <p className="text-gray-600">
                  {hasImage 
                    ? 'Upload a new image to replace the current one' 
                    : 'Drag & drop an image here, or click to select'
                  }
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PNG or JPG up to 1MB
                  {hasImage && ' • Old image will be automatically deleted'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Upload Progress */}
        {uploadState.isUploading && (
          <div className="space-y-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadState.progress}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 text-center">
              Uploading image... {uploadState.progress}%
            </p>
          </div>
        )}

        {/* Error Message */}
        {uploadState.error && (
          <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-md">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <span className="text-sm text-red-700">{uploadState.error}</span>
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={resetState}
              className="ml-auto h-auto p-1"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Success Message */}
        {showSuccess && !uploadState.isUploading && !uploadState.error && (
          <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-md">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span className="text-sm text-green-700">
              {successMessage}
            </span>
          </div>
        )}

        {/* Success Message */}
        {uploadState.progress === 100 && !uploadState.error && !uploadState.isUploading && (
          <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-md">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span className="text-sm text-green-700">Profile image updated successfully!</span>
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={resetState}
              className="ml-auto h-auto p-1"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Quick Actions */}
        {!uploadState.isUploading && (
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => {
                const input = document.querySelector('input[type="file"]') as HTMLInputElement;
                input?.click();
              }}
            >
              <Upload className="h-4 w-4 mr-2" />
              Choose File
            </Button>
            
            {user?.profileImage && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleRemoveImage}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Remove
              </Button>
            )}
          </div>
        )}
      </>
    );
  }
}