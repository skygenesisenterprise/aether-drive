// Types
export type FileType =
  | "image"
  | "document"
  | "spreadsheet"
  | "presentation"
  | "pdf"
  | "audio"
  | "video"
  | "archive"
  | "code"
  | "other";

export interface FileItem {
  id: string;
  name: string;
  type: FileType;
  size: number;
  extension: string;
  isStarred: boolean;
  createdAt: Date;
  modifiedAt: Date;
  path: string;
  parentId: string | null;
}

export interface FolderItem {
  id: string;
  name: string;
  isStarred: boolean;
  createdAt: Date;
  modifiedAt: Date;
  path: string;
  parentId: string | null;
}

export type StorageItem = FileItem | FolderItem;

// Mock data
export const folders: FolderItem[] = [
  {
    id: "folder-1",
    name: "Documents",
    isStarred: true,
    createdAt: new Date("2024-01-15"),
    modifiedAt: new Date("2024-03-20"),
    path: "/Documents",
    parentId: null,
  },
  {
    id: "folder-2",
    name: "Images",
    isStarred: false,
    createdAt: new Date("2024-02-10"),
    modifiedAt: new Date("2024-03-15"),
    path: "/Images",
    parentId: null,
  },
  {
    id: "folder-3",
    name: "Projects",
    isStarred: true,
    createdAt: new Date("2024-01-05"),
    modifiedAt: new Date("2024-03-25"),
    path: "/Projects",
    parentId: null,
  },
  {
    id: "folder-4",
    name: "Work Documents",
    isStarred: false,
    createdAt: new Date("2024-01-18"),
    modifiedAt: new Date("2024-03-10"),
    path: "/Documents/Work Documents",
    parentId: "folder-1",
  },
  {
    id: "folder-5",
    name: "Personal",
    isStarred: false,
    createdAt: new Date("2024-02-05"),
    modifiedAt: new Date("2024-03-01"),
    path: "/Documents/Personal",
    parentId: "folder-1",
  },
  {
    id: "folder-6",
    name: "Vacation Photos",
    isStarred: true,
    createdAt: new Date("2024-02-12"),
    modifiedAt: new Date("2024-03-05"),
    path: "/Images/Vacation Photos",
    parentId: "folder-2",
  },
];

