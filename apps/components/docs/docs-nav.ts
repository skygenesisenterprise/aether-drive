export interface DocsNavPage {
  title: string;
  description?: string;
  url: string;
  slugs: string[];
}

export type DocsTreeNode = DocsTreePage | DocsTreeFolder | DocsTreeSeparator;

export interface DocsTreePage {
  type: "page";
  title: string;
  url: string;
  external?: boolean;
}

export interface DocsTreeFolder {
  type: "folder";
  title: string;
  url?: string;
  defaultOpen?: boolean;
  collapsible?: boolean;
  children: DocsTreeNode[];
}

export interface DocsTreeSeparator {
  type: "separator";
  title?: string;
}
