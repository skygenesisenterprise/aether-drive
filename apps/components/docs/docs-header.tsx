"use client";

import * as React from "react";
import { DocsLogo } from "@/components/docs/docs-logo";
import { DocsMobileNav } from "@/components/docs/docs-mobile-nav";
import type { DocsTreeNode } from "@/components/docs/docs-nav";
import { DocsSearch } from "@/components/docs/docs-search";
import { GitHubIcon } from "@/components/ui/icons/GitHubIcon";
import { ExternalLink, Layers } from "lucide-react";
import Link from "next/link";

interface DocsHeaderProps {
  tree: DocsTreeNode[];
}

export function DocsHeader({ tree }: DocsHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-[#e8e8e3] bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/88 dark:border-border dark:bg-background/90">
      <div className="mx-auto grid h-14 max-w-[1504px] grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 sm:px-6 lg:grid-cols-[296px_minmax(280px,520px)_minmax(0,1fr)] lg:px-6">
        <div className="flex min-w-0 items-center gap-2">
          <DocsMobileNav tree={tree} />

          <Link href="/docs" className="flex min-w-0 items-center gap-2">
            <DocsLogo />
            <span className="truncate text-sm font-semibold">SGE Docs</span>
          </Link>
        </div>

        <DocsSearch className="hidden md:inline-flex" />

        <div className="flex items-center justify-end gap-1">
          <Link
            href="/docs"
            className="hidden h-8 items-center gap-2 rounded-md px-2.5 text-sm font-medium text-[#2f3432] transition-colors hover:bg-[#f2f3ef] dark:text-foreground dark:hover:bg-muted md:inline-flex"
          >
            <Layers className="size-4 text-[#2f8f5b]" />
            Core
          </Link>
          <DocsSearch compact className="md:hidden" />
          <Link
            href="/fr"
            className="hidden h-8 items-center gap-2 rounded-md px-2.5 text-sm text-[#656b68] transition-colors hover:bg-[#f2f3ef] hover:text-[#191b1a] dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-foreground sm:inline-flex"
          >
            <ExternalLink className="size-4" />
            Website
          </Link>
          <a
            href="https://github.com/skygenesisenterprise/company-website"
            target="_blank"
            rel="noreferrer"
            className="inline-flex size-8 items-center justify-center rounded-md text-[#656b68] transition-colors hover:bg-[#f2f3ef] hover:text-[#191b1a] dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-foreground"
            aria-label="Open GitHub repository"
          >
            <GitHubIcon className="size-4" />
          </a>
        </div>
      </div>
    </header>
  );
}
