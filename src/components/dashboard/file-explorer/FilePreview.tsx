import { useState, useEffect } from 'react';
import {
  X,
  Download,
  Copy,
  Share2,
  Star,
  Trash2,
  FileText,
  Image as ImageIcon,
  File as FileIcon,
  Video as VideoIcon,
  Music,
  Table,
  Presentation,
  Archive,
  ChevronLeft,
  ChevronRight,
  Info
} from 'lucide-react';
import { formatFileSize, formatDate, cn } from '../../../lib/utils';
import type { FileItem } from '../../../lib/data';

interface FilePreviewProps {
  file: FileItem | null;
  onClose: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  hasNext?: boolean;
  hasPrevious?: boolean;
  isStarred?: boolean;
  onStarToggle?: () => void;
  onDelete?: () => void;
  onShare?: () => void;
}

export function FilePreview({
  file,
  onClose,
  onNext,
  onPrevious,
  hasNext = false,
  hasPrevious = false,
  isStarred = false,
  onStarToggle,
  onDelete,
  onShare,
}: FilePreviewProps) {
  const [showInfo, setShowInfo] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Reset loading state when file changes
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []); // Remove 'file' from dependencies

  if (!file) return null;

  // Function to render preview based on file type
  const renderPreview = () => {
    if (loading) {
      return (
        <div className="flex h-full w-full items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-primary" />
        </div>
      );
    }

    switch (file.type) {
      case 'image':
        return (
          <div className="flex h-full items-center justify-center overflow-hidden bg-muted/20">
            {/* In a real app, this would be the actual image URL */}
            <div className="relative h-full max-h-[80vh] w-auto">
              <div className="h-full w-full rounded-lg bg-muted/40 flex items-center justify-center">
                <ImageIcon className="h-24 w-24 text-muted-foreground/50" />
                <span className="absolute inset-0 flex items-center justify-center text-lg font-medium text-muted-foreground">
                  Image Preview
                </span>
              </div>
            </div>
          </div>
        );
      case 'video':
        return (
          <div className="flex h-full items-center justify-center overflow-hidden bg-black">
            {/* In a real app, this would be the actual video player */}
            <div className="relative aspect-video h-auto w-full max-w-4xl">
              <div className="h-full w-full rounded-lg bg-muted/20 flex items-center justify-center">
                <VideoIcon className="h-24 w-24 text-muted-foreground/50" />
                <span className="absolute inset-0 flex items-center justify-center text-lg font-medium text-muted-foreground">
                  Video Preview
                </span>
              </div>
            </div>
          </div>
        );
      case 'document':
        return (
          <div className="flex h-full items-center justify-center overflow-hidden">
            <div className="h-full max-h-[80vh] w-full max-w-3xl rounded-lg border bg-white p-8 shadow-sm dark:bg-muted/20">
              <div className="mb-6 flex justify-center">
                <FileText className="h-16 w-16 text-blue-500" />
              </div>
              <div className="space-y-4">
                <div className="h-4 w-full rounded bg-muted" />
                <div className="h-4 w-3/4 rounded bg-muted" />
                <div className="h-4 w-5/6 rounded bg-muted" />
                <div className="h-4 w-2/3 rounded bg-muted" />
                <div className="h-4 w-full rounded bg-muted" />
                <div className="h-4 w-4/5 rounded bg-muted" />
              </div>
            </div>
          </div>
        );
      case 'spreadsheet':
        return (
          <div className="flex h-full items-center justify-center overflow-hidden">
            <div className="h-full max-h-[80vh] w-full max-w-3xl rounded-lg border bg-white p-6 shadow-sm dark:bg-muted/20">
              <div className="mb-6 flex justify-center">
                <Table className="h-16 w-16 text-green-500" />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div key={`spreadsheet-cell-${i}`} className="h-8 rounded border bg-muted/40" />
                ))}
              </div>
            </div>
          </div>
        );
      case 'presentation':
        return (
          <div className="flex h-full items-center justify-center overflow-hidden">
            <div className="aspect-video h-auto w-full max-w-3xl rounded-lg border bg-white p-6 shadow-sm dark:bg-muted/20">
              <div className="mb-6 flex justify-center">
                <Presentation className="h-16 w-16 text-orange-500" />
              </div>
              <div className="space-y-4">
                <div className="h-8 w-2/3 mx-auto rounded bg-muted" />
                <div className="h-40 rounded bg-muted/40" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-16 rounded bg-muted/60" />
                  <div className="h-16 rounded bg-muted/60" />
                </div>
              </div>
            </div>
          </div>
        );
      case 'pdf':
        return (
          <div className="flex h-full items-center justify-center overflow-hidden">
            <div className="h-full max-h-[80vh] w-full max-w-3xl rounded-lg border bg-white p-8 shadow-sm dark:bg-muted/20">
              <div className="mb-6 flex justify-center">
                <FileText className="h-16 w-16 text-red-600" />
              </div>
              <div className="space-y-4">
                <div className="h-6 w-2/3 rounded bg-muted" />
                <div className="h-4 w-full rounded bg-muted" />
                <div className="h-4 w-5/6 rounded bg-muted" />
                <div className="h-4 w-full rounded bg-muted" />
                <div className="h-40 w-full rounded bg-muted/40" />
                <div className="h-4 w-full rounded bg-muted" />
                <div className="h-4 w-3/4 rounded bg-muted" />
              </div>
            </div>
          </div>
        );
      case 'audio':
        return (
          <div className="flex h-full items-center justify-center overflow-hidden">
            <div className="w-full max-w-xl rounded-lg border bg-background p-6 shadow-sm">
              <div className="mb-6 flex justify-center">
                <Music className="h-24 w-24 text-green-500" />
              </div>
              <div className="space-y-4">
                <div className="text-center text-lg font-medium">{file.name}</div>
                <div className="h-2 w-full rounded-full bg-muted">
                  <div className="h-full w-1/3 rounded-full bg-primary" />
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>1:23</span>
                  <span>3:45</span>
                </div>
                <div className="flex items-center justify-center gap-4">
                  <button className="rounded-full p-2 hover:bg-muted">
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button className="rounded-full bg-primary p-3 text-primary-foreground">
                    <div className="h-5 w-5 rounded-full bg-primary-foreground" />
                  </button>
                  <button className="rounded-full p-2 hover:bg-muted">
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      case 'archive':
        return (
          <div className="flex h-full items-center justify-center overflow-hidden">
            <div className="w-full max-w-xl rounded-lg border bg-background p-6 shadow-sm">
              <div className="mb-6 flex justify-center">
                <Archive className="h-24 w-24 text-amber-500" />
              </div>
              <div className="space-y-6">
                <div className="text-center text-lg font-medium">{file.name}</div>
                <div className="rounded-lg border bg-muted/10 p-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <FileIcon className="h-5 w-5 text-muted-foreground" />
                      <div className="text-sm">readme.txt</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <FileIcon className="h-5 w-5 text-muted-foreground" />
                      <div className="text-sm">data.json</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <ImageIcon className="h-5 w-5 text-purple-500" />
                      <div className="text-sm">image.jpg</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <FileIcon className="h-5 w-5 text-blue-500" />
                      <div className="text-sm">document.docx</div>
                    </div>
                  </div>
                </div>
                <button className="w-full rounded-lg bg-primary py-2 text-sm font-medium text-primary-foreground">
                  Extract Archive
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex h-full items-center justify-center">
            <div className="rounded-lg border bg-background p-8 shadow-sm">
              <div className="mb-6 flex justify-center">
                <FileIcon className="h-24 w-24 text-muted-foreground" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-medium">{file.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  This file type cannot be previewed
                </p>
                <button className="mt-4 flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
                  <Download className="h-4 w-4" />
                  Download
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex h-screen w-screen flex-col overflow-hidden bg-background">
      {/* Header */}
      <div className="flex h-14 items-center justify-between border-b px-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
          <h2 className="text-lg font-medium">{file.name}</h2>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted">
            <Download className="h-4 w-4" />
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted">
            <Copy className="h-4 w-4" />
          </button>
          {onShare && (
            <button
              onClick={onShare}
              className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted"
            >
              <Share2 className="h-4 w-4" />
            </button>
          )}
          {onStarToggle && (
            <button
              onClick={onStarToggle}
              className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted"
            >
              <Star
                className={cn(
                  'h-4 w-4',
                  isStarred && 'fill-yellow-400 text-yellow-400'
                )}
              />
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={() => setShowInfo(!showInfo)}
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-lg',
              showInfo ? 'bg-muted' : 'hover:bg-muted'
            )}
          >
            <Info className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="relative flex flex-1 overflow-hidden">
        {/* File preview */}
        <div className="relative flex-1 overflow-auto">{renderPreview()}</div>

        {/* File information sidebar */}
        <div
          className={cn(
            'absolute inset-y-0 right-0 w-80 overflow-auto border-l bg-background p-4 transition-transform duration-300',
            showInfo ? 'translate-x-0' : 'translate-x-full'
          )}
        >
          <h3 className="mb-4 text-lg font-medium">File Information</h3>
          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium">Name</div>
              <div className="text-sm text-muted-foreground">{file.name}</div>
            </div>
            <div>
              <div className="text-sm font-medium">Type</div>
              <div className="text-sm text-muted-foreground">
                {file.type.charAt(0).toUpperCase() + file.type.slice(1)} (.{file.extension})
              </div>
            </div>
            <div>
              <div className="text-sm font-medium">Size</div>
              <div className="text-sm text-muted-foreground">{formatFileSize(file.size)}</div>
            </div>
            <div>
              <div className="text-sm font-medium">Created</div>
              <div className="text-sm text-muted-foreground">{formatDate(file.createdAt)}</div>
            </div>
            <div>
              <div className="text-sm font-medium">Modified</div>
              <div className="text-sm text-muted-foreground">{formatDate(file.modifiedAt)}</div>
            </div>
            <div>
              <div className="text-sm font-medium">Location</div>
              <div className="text-sm text-muted-foreground">{file.path}</div>
            </div>
            <div>
              <div className="text-sm font-medium">Shared With</div>
              <div className="mt-2 flex items-center gap-1">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500">
                  <span className="text-xs font-bold text-white">SK</span>
                </div>
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500 -ml-1">
                  <span className="text-xs font-bold text-white">LP</span>
                </div>
                <span className="ml-2 text-sm text-muted-foreground">2 people</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation buttons */}
      {onPrevious && hasPrevious && (
        <button
          onClick={onPrevious}
          className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 shadow-md hover:bg-background"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      )}
      {onNext && hasNext && (
        <button
          onClick={onNext}
          className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 shadow-md hover:bg-background"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