export const files: FileItem[] = [
  {
    id: "file-1",
    name: "Quarterly Report",
    type: "document",
    size: 2500000,
    extension: "docx",
    isStarred: true,
    createdAt: new Date("2024-03-10"),
    modifiedAt: new Date("2024-03-15"),
    path: "/Documents/Work Documents/Quarterly Report.docx",
    parentId: "folder-4",
  },
  {
    id: "file-2",
    name: "Budget 2024",
    type: "spreadsheet",
    size: 1800000,
    extension: "xlsx",
    isStarred: false,
    createdAt: new Date("2024-02-25"),
    modifiedAt: new Date("2024-03-01"),
    path: "/Documents/Work Documents/Budget 2024.xlsx",
    parentId: "folder-4",
  },
  {
    id: "file-3",
    name: "Company Presentation",
    type: "presentation",
    size: 3500000,
    extension: "pptx",
    isStarred: true,
    createdAt: new Date("2024-03-05"),
    modifiedAt: new Date("2024-03-12"),
    path: "/Documents/Work Documents/Company Presentation.pptx",
    parentId: "folder-4",
  },
  {
    id: "file-4",
    name: "Beach Sunset",
    type: "image",
    size: 4200000,
    extension: "jpg",
    isStarred: false,
    createdAt: new Date("2024-02-15"),
    modifiedAt: new Date("2024-02-15"),
    path: "/Images/Vacation Photos/Beach Sunset.jpg",
    parentId: "folder-6",
  },
  {
    id: "file-5",
    name: "Mountain View",
    type: "image",
    size: 3800000,
    extension: "jpg",
    isStarred: true,
    createdAt: new Date("2024-02-15"),
    modifiedAt: new Date("2024-02-15"),
    path: "/Images/Vacation Photos/Mountain View.jpg",
    parentId: "folder-6",
  },
  {
    id: "file-6",
    name: "Project Proposal",
    type: "pdf",
    size: 1500000,
    extension: "pdf",
    isStarred: false,
    createdAt: new Date("2024-03-01"),
    modifiedAt: new Date("2024-03-20"),
    path: "/Projects/Project Proposal.pdf",
    parentId: "folder-3",
  },
  {
    id: "file-7",
    name: "Architecture Diagram",
    type: "image",
    size: 2200000,
    extension: "png",
    isStarred: false,
    createdAt: new Date("2024-03-10"),
    modifiedAt: new Date("2024-03-15"),
    path: "/Projects/Architecture Diagram.png",
    parentId: "folder-3",
  },
  {
    id: "file-8",
    name: "Project Timeline",
    type: "spreadsheet",
    size: 1200000,
    extension: "xlsx",
    isStarred: true,
    createdAt: new Date("2024-03-05"),
    modifiedAt: new Date("2024-03-18"),
    path: "/Projects/Project Timeline.xlsx",
    parentId: "folder-3",
  },
  {
    id: "file-9",
    name: "Resume",
    type: "document",
    size: 750000,
    extension: "pdf",
    isStarred: true,
    createdAt: new Date("2024-01-10"),
    modifiedAt: new Date("2024-02-20"),
    path: "/Documents/Personal/Resume.pdf",
    parentId: "folder-5",
  },
  {
    id: "file-10",
    name: "Tax Documents",
    type: "pdf",
    size: 1900000,
    extension: "pdf",
    isStarred: false,
    createdAt: new Date("2024-01-20"),
    modifiedAt: new Date("2024-01-20"),
    path: "/Documents/Personal/Tax Documents.pdf",
    parentId: "folder-5",
  },
  {
    id: "file-11",
    name: "Holiday Video",
    type: "video",
    size: 158000000,
    extension: "mp4",
    isStarred: false,
    createdAt: new Date("2024-02-16"),
    modifiedAt: new Date("2024-02-16"),
    path: "/Images/Vacation Photos/Holiday Video.mp4",
    parentId: "folder-6",
  },
  {
    id: "file-12",
    name: "Project Source Code",
    type: "archive",
    size: 5500000,
    extension: "zip",
    isStarred: false,
    createdAt: new Date("2024-03-12"),
    modifiedAt: new Date("2024-03-12"),
    path: "/Projects/Project Source Code.zip",
    parentId: "folder-3",
  },
];

// Get current folder items
export function getItemsByParentId(parentId: string | null): StorageItem[] {
  const folderItems = folders.filter(folder => folder.parentId === parentId);
  const fileItems = files.filter(file => file.parentId === parentId);

  return [...folderItems, ...fileItems].sort((a, b) => {
    // Sort folders first, then files
    const aIsFolder = !('type' in a);
    const bIsFolder = !('type' in b);

    if (aIsFolder && !bIsFolder) return -1;
    if (!aIsFolder && bIsFolder) return 1;

    // Then sort by name
    return a.name.localeCompare(b.name);
  });
}

// Search items
export function searchItems(query: string): StorageItem[] {
  const lowercaseQuery = query.toLowerCase();

  const matchedFolders = folders.filter(folder =>
    folder.name.toLowerCase().includes(lowercaseQuery)
  );

  const matchedFiles = files.filter(file =>
    file.name.toLowerCase().includes(lowercaseQuery) ||
    file.extension.toLowerCase().includes(lowercaseQuery)
  );

  return [...matchedFolders, ...matchedFiles];
}

// Get starred items
export function getStarredItems(): StorageItem[] {
  const starredFolders = folders.filter(folder => folder.isStarred);
  const starredFiles = files.filter(file => file.isStarred);

  return [...starredFolders, ...starredFiles];
}

// Get recent files
export function getRecentFiles(limit = 5): FileItem[] {
  return [...files]
    .sort((a, b) => b.modifiedAt.getTime() - a.modifiedAt.getTime())
    .slice(0, limit);
}
