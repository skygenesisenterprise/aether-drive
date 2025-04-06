import { useState } from 'react';
import { MoreVertical, Star, File, FileText, Image, Video, Archive, Table, Presentation } from 'lucide-react';
import { cn } from '../../../lib/utils';
import type { FileItem } from '../../../lib/data';
import { formatFileSize, formatDate } from '../../../lib/utils';

interface FileCardProps {
  file: FileItem;
  onSelectFile?: (file: FileItem) => void;
}

export function FileCard({ file, onSelectFile }: FileCardProps) {
  const [isStarred, setIsStarred] = useState(file.isStarred);

  const handleStarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsStarred(!isStarred);
  };

  const getFileIcon = () => {
    switch (file.type) {
      case 'document':
        return <FileText className="h-6 w-6 text-blue-500" />;
      case 'spreadsheet':
        return <Table className="h-6 w-6 text-green-500" />;
      case 'presentation':
        return <Presentation className="h-6 w-6 text-orange-500" />;
      case 'image':
        return <Image className="h-6 w-6 text-purple-500" />;
      case 'video':
        return <Video className="h-6 w-6 text-red-500" />;
      case 'pdf':
        return <FileText className="h-6 w-6 text-red-600" />;
      case 'archive':
        return <Archive className="h-6 w-6 text-amber-500" />;
      default:
        return <File className="h-6 w-6 text-gray-500" />;
    }
  };

  return (
    <div
      className="group relative flex flex-col rounded-2xl border bg-background p-4 shadow-sm transition-all hover:shadow-md"
      onClick={() => onSelectFile?.(file)}
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {getFileIcon()}
          <div>
            <h3 className="font-medium line-clamp-1">{file.name}</h3>
            <p className="text-xs text-muted-foreground">
              {formatFileSize(file.size)} • {formatDate(file.modifiedAt)}
            </p>
          </div>
        </div>
        <div className="flex items-center">
          <button
            onClick={handleStarClick}
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-full transition-colors",
              "opacity-0 group-hover:opacity-100",
              isStarred && "opacity-100"
            )}
          >
            <Star
              className={cn(
                "h-4 w-4",
                isStarred
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-muted-foreground"
              )}
            />
          </button>
          <button className="flex h-7 w-7 items-center justify-center rounded-full opacity-0 transition-opacity group-hover:opacity-100 hover:bg-muted">
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="rounded-xl bg-muted p-6 flex items-center justify-center mb-3">
        <div className="text-xs uppercase font-medium text-muted-foreground">
          {file.extension}
        </div>
      </div>

      <div className="mt-auto flex items-center gap-1">
        <div className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-500">
          <span className="text-[8px] font-bold text-white">SK</span>
        </div>
        <div className="flex h-4 w-4 items-center justify-center rounded-full bg-green-500 -ml-1">
          <span className="text-[8px] font-bold text-white">LP</span>
        </div>
        <span className="text-xs text-muted-foreground ml-1">Shared with 2 people</span>
      </div>
    </div>
  );
}
