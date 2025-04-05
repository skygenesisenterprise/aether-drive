import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class values into a single string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats bytes to a human-readable string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${Number.parseFloat((bytes / (k ** i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Formats a date to a readable string
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

/**
 * Returns the file extension from a filename
 */
export function getFileExtension(filename: string): string {
  return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
}

/**
 * Returns the file icon based on its type
 */
export function getFileTypeIcon(filename: string): string {
  const extension = getFileExtension(filename).toLowerCase();

  switch (extension) {
    case "pdf":
      return "file-text";
    case "doc":
    case "docx":
      return "file-text";
    case "xls":
    case "xlsx":
      return "table";
    case "ppt":
    case "pptx":
      return "file-presentation";
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
    case "webp":
      return "image";
    case "mp4":
    case "avi":
    case "mov":
    case "wmv":
      return "video";
    case "mp3":
    case "wav":
    case "ogg":
      return "audio";
    case "zip":
    case "rar":
    case "7z":
      return "archive";
    default:
      return "file";
  }
}
