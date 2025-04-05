import { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Upload,
  Download,
  Trash2,
  Plus,
  FolderPlus,
  List,
  Grid,
  Pencil,
  ArrowDown,
  ArrowUp,
  MoreHorizontal,
  Folder,
  FileText,
  Image,
  File,
  Share2
} from 'lucide-react';
import { FileCard } from './FileCard';
import { FolderCard } from './FolderCard';
import { UploadModal } from './UploadModal';
import { FilePreview } from './FilePreview';
import { ShareModal } from './ShareModal';
import { cn } from '../../lib/utils';
import { getItemsByParentId, type FileItem, type FolderItem } from '../../lib/data';

interface FileExplorerProps {
  currentPath?: string;
  parentFolderId?: string | null;
}

type ViewMode = 'grid' | 'list';
type SortField = 'name' | 'date' | 'size' | 'type';
type SortOrder = 'asc' | 'desc';

export function FileExplorer({
  currentPath = '/',
  parentFolderId = null
}: FileExplorerProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [itemToShare, setItemToShare] = useState<FileItem | FolderItem | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);
  const [currentFileIndex, setCurrentFileIndex] = useState<number>(-1);

  // Get items for the current folder
  const items = getItemsByParentId(parentFolderId);

  // Get only files (for preview navigation)
  const fileItems = items.filter((item) => 'type' in item) as FileItem[];

  // Sort the items
  const sortedItems = [...items].sort((a, b) => {
    if (sortField === 'name') {
      return sortOrder === 'asc'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    }

    if (sortField === 'date') {
      return sortOrder === 'asc'
        ? a.modifiedAt.getTime() - b.modifiedAt.getTime()
        : b.modifiedAt.getTime() - a.modifiedAt.getTime();
    }

    if (sortField === 'size' && 'size' in a && 'size' in b) {
      return sortOrder === 'asc' ? a.size - b.size : b.size - a.size;
    }

    if (sortField === 'type') {
      const aType = 'type' in a ? a.type : 'folder';
      const bType = 'type' in b ? b.type : 'folder';
      return sortOrder === 'asc'
        ? aType.localeCompare(bType)
        : bType.localeCompare(aType);
    }

    return 0;
  });

  const handleFileSelect = (file: FileItem) => {
    // Find the index of the selected file in the fileItems array
    const fileIndex = fileItems.findIndex((f) => f.id === file.id);
    setCurrentFileIndex(fileIndex);
    setPreviewFile(file);
  };

  const handleFolderSelect = (folder: FolderItem) => {
    console.log('Selected folder:', folder);
    // Here you would typically navigate to the folder
  };

  const handleSortChange = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Handle upload button click
  const handleUploadClick = () => {
    setUploadModalOpen(true);
  };

  // Handle upload completion
  const handleUploadComplete = (files: File[]) => {
    console.log('Upload complete:', files);
    setUploadedFiles(files);

    // Here you would typically send the files to a server
    // and then update the UI with the new files
  };

  // Handle file share
  const handleShareClick = (item: FileItem | FolderItem) => {
    setItemToShare(item);
    setShareModalOpen(true);
  };

  // Handle file preview navigation
  const handleNextFile = () => {
    if (currentFileIndex < fileItems.length - 1) {
      const nextIndex = currentFileIndex + 1;
      setCurrentFileIndex(nextIndex);
      setPreviewFile(fileItems[nextIndex]);
    }
  };

  const handlePreviousFile = () => {
    if (currentFileIndex > 0) {
      const prevIndex = currentFileIndex - 1;
      setCurrentFileIndex(prevIndex);
      setPreviewFile(fileItems[prevIndex]);
    }
  };

  // Handle file starring
  const handleStarToggle = () => {
    if (previewFile) {
      // Here you would typically update the file's starred status in the database
      console.log('Toggling star status for:', previewFile.name);
      // For demo purposes, we'll just toggle the star in the UI
      setPreviewFile({
        ...previewFile,
        isStarred: !previewFile.isStarred,
      });
    }
  };

  // Handle file sharing from preview
  const handleShare = () => {
    if (previewFile) {
      setItemToShare(previewFile);
      setShareModalOpen(true);
    }
  };

  // Handle file deletion
  const handleDelete = () => {
    if (previewFile) {
      console.log('Deleting file:', previewFile.name);
      // Here you would typically confirm deletion and then delete the file
      setPreviewFile(null);
    }
  };

  // Render action buttons for each item in list view
  const renderItemActions = (item: FileItem | FolderItem) => (
    <div className="flex gap-1">
      <button
        className="rounded-full p-1 hover:bg-muted"
        onClick={(e) => {
          e.stopPropagation();
          handleShareClick(item);
        }}
      >
        <Share2 className="h-3 w-3 text-muted-foreground" />
      </button>
      <button
        className="rounded-full p-1 hover:bg-muted"
        onClick={(e) => {
          e.stopPropagation();
          console.log('Edit clicked');
        }}
      >
        <Pencil className="h-3 w-3 text-muted-foreground" />
      </button>
      <button
        className="rounded-full p-1 hover:bg-muted"
        onClick={(e) => {
          e.stopPropagation();
          console.log('More clicked');
        }}
      >
        <MoreHorizontal className="h-3 w-3 text-muted-foreground" />
      </button>
    </div>
  );

  return (
    <div className="flex flex-col">
      {/* Breadcrumb navigation */}
      <div className="mb-4 flex items-center text-sm">
        <button className="mr-1 flex h-6 w-6 items-center justify-center rounded-full hover:bg-muted">
          <ChevronLeft className="h-3 w-3" />
        </button>
        <button className="mr-4 flex h-6 w-6 items-center justify-center rounded-full hover:bg-muted opacity-50">
          <ChevronRight className="h-3 w-3" />
        </button>
        <div className="flex items-center">
          <span className="text-muted-foreground">Home</span>
          {currentPath !== '/' && (
            <>
              <span className="mx-1 text-muted-foreground">/</span>
              <span>{currentPath.split('/').filter(Boolean).join(' / ')}</span>
            </>
          )}
        </div>
      </div>

      {/* Actions toolbar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border bg-background p-2">
        <div className="flex items-center gap-2">
          <button
            className="flex h-8 items-center gap-2 rounded-lg px-3 hover:bg-muted"
            onClick={handleUploadClick}
          >
            <Upload className="h-4 w-4" />
            <span className="text-xs font-medium">Upload</span>
          </button>
          <button className="flex h-8 items-center gap-2 rounded-lg px-3 hover:bg-muted">
            <Download className="h-4 w-4" />
            <span className="text-xs font-medium">Download</span>
          </button>
          <button className="flex h-8 items-center gap-2 rounded-lg px-3 hover:bg-muted">
            <Trash2 className="h-4 w-4" />
            <span className="text-xs font-medium">Delete</span>
          </button>
          <button
            className="flex h-8 items-center gap-2 rounded-lg px-3 hover:bg-muted"
            onClick={() => items.length > 0 && handleShareClick(items[0])}
          >
            <Share2 className="h-4 w-4" />
            <span className="text-xs font-medium">Share</span>
          </button>
          <div className="relative">
            <button className="flex h-8 items-center gap-2 rounded-lg px-3 hover:bg-muted">
              <Plus className="h-4 w-4" />
              <span className="text-xs font-medium">New</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex h-8 items-center rounded-lg border">
            <button
              onClick={() => handleSortChange('name')}
              className={cn(
                "flex items-center gap-1 px-2 text-xs",
                sortField === 'name' && "font-medium"
              )}
            >
              Name
              {sortField === 'name' && (
                sortOrder === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
              )}
            </button>
            <span className="h-4 w-px bg-border" />
            <button
              onClick={() => handleSortChange('date')}
              className={cn(
                "flex items-center gap-1 px-2 text-xs",
                sortField === 'date' && "font-medium"
              )}
            >
              Date
              {sortField === 'date' && (
                sortOrder === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
              )}
            </button>
            <span className="h-4 w-px bg-border" />
            <button
              onClick={() => handleSortChange('type')}
              className={cn(
                "flex items-center gap-1 px-2 text-xs",
                sortField === 'type' && "font-medium"
              )}
            >
              Type
              {sortField === 'type' && (
                sortOrder === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
              )}
            </button>
          </div>

          <div className="flex h-8 items-center rounded-lg border p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                "flex h-6 w-6 items-center justify-center rounded",
                viewMode === 'grid' && "bg-muted"
              )}
            >
              <Grid className="h-3 w-3" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                "flex h-6 w-6 items-center justify-center rounded",
                viewMode === 'list' && "bg-muted"
              )}
            >
              <List className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Files and folders grid */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {sortedItems.map((item) => (
            'type' in item ? (
              <div key={item.id} className="group relative">
                <FileCard
                  file={item}
                  onSelectFile={handleFileSelect}
                />
                <div className="absolute right-3 top-3 hidden gap-1 group-hover:flex">
                  <button
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-background/80 shadow-sm hover:bg-background"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShareClick(item);
                    }}
                  >
                    <Share2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-background/80 shadow-sm hover:bg-background"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('More clicked', item);
                    }}
                  >
                    <MoreHorizontal className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div key={item.id} className="group relative">
                <FolderCard
                  folder={item}
                  onSelectFolder={handleFolderSelect}
                />
                <div className="absolute right-3 top-3 hidden gap-1 group-hover:flex">
                  <button
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-background/80 shadow-sm hover:bg-background"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShareClick(item);
                    }}
                  >
                    <Share2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-background/80 shadow-sm hover:bg-background"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('More clicked', item);
                    }}
                  >
                    <MoreHorizontal className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )
          ))}
          {uploadedFiles.length > 0 && (
            <div className="rounded-2xl border bg-background p-4 shadow-sm">
              <div className="text-sm font-medium mb-2">Recently Uploaded</div>
              <div className="text-xs text-muted-foreground">
                {uploadedFiles.length} file(s) waiting to be processed
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-xl border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/40">
                <th className="px-4 py-3 text-left text-xs font-medium">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium">Modified</th>
                <th className="hidden px-4 py-3 text-left text-xs font-medium sm:table-cell">Size</th>
                <th className="hidden px-4 py-3 text-right text-xs font-medium sm:table-cell">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedItems.map((item) => (
                <tr
                  key={item.id}
                  className="border-b hover:bg-muted/50 cursor-pointer"
                  onClick={() => 'type' in item ? handleFileSelect(item) : handleFolderSelect(item)}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {'type' in item ? (
                        item.type === 'document' ? (
                          <FileText className="h-5 w-5 text-blue-500" />
                        ) : item.type === 'image' ? (
                          <Image className="h-5 w-5 text-purple-500" />
                        ) : item.type === 'spreadsheet' ? (
                          <List className="h-5 w-5 text-green-500" />
                        ) : (
                          <File className="h-5 w-5 text-gray-500" />
                        )
                      ) : (
                        <Folder className="h-5 w-5 text-aether-primary" />
                      )}
                      <span className="font-medium">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {new Intl.DateTimeFormat('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    }).format(item.modifiedAt)}
                  </td>
                  <td className="hidden px-4 py-3 text-sm text-muted-foreground sm:table-cell">
                    {'size' in item ? (
                      item.size < 1024
                        ? `${item.size} B`
                        : item.size < 1024 * 1024
                        ? `${(item.size / 1024).toFixed(1)} KB`
                        : `${(item.size / (1024 * 1024)).toFixed(1)} MB`
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="hidden px-4 py-3 text-right sm:table-cell">
                    {renderItemActions(item)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty state */}
      {items.length === 0 && uploadedFiles.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border bg-muted/20 py-16">
          <FolderPlus className="mb-4 h-10 w-10 text-muted-foreground/70" />
          <h3 className="text-lg font-medium">This folder is empty</h3>
          <p className="mt-1 text-muted-foreground">Upload files or create folders to get started</p>
          <div className="mt-6 flex gap-3">
            <button
              className="flex h-9 items-center gap-2 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground"
              onClick={handleUploadClick}
            >
              <Upload className="h-4 w-4" />
              <span>Upload Files</span>
            </button>
            <button className="flex h-9 items-center gap-2 rounded-lg border px-3 text-sm font-medium">
              <FolderPlus className="h-4 w-4" />
              <span>New Folder</span>
            </button>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      <UploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onUploadComplete={handleUploadComplete}
        currentFolderId={parentFolderId}
      />

      {/* Share Modal */}
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        item={itemToShare}
      />

      {/* File Preview */}
      <FilePreview
        file={previewFile}
        onClose={() => setPreviewFile(null)}
        onNext={handleNextFile}
        onPrevious={handlePreviousFile}
        hasNext={currentFileIndex < fileItems.length - 1}
        hasPrevious={currentFileIndex > 0}
        isStarred={previewFile?.isStarred}
        onStarToggle={handleStarToggle}
        onDelete={handleDelete}
        onShare={handleShare}
      />
    </div>
  );
}
