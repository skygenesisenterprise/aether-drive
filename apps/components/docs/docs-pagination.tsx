import * as React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";

interface DocsPaginationLink {
  title: string;
  url: string;
}

interface DocsPaginationProps {
  previous?: DocsPaginationLink;
  next?: DocsPaginationLink;
}

export function DocsPagination({ previous, next }: DocsPaginationProps) {
  if (!previous && !next) {
    return null;
  }

  return (
    <nav className="mt-12 grid gap-3 border-t border-[#ededed] pt-6 sm:grid-cols-2 dark:border-border" aria-label="Documentation pagination">
      {previous ? (
        <Link
          href={previous.url}
          className="group rounded-md border border-[#e5e5df] bg-white p-4 text-sm shadow-xs transition-colors hover:border-[#cfd1c9] hover:bg-[#fbfbfa] dark:border-border dark:bg-card dark:hover:border-foreground/20 dark:hover:bg-muted/50"
        >
          <span className="mb-2 flex items-center gap-2 text-[#6d726f] dark:text-muted-foreground">
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
            Previous
          </span>
          <span className="font-medium text-[#252927] dark:text-foreground">{previous.title}</span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link
          href={next.url}
          className="group rounded-md border border-[#e5e5df] bg-white p-4 text-right text-sm shadow-xs transition-colors hover:border-[#cfd1c9] hover:bg-[#fbfbfa] dark:border-border dark:bg-card dark:hover:border-foreground/20 dark:hover:bg-muted/50"
        >
          <span className="mb-2 flex items-center justify-end gap-2 text-[#6d726f] dark:text-muted-foreground">
            Next
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </span>
          <span className="font-medium text-[#252927] dark:text-foreground">{next.title}</span>
        </Link>
      ) : null}
    </nav>
  );
}
