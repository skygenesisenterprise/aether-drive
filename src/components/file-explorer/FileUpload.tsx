import { useState, useRef, type DragEvent, type ChangeEvent } from 'react';
import { Upload, X, FileText, Image, Video, Music, Archive, File, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

interface FileUploadProps {
  onFilesUpload: (files: File[]) => void;
  isUploading?: boolean;
  multiple?: boolean;
  accept?: string;
  className?: string;
}

export function FileUpload({
  onFilesUpload,
  isUploading = false,
  multiple = true,
  accept,
  className,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [draggedFiles, setDraggedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Determine file type icon based on mime type
  const getFileIcon = (file: File) => {
    const type = file.type;

    if (type.startsWith('image/')) {
      return <Image className="h-8 w-8 text-purple-500" />;
    }

    if (type.startsWith('video/')) {
      return <Video className="h-8 w-8 text-red-500" />;
    }

    if (type.startsWith('audio/')) {
      return <Music className="h-8 w-8 text-green-500" />;
    }

    if (type.startsWith('application/pdf')) {
      return <FileText className="h-8 w-8 text-red-600" />;
    }

    if (
      type.includes('zip') ||
      type.includes('rar') ||
      type.includes('tar') ||
      type.includes('gzip')
    ) {
      return <Archive className="h-8 w-8 text-amber-500" />;
    }

    if (
      type.includes('document') ||
      type.includes('sheet') ||
      type.includes('presentation')
    ) {
      return <FileText className="h-8 w-8 text-blue-500" />;
    }

    return <File className="h-8 w-8 text-gray-500" />;
  };

  // Handle drag events
  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      setDraggedFiles(files);
      onFilesUpload(files);
      e.dataTransfer.clearData();
    }
  };

  // Handle file input change
  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setDraggedFiles(files);
      onFilesUpload(files);
    }
  };

  // Handle button click to open file dialog
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Remove a file from the preview
  const removeFile = (index: number) => {
    const newFiles = [...draggedFiles];
    newFiles.splice(index, 1);
    setDraggedFiles(newFiles);
  };

  return (
    <div className={cn("flex flex-col", className)}>
      <div
        className={cn(
          "relative rounded-2xl border-2 border-dashed p-8 transition-colors",
          isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25",
          draggedFiles.length > 0 && !isDragging && "border-muted-foreground/25 bg-muted/20"
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={handleFileInputChange}
          className="hidden"
        />

        {isUploading ? (
          <div className="flex flex-col items-center justify-center py-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="mt-4 text-center text-sm font-medium">Uploading files...</p>
          </div>
        ) : draggedFiles.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">{draggedFiles.length} files selected</h3>
              <button
                type="button"
                onClick={() => setDraggedFiles([])}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Clear All
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {draggedFiles.map((file, index) => (
                <div
                  key={`${file.name}-${index}`}
                  className="relative flex items-center gap-3 rounded-lg border bg-background p-3"
                >
                  {getFileIcon(file)}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {file.size < 1024
                        ? `${file.size} B`
                        : file.size < 1024 * 1024
                        ? `${(file.size / 1024).toFixed(1)} KB`
                        : `${(file.size / (1024 * 1024)).toFixed(1)} MB`}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-muted"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => onFilesUpload(draggedFiles)}
                className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                <Upload className="h-4 w-4" />
                Upload Files
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Upload className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-1 font-medium">Drag and drop your files here</h3>
            <p className="mb-4 text-sm text-muted-foreground">or click the button below to browse files</p>
            <button
              type="button"
              onClick={handleButtonClick}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              <Upload className="h-4 w-4" />
              Browse Files
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
