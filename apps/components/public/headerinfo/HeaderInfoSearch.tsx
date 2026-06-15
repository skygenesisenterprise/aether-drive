"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";

interface HeaderInfoSearchProps {
  searchLabel: string;
  closeSearchLabel: string;
}

export function HeaderInfoSearch({ searchLabel, closeSearchLabel }: HeaderInfoSearchProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="relative flex items-center">
      {isSearchOpen ? (
        <div className="flex items-center gap-2 animate-in slide-in-from-right-4 fade-in duration-200">
          <input
            type="text"
            placeholder={searchLabel}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-7 px-3 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary w-48"
            autoFocus
          />
          <button
            onClick={() => {
              setIsSearchOpen(false);
              setSearchQuery("");
            }}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label={closeSearchLabel}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          aria-label={searchLabel}
        >
          <Search className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
