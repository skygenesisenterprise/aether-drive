import * as React from "react";
import { DocsHeader } from "@/components/docs/docs-header";
import type { DocsTreeNode } from "@/components/docs/docs-nav";
import { DocsSearch } from "@/components/docs/docs-search";
import { DocsSidebar } from "@/components/docs/docs-sidebar";
import { PanelLeft } from "lucide-react";
import Link from "next/link";

interface DocsLayoutProps {
  tree: DocsTreeNode[];
  children: React.ReactNode;
}

export function DocsLayout({ tree, children }: DocsLayoutProps) {
  return (
    <div className="min-h-screen bg-white text-[#171717] dark:bg-background dark:text-foreground">
      <div className="lg:hidden">
        <DocsHeader tree={tree} />
      </div>
      <div className="grid w-full grid-cols-1 lg:grid-cols-[268px_minmax(0,1fr)]">
        <aside className="hidden border-r border-[#dedede] bg-[#f3f3f3] lg:sticky lg:top-0 lg:block lg:h-screen lg:overflow-y-auto dark:border-border dark:bg-muted/30">
          <div className="px-4 py-5">
            <div className="mb-5 flex items-center justify-between gap-3">
              <Link href="/docs" className="truncate text-sm font-semibold text-[#111111] dark:text-foreground">
                Sky Genesis Enterprise
              </Link>
              <button
                type="button"
                className="inline-flex size-7 items-center justify-center rounded-md text-[#555555] transition-colors hover:bg-[#e7e7e7] hover:text-[#111111] dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-foreground"
                aria-label="Collapse documentation navigation"
              >
                <PanelLeft className="size-4" />
              </button>
            </div>
            <DocsSearch className="mb-7 h-9 w-full sm:w-full" />
            <Link
              href="/docs"
              className="mb-7 flex min-h-9 items-center rounded-md bg-[#d8d8d8] px-2 text-sm font-medium text-[#1f1f1f] dark:bg-accent dark:text-accent-foreground"
            >
              Products
            </Link>
            <DocsSidebar tree={tree} />
          </div>
        </aside>
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
