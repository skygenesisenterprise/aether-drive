import * as React from "react";
import { ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";

interface DocsCardGridProps {
  cards: Array<{
    title: string;
    description: string;
    href: string;
    icon?: LucideIcon;
  }>;
}

export function DocsCardGrid({ cards }: DocsCardGridProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {cards.map((card) => (
        <Link
          key={`${card.title}-${card.href}`}
          href={card.href}
          className="group rounded-md border border-[#e5e5df] bg-white p-4 shadow-xs transition-colors hover:border-[#cfd1c9] hover:bg-[#fbfbfa] dark:border-border dark:bg-card dark:hover:border-foreground/20 dark:hover:bg-muted/50"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              {card.icon ? (
                <div className="mb-3 flex size-8 items-center justify-center rounded-md border border-[#e5e5df] bg-[#fbfbfa] text-[#238558] dark:border-border dark:bg-muted">
                  <card.icon className="size-4" />
                </div>
              ) : null}
              <h3 className="font-medium text-[#252927] dark:text-foreground">{card.title}</h3>
              <p className="mt-1 text-sm leading-6 text-[#6d726f] dark:text-muted-foreground">{card.description}</p>
            </div>
            <ArrowRight className="mt-1 size-4 shrink-0 text-[#8a8f8b] transition-transform group-hover:translate-x-0.5 group-hover:text-[#238558] dark:text-muted-foreground dark:group-hover:text-foreground" />
          </div>
        </Link>
      ))}
    </div>
  );
}
