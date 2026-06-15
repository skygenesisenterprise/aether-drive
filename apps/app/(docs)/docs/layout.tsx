import * as React from "react";
import { DocsLayout } from "@/components/docs/docs-layout";
import type { DocsTreeNode } from "@/components/docs/docs-nav";
import { source } from "@/lib/source";
import type { Root } from "fumadocs-core/page-tree";

const tree = normalizeDocsTree(source.pageTree);

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DocsLayout tree={tree}>{children}</DocsLayout>;
}

function normalizeDocsTree(root: Root): DocsTreeNode[] {
  return root.children.map(normalizeDocsNode).filter(Boolean) as DocsTreeNode[];
}

function normalizeDocsNode(node: Root["children"][number]): DocsTreeNode | null {
  if (node.type === "separator") {
    return {
      type: "separator",
      title: getNodeText(node.name),
    };
  }

  if (node.type === "page") {
    return {
      type: "page",
      title: getNodeText(node.name) || "Untitled",
      url: node.url,
      external: node.external,
    };
  }

  const children = node.children
    .map(normalizeDocsNode)
    .filter(Boolean) as DocsTreeNode[];

  if (node.index) {
    children.unshift({
      type: "page",
      title: getNodeText(node.index.name) || "Overview",
      url: node.index.url,
      external: node.index.external,
    });
  }

  return {
    type: "folder",
    title: getNodeText(node.name) || "Section",
    url: node.index?.url,
    defaultOpen: node.defaultOpen || node.root,
    collapsible: node.collapsible,
    children,
  };
}

function getNodeText(value: React.ReactNode): string {
  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number") {
    return String(value);
  }

  return "";
}
