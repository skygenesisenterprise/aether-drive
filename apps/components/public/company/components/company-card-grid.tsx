import * as React from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CompanyGridItem {
  title: string;
  description: string;
  meta?: string;
  href?: string;
  cta?: string;
  icon?: LucideIcon;
}

interface CompanyCardGridProps {
  items: CompanyGridItem[];
  columns?: "two" | "three";
}

export function CompanyLinkCard({ title, description, meta, href, cta, icon: Icon }: CompanyGridItem) {
  const content = (
    <div
      className={cn(
        "group relative h-full overflow-hidden rounded-4xl border border-zinc-200/80 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.24)] transition duration-300",
        "hover:-translate-y-1 hover:border-zinc-300 hover:shadow-[0_24px_80px_-36px_rgba(15,23,42,0.2)]",
      )}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-zinc-300 to-transparent" />
      <div className="flex items-start justify-between gap-4">
        {Icon ? (
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-50 text-zinc-700">
            <Icon className="h-5 w-5" aria-hidden={true} />
          </span>
        ) : (
          <span />
        )}
        {href ? (
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 text-zinc-500 transition group-hover:border-zinc-300 group-hover:text-zinc-900">
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden={true} />
          </span>
        ) : null}
      </div>
      {meta ? <p className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">{meta}</p> : null}
      <h3 className={cn("text-xl font-semibold tracking-[-0.03em] text-zinc-950", meta ? "mt-3" : "mt-8")}>{title}</h3>
      <p className="mt-4 text-sm leading-7 text-zinc-600">{description}</p>
      {cta ? <span className="mt-7 inline-flex text-sm font-medium text-zinc-950">{cta}</span> : null}
    </div>
  );

  if (!href) {
    return content;
  }

  return <Link href={href}>{content}</Link>;
}

export function CompanyCardGrid({ items, columns = "three" }: CompanyCardGridProps) {
  return (
    <div className={cn("grid gap-5", columns === "two" ? "md:grid-cols-2" : "md:grid-cols-2 xl:grid-cols-3")}>
      {items.map((item) => (
        <CompanyLinkCard key={`${item.title}-${item.description}`} {...item} />
      ))}
    </div>
  );
}

interface CompanyPillListProps {
  items: string[];
  inverted?: boolean;
}

export function CompanyPillList({ items, inverted = false }: CompanyPillListProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {items.map((item) => (
        <span
          key={item}
          className={cn(
            "inline-flex rounded-full border px-4 py-2 text-xs font-medium uppercase tracking-[0.18em]",
            inverted ? "border-white/10 bg-white/5 text-white/70" : "border-zinc-200 bg-white text-zinc-600",
          )}
        >
          {item}
        </span>
      ))}
    </div>
  );
}

interface CompanySplitListProps {
  items: Array<{ title: string; description: string }>;
}

export function CompanySplitList({ items }: CompanySplitListProps) {
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {items.map((item) => (
        <div key={item.title} className="rounded-4xl border border-zinc-200/80 bg-white p-6">
          <h3 className="text-xl font-semibold tracking-[-0.03em] text-zinc-950">{item.title}</h3>
          <p className="mt-4 text-sm leading-7 text-zinc-600">{item.description}</p>
        </div>
      ))}
    </div>
  );
}
