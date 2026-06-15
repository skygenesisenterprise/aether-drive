import * as React from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpenText,
  CalendarDays,
  Clock3,
  FolderKanban,
  MoveRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { BlogCategory, EditorialArticle, EditorialCollection } from "@/lib/blog/types";
import { cn } from "@/lib/utils";

interface BlogSectionProps {
  eyebrow: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}

interface BlogCardProps {
  article: EditorialArticle;
  locale: string;
  featured?: boolean;
}

interface BlogCategoryCardProps {
  category: BlogCategory;
  articleCount: number;
  locale: string;
}

interface BlogCollectionCardProps {
  collection: EditorialCollection;
  articleCount: number;
}

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

function localizeHref(locale: string, href: string) {
  return `/${locale}${href.startsWith("/") ? href : `/${href}`}`;
}

export function formatBlogDate(date: string) {
  return dateFormatter.format(new Date(date));
}

export function SectionEyebrow({ children, muted = false }: { children: React.ReactNode; muted?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em]",
        muted ? "text-muted-foreground" : "text-primary",
      )}
    >
      <span className={cn("h-px w-10", muted ? "bg-foreground/15" : "bg-primary/35")} />
      {children}
    </span>
  );
}

export function BlogSection({ eyebrow, title, description, action, children }: BlogSectionProps) {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="mb-12 grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div className="max-w-3xl">
            <SectionEyebrow muted>{eyebrow}</SectionEyebrow>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              {title}
            </h2>
            {description ? <p className="mt-5 text-base leading-8 text-muted-foreground sm:text-lg">{description}</p> : null}
          </div>
          {action ? <div className="lg:justify-self-end">{action}</div> : null}
        </div>
        {children}
      </div>
    </section>
  );
}

function ArticleMeta({ article }: { article: EditorialArticle }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
      <span className="inline-flex items-center gap-2">
        <CalendarDays className="h-4 w-4" />
        {formatBlogDate(article.publishedAt)}
      </span>
      <span className="inline-flex items-center gap-2">
        <Clock3 className="h-4 w-4" />
        {article.readingTime} min
      </span>
      <span>{article.author.name}</span>
    </div>
  );
}

export function FeaturedArticleCard({ article, locale }: BlogCardProps) {
  return (
    <Link href={localizeHref(locale, `/blog/${article.slug}`)} className="group block">
      <article className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-card/95 p-8 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-xl lg:p-10">
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/30 to-transparent" />
        <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(57,76,140,0.12),transparent_68%)]" />
        <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1.3fr)_320px] lg:items-end">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
                Article mis en avant
              </span>
              <span className="inline-flex rounded-full border border-border/70 bg-background/85 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                {article.category}
              </span>
            </div>
            <h3 className="mt-6 max-w-4xl text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-[2.8rem]">
              {article.title}
            </h3>
            <p className="mt-5 max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">{article.excerpt}</p>
            <div className="mt-8">
              <ArticleMeta article={article} />
            </div>
          </div>
          <div className="rounded-[1.75rem] border border-border/70 bg-background/80 p-6 backdrop-blur">
            <p className="text-sm font-medium text-foreground">A retenir</p>
            <ul className="mt-4 space-y-3">
              {article.summary.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-7 text-muted-foreground">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/70" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-foreground">
              Lire l'article
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

export function ArticleCard({ article, locale, featured = false }: BlogCardProps) {
  return (
    <Link href={localizeHref(locale, `/blog/${article.slug}`)} className="group block h-full">
      <article
        className={cn(
          "relative h-full overflow-hidden rounded-[1.75rem] border border-border/70 bg-card/90 p-6 shadow-sm transition duration-300",
          "hover:-translate-y-1 hover:border-primary/25 hover:shadow-xl",
          featured && "p-7",
        )}
      >
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/20 to-transparent" />
        <div className="relative flex h-full flex-col">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex rounded-full border border-border/70 bg-background/85 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
              {article.category}
            </span>
            <span className="text-xs text-muted-foreground">{formatBlogDate(article.publishedAt)}</span>
          </div>
          <h3 className={cn("mt-5 text-xl font-semibold tracking-tight text-foreground", featured && "text-2xl")}>
            {article.title}
          </h3>
          <p className="mt-4 flex-1 text-sm leading-7 text-muted-foreground">{article.excerpt}</p>
          <div className="mt-6 border-t border-border/60 pt-5">
            <ArticleMeta article={article} />
          </div>
          <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-foreground">
            Lire
            <MoveRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </article>
    </Link>
  );
}

export function BlogCategoryCard({ category, articleCount, locale }: BlogCategoryCardProps) {
  return (
    <Link href={localizeHref(locale, `/blog/category/${category.slug}`)} className="group block h-full">
      <article className="relative h-full overflow-hidden rounded-[1.5rem] border border-border/70 bg-background/85 p-6 transition duration-300 hover:-translate-y-1 hover:border-primary/25 hover:bg-card">
        <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-[radial-gradient(circle,rgba(57,76,140,0.10),transparent_65%)]" />
        <div className="relative flex h-full flex-col">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-border/70 bg-card text-primary">
            <FolderKanban className="h-5 w-5" />
          </span>
          <h3 className="mt-5 text-lg font-semibold text-foreground">{category.label}</h3>
          <p className="mt-3 flex-1 text-sm leading-7 text-muted-foreground">{category.description}</p>
          <div className="mt-6 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{articleCount} article{articleCount > 1 ? "s" : ""}</span>
            <span className="inline-flex items-center gap-2 font-medium text-foreground">
              Explorer
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

export function BlogCollectionCard({ collection, articleCount }: BlogCollectionCardProps) {
  return (
    <article className="relative overflow-hidden rounded-[1.75rem] border border-border/70 bg-muted/[0.32] p-6">
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/20 to-transparent" />
      <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-border/70 bg-background text-primary">
        <BookOpenText className="h-5 w-5" />
      </span>
      <h3 className="mt-5 text-xl font-semibold tracking-tight text-foreground">{collection.title}</h3>
      <p className="mt-3 text-sm leading-7 text-muted-foreground">{collection.description}</p>
      <p className="mt-6 text-sm font-medium text-foreground">{articleCount} article{articleCount > 1 ? "s" : ""}</p>
    </article>
  );
}

export function BlogFinalCta({
  locale,
  title,
  description,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
}: {
  locale: string;
  title: string;
  description: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
}) {
  return (
    <section className="pb-24 sm:pb-28">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-foreground px-8 py-10 text-background sm:px-10 sm:py-12 lg:px-14 lg:py-14">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(-45deg, transparent, transparent 36px, currentColor 36px, currentColor 37px)",
            }}
          />
          <div className="relative max-w-3xl">
            <SectionEyebrow>{title}</SectionEyebrow>
            <p className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">{description}</p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Button asChild size="lg" className="h-12 rounded-full px-6 text-sm font-medium">
                <Link href={localizeHref(locale, primaryHref)}>
                  {primaryLabel}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 rounded-full border-background/15 bg-transparent px-6 text-sm font-medium text-background hover:bg-background hover:text-foreground"
              >
                <Link href={localizeHref(locale, secondaryHref)}>{secondaryLabel}</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
