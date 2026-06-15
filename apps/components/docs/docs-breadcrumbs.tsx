import * as React from "react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface DocsBreadcrumbsProps {
  items: Array<{
    title: string;
    href?: string;
  }>;
}

export function DocsBreadcrumbs({ items }: DocsBreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1 text-sm">
      <Link href="/docs" className="text-[#6d726f] transition-colors hover:text-[#147342] dark:text-muted-foreground dark:hover:text-foreground">
        Docs
      </Link>
      {items.map((item) => (
        <React.Fragment key={`${item.href ?? item.title}-${item.title}`}>
          <ChevronRight className="size-3.5 text-[#a0a49f] dark:text-muted-foreground/70" />
          {item.href ? (
            <Link href={item.href} className="text-[#6d726f] transition-colors hover:text-[#147342] dark:text-muted-foreground dark:hover:text-foreground">
              {item.title}
            </Link>
          ) : (
            <span className="font-medium text-[#252927] dark:text-foreground">{item.title}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
