"use client";

import * as React from "react";
import { DocsLogo } from "@/components/docs/docs-logo";
import type { DocsTreeNode } from "@/components/docs/docs-nav";
import { DocsSidebar } from "@/components/docs/docs-sidebar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";

interface DocsMobileNavProps {
  tree: DocsTreeNode[];
}

export function DocsMobileNav({ tree }: DocsMobileNavProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          className="inline-flex size-9 items-center justify-center rounded-md text-[#656b68] transition-colors hover:bg-[#f2f3ef] hover:text-[#191b1a] dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-foreground lg:hidden"
          aria-label="Open documentation navigation"
        >
          <Menu className="size-4" />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[320px] gap-0 bg-[#fbfbfa] p-0 dark:bg-background">
        <SheetHeader className="border-b border-[#e8e8e3] px-4 py-3 dark:border-border/70">
          <SheetTitle className="flex items-center gap-2 text-sm">
            <DocsLogo />
            Documentation
          </SheetTitle>
        </SheetHeader>
        <div className="h-[calc(100vh-57px)] overflow-y-auto p-4">
          <DocsSidebar tree={tree} onNavigate={() => setOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
