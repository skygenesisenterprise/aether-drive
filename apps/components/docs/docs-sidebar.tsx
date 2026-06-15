"use client";

import * as React from "react";
import type { DocsTreeFolder, DocsTreeNode } from "@/components/docs/docs-nav";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface DocsSidebarProps {
  tree: DocsTreeNode[];
  className?: string;
  onNavigate?: () => void;
}

export function DocsSidebar({ tree, className, onNavigate }: DocsSidebarProps) {
  const pathname = usePathname();

  return (
    <nav className={cn("space-y-2", className)} aria-label="Documentation">
      {tree.map((node, index) => (
        <DocsSidebarNode
          key={getNodeKey(node, index)}
          node={node}
          pathname={pathname}
          onNavigate={onNavigate}
        />
      ))}
    </nav>
  );
}

function DocsSidebarNode({
  node,
  pathname,
  onNavigate,
  depth = 0,
}: {
  node: DocsTreeNode;
  pathname: string;
  onNavigate?: () => void;
  depth?: number;
}) {
  if (node.type === "separator") {
    return (
      <div className={depth === 0 ? "pt-5 first:pt-0" : "pt-3"}>
        {node.title ? (
          <p className="mb-5 px-2 text-sm font-normal text-[#777777] dark:text-muted-foreground">
            {node.title}
          </p>
        ) : (
          <div className="my-3 h-px bg-[#e8e8e3] dark:bg-border" />
        )}
      </div>
    );
  }

  if (node.type === "page") {
    const active = pathname === node.url;

    return (
      <Link
        href={node.url}
        target={node.external ? "_blank" : undefined}
        rel={node.external ? "noreferrer" : undefined}
        onClick={onNavigate}
        aria-current={active ? "page" : undefined}
        className={cn(
          "group flex min-h-8 items-center rounded-md px-2 py-1.5 text-sm transition-colors",
          active
            ? "bg-[#d8d8d8] font-normal text-[#171717] dark:bg-accent dark:text-accent-foreground"
            : "font-normal text-[#777777] hover:bg-[#e7e7e7] hover:text-[#171717] dark:text-muted-foreground dark:hover:bg-muted/70 dark:hover:text-foreground",
        )}
        style={{ paddingLeft: `${8 + depth * 14}px` }}
      >
        <span className="truncate">{node.title}</span>
      </Link>
    );
  }

  return (
    <DocsSidebarFolder
      folder={node}
      pathname={pathname}
      onNavigate={onNavigate}
      depth={depth}
    />
  );
}

function DocsSidebarFolder({
  folder,
  pathname,
  onNavigate,
  depth,
}: {
  folder: DocsTreeFolder;
  pathname: string;
  onNavigate?: () => void;
  depth: number;
}) {
  const containsActive = hasActivePage(folder.children, pathname);
  const [open, setOpen] = React.useState(
    folder.defaultOpen || containsActive || folder.collapsible === false,
  );
  const isCollapsible = folder.collapsible !== false;

  React.useEffect(() => {
    if (containsActive) {
      setOpen(true);
    }
  }, [containsActive]);

  return (
    <div>
      <div
        className="flex min-h-8 items-center gap-1 rounded-md px-2 py-1.5 text-sm font-normal text-[#171717] dark:text-foreground"
        style={{ paddingLeft: `${8 + depth * 14}px` }}
      >
        {isCollapsible ? (
          <button
            type="button"
            className="mr-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded text-[#777777] transition-colors hover:bg-[#e7e7e7] hover:text-[#171717] dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-foreground"
            aria-label={open ? "Close section" : "Open section"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            <ChevronRight
              className={cn("size-3.5 transition-transform", open && "rotate-90")}
            />
          </button>
        ) : (
          <span className="mr-0.5 size-5 shrink-0" />
        )}
        {folder.url ? (
          <Link
            href={folder.url}
            onClick={onNavigate}
            className={cn(
              "truncate transition-colors hover:text-[#171717]",
              pathname === folder.url && "text-[#171717]",
            )}
          >
            {folder.title}
          </Link>
        ) : (
          <span className="truncate">{folder.title}</span>
        )}
      </div>
      {open ? (
        <div className="mt-0.5 space-y-0.5">
          {folder.children.map((child, index) => (
            <DocsSidebarNode
              key={getNodeKey(child, index)}
              node={child}
              pathname={pathname}
              onNavigate={onNavigate}
              depth={depth + 1}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function hasActivePage(nodes: DocsTreeNode[], pathname: string): boolean {
  return nodes.some((node) => {
    if (node.type === "page") {
      return node.url === pathname;
    }

    if (node.type === "folder") {
      return node.url === pathname || hasActivePage(node.children, pathname);
    }

    return false;
  });
}

function getNodeKey(node: DocsTreeNode, index: number) {
  if (node.type === "page") {
    return node.url;
  }

  return `${node.type}-${node.title ?? index}-${index}`;
}
