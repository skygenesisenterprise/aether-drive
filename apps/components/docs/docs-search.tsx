"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { useSearchContext } from "fumadocs-ui/contexts/search";

interface DocsSearchProps {
  className?: string;
  compact?: boolean;
}

export function DocsSearch({ className, compact = false }: DocsSearchProps) {
  const { setOpenSearch } = useSearchContext();

  return (
    <button
      type="button"
      className={cn(
        "group inline-flex h-9 items-center gap-2 rounded-md border border-[#dddddd] bg-[#f8f8f8] px-3 text-sm text-[#777777] shadow-xs transition-colors hover:border-[#cfcfcf] hover:bg-white hover:text-[#171717] dark:border-border dark:bg-background dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-foreground",
        compact ? "w-9 justify-center px-0" : "w-full justify-between sm:w-[29rem]",
        className,
      )}
      onClick={() => setOpenSearch(true)}
      aria-label="Search documentation"
    >
      <span className="flex min-w-0 items-center gap-2">
        <Search className="size-4 shrink-0" />
        {compact ? null : <span className="truncate">Search documentation</span>}
      </span>
      {compact ? null : (
        <span className="hidden items-center gap-1 sm:inline-flex">
          <kbd className="rounded border border-[#d8d8d8] bg-[#efefef] px-1.5 py-0.5 font-mono text-[10px] text-[#777777] dark:border-border dark:bg-muted dark:text-muted-foreground">
            Ctrl
          </kbd>
          <kbd className="rounded border border-[#d8d8d8] bg-[#efefef] px-1.5 py-0.5 font-mono text-[10px] text-[#777777] dark:border-border dark:bg-muted dark:text-muted-foreground">
            K
          </kbd>
        </span>
      )}
    </button>
  );
}
