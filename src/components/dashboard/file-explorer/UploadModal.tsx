import { useState } from 'react';
import { X } from 'lucide-react';
import { FileUpload } from './FileUpload';
import { cn } from '../../../lib/utils';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete?: (files: File[]) => void;
  currentFolderId?: string | null;
}

export function UploadModal({
  isOpen,
  onClose,
  onUploadComplete,
  currentFolderId = null,
}: UploadModalProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Handle file upload
  const handleFilesUpload = async (files: File[]) => {
    if (!files.length) return;

    setIsUploading(true);

    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setUploadProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
        // Simulate network delay
        setTimeout(() => {
          setIsUploading(false);
          setUploadProgress(0);
          if (onUploadComplete) {
            onUploadComplete(files);
          }
          onClose();
        }, 500);
      }
    }, 200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="z-50 w-full max-w-2xl rounded-2xl border bg-background p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Upload Files</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            Upload files to {currentFolderId ? 'the current folder' : 'your Aether Drive'}.
            Supported file types: documents, images, videos, and more.
          </p>
        </div>

        {isUploading && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm">
              <span>Uploading...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-primary transition-all duration-200"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        <FileUpload
          onFilesUpload={handleFilesUpload}
          isUploading={isUploading}
          className="mb-4"
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted"
            disabled={isUploading}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
