import * as React from "react";
import type { TableOfContents } from "fumadocs-core/toc";
import { List } from "lucide-react";

interface DocsTocProps {
  toc?: TableOfContents;
}

export function DocsToc({ toc = [] }: DocsTocProps) {
  if (toc.length === 0) {
    return null;
  }

  return (
    <nav aria-label="On this page" className="text-sm">
      <p className="mb-4 flex items-center gap-2 font-normal text-[#777777] dark:text-muted-foreground">
        <List className="size-4" />
        On this page
      </p>
      <div className="space-y-3 border-l border-[#e0e0e0] dark:border-border">
        {toc.map((item) => (
          <a
            key={item.url}
            href={item.url}
            className="block py-0.5 pr-2 text-[#777777] transition-colors hover:text-[#171717] focus-visible:text-[#171717] dark:text-muted-foreground dark:hover:text-foreground"
            style={{ paddingLeft: `${12 + Math.max(item.depth - 2, 0) * 12}px` }}
          >
            {item.title}
          </a>
        ))}
      </div>
    </nav>
  );
}
