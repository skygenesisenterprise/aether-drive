import { useState } from 'react';
import { MoreVertical, Star, Folder } from 'lucide-react';
import { cn } from '../../../lib/utils';
import type { FolderItem } from '../../../lib/data';
import { formatDate } from '../../../lib/utils';

interface FolderCardProps {
  folder: FolderItem;
  onSelectFolder?: (folder: FolderItem) => void;
}

export function FolderCard({ folder, onSelectFolder }: FolderCardProps) {
  const [isStarred, setIsStarred] = useState(folder.isStarred);

  const handleStarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsStarred(!isStarred);
  };

  return (
    <div
      className="group relative flex flex-col rounded-2xl border bg-background p-4 shadow-sm transition-all hover:shadow-md"
      onClick={() => onSelectFolder?.(folder)}
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Folder className="h-6 w-6 text-aether-primary" />
          <div>
            <h3 className="font-medium line-clamp-1">{folder.name}</h3>
            <p className="text-xs text-muted-foreground">
              Modified {formatDate(folder.modifiedAt)}
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

      <div className="rounded-xl bg-blue-50 dark:bg-blue-950/30 p-6 flex items-center justify-center mb-3">
        <Folder className="h-8 w-8 text-aether-primary" />
      </div>

      <div className="mt-auto flex items-center gap-1">
        <div className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-500">
          <span className="text-[8px] font-bold text-white">SK</span>
        </div>
        <span className="text-xs text-muted-foreground ml-1">Created by you</span>
      </div>
    </div>
  );
}
