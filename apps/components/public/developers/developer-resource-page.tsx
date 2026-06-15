import * as React from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Braces,
  Cable,
  CheckCircle2,
  Cloud,
  Code2,
  FileJson2,
  GitBranch,
  Globe,
  KeyRound,
  Layers3,
  Package,
  PlugZap,
  Rocket,
  ServerCog,
  ShieldCheck,
  Terminal,
  Waypoints,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { Footer } from "@/components/public/Footer";
import { Header } from "@/components/public/Header";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/lib/locale";
import { cn } from "@/lib/utils";

export type DeveloperPageStatus =
  | "Conceptuel"
  | "En préparation"
  | "En développement"
  | "Prototype"
  | "Alpha"
  | "Beta"
  | "Stable";

export interface DeveloperLink {
  href: string;
  label: string;
  variant?: "primary" | "secondary";
}

export interface DeveloperProfileItem {
  label: string;
  value: string;
  description?: string;
  status?: DeveloperPageStatus;
  monospace?: boolean;
}

export interface DeveloperCard {
  title: string;
  description: string;
  href?: string;
  icon?: string;
  meta?: string[];
  status?: DeveloperPageStatus;
}

export interface DeveloperNumberedItem {
  title: string;
  description: string;
  href?: string;
}

export interface DeveloperCardsSection {
  kind: "cards";
  eyebrow: string;
  title: string;
  description?: string;
  muted?: boolean;
  columns?: 2 | 3;
  cards: DeveloperCard[];
}

export interface DeveloperNumberedSection {
  kind: "numbered";
  eyebrow: string;
  title: string;
  description?: string;
  muted?: boolean;
  columns?: 2 | 3;
  items: DeveloperNumberedItem[];
}

export interface DeveloperDefinitionSection {
  kind: "definitions";
  eyebrow: string;
  title: string;
  description?: string;
  muted?: boolean;
  columns?: 2 | 3;
  items: DeveloperProfileItem[];
}

export interface DeveloperCodeSection {
  kind: "code";
  eyebrow: string;
  title: string;
  description?: string;
  muted?: boolean;
  caption?: string;
  code: string;
  notes?: DeveloperCard[];
}

export type DeveloperSection =
  | DeveloperCardsSection
  | DeveloperNumberedSection
  | DeveloperDefinitionSection
  | DeveloperCodeSection;

export interface DeveloperPageContent {
  slug?: string;
  title: string;
  eyebrow: string;
  description: string;
  body?: string;
  status: DeveloperPageStatus;
  ctas: DeveloperLink[];
  profileItems: DeveloperProfileItem[];
  sections: DeveloperSection[];
  supplementalSections?: DeveloperSection[];
  bottomEyebrow?: string;
  bottomTitle?: string;
  bottomDescription?: string;
  bottomLinks?: DeveloperLink[];
}

interface DeveloperResourcePageProps {
  locale: string;
  page: DeveloperPageContent;
}

interface SectionProps {
  id?: string;
  eyebrow: string;
  title: string;
  description?: string;
  tone?: "default" | "muted" | "dark";
  centered?: boolean;
  children: React.ReactNode;
}

const iconMap: Record<string, LucideIcon> = {
  BookOpen,
  Braces,
  Cable,
  CheckCircle2,
  Cloud,
  Code2,
  FileJson2,
  GitBranch,
  Globe,
  KeyRound,
  Layers3,
  Package,
  PlugZap,
  Rocket,
  ServerCog,
  ShieldCheck,
  Terminal,
  Waypoints,
  Workflow,
};

function localizeHref(locale: string, href: string) {
  if (href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("#")) {
    return href;
  }

  return `/${locale}${href.startsWith("/") ? href : `/${href}`}`;
}

function SectionEyebrow({ children, inverted = false }: { children: React.ReactNode; inverted?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.26em]",
        inverted ? "text-white/60" : "text-zinc-500",
      )}
    >
      <span className={cn("h-px w-10", inverted ? "bg-white/20" : "bg-zinc-300")} />
      {children}
    </span>
  );
}

function DarkGrid() {
  return (
    <div
      aria-hidden={true}
      className="pointer-events-none absolute inset-0 opacity-[0.06]"
      style={{
        backgroundImage:
          "linear-gradient(to right, rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.6) 1px, transparent 1px)",
        backgroundSize: "72px 72px",
      }}
    />
  );
}

function Section({ id, eyebrow, title, description, tone = "default", centered = false, children }: SectionProps) {
  const dark = tone === "dark";

  return (
    <section
      id={id}
      className={cn(
        "relative overflow-hidden py-24 sm:py-28 lg:py-32",
        tone === "muted" && "bg-zinc-50/80",
        dark && "bg-zinc-950 text-white",
      )}
    >
      {dark ? <DarkGrid /> : null}
      <div className="relative mx-auto max-w-360 px-6 lg:px-12">
        <div className={cn("max-w-4xl", centered && "mx-auto text-center")}>
          <SectionEyebrow inverted={dark}>{eyebrow}</SectionEyebrow>
          <h2
            className={cn(
              "mt-6 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl lg:text-6xl",
              dark ? "text-white" : "text-zinc-950",
            )}
          >
            {title}
          </h2>
          {description ? (
            <p className={cn("mt-6 text-lg leading-8", dark ? "text-white/68" : "text-zinc-600")}>{description}</p>
          ) : null}
        </div>
        <div className="mt-14">{children}</div>
      </div>
    </section>
  );
}

function DeveloperStatusBadge({ status, dark = false }: { status: DeveloperPageStatus; dark?: boolean }) {
  const toneByStatus: Record<DeveloperPageStatus, string> = {
    Conceptuel: dark ? "border-white/10 bg-white/5 text-white/62" : "border-zinc-200 bg-zinc-50 text-zinc-600",
    "En préparation": "border-sky-500/25 bg-sky-500/10 text-sky-700",
    "En développement": "border-amber-500/25 bg-amber-500/10 text-amber-700",
    Prototype: "border-cyan-500/25 bg-cyan-500/10 text-cyan-700",
    Alpha: "border-fuchsia-500/25 bg-fuchsia-500/10 text-fuchsia-700",
    Beta: "border-violet-500/25 bg-violet-500/10 text-violet-700",
    Stable: "border-emerald-500/25 bg-emerald-500/10 text-emerald-700",
  };

  return (
    <span className={cn("inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium", toneByStatus[status])}>
      {status}
    </span>
  );
}

function HeroVisual({ page }: { page: DeveloperPageContent }) {
  return (
    <div className="relative overflow-hidden rounded-4xl border border-zinc-200 bg-white p-5 shadow-[0_32px_100px_-52px_rgba(15,23,42,0.3)]">
      <div
        aria-hidden={true}
        className="absolute inset-x-0 top-0 h-32 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.16),transparent_54%),linear-gradient(180deg,rgba(244,244,245,0.98),rgba(255,255,255,0))]"
      />
      <div className="relative rounded-[1.5rem] border border-zinc-200 bg-zinc-950 p-5 text-white">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/46">developer.skygenesisenterprise.com</div>
            <div className="mt-2 text-xl font-semibold tracking-[-0.03em]">{page.title}</div>
          </div>
          <DeveloperStatusBadge status={page.status} dark />
        </div>
        <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-black/35">
          <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-300/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
            <span className="ml-3 text-[11px] text-white/42">sge developers</span>
          </div>
          <pre className="overflow-x-auto p-4 text-xs leading-6 text-white/76">
            <code>{`curl https://api.skygenesisenterprise.com/v1/status \\
  -H "Authorization: Bearer $SGE_TOKEN" \\
  -H "SGE-Environment: sandbox"`}</code>
          </pre>
        </div>
      </div>
      <div className="relative mt-4 grid gap-3 sm:grid-cols-2">
        {page.profileItems.slice(0, 4).map((item) => (
          <div key={item.label} className="rounded-2xl border border-zinc-200 bg-zinc-50/80 px-4 py-3">
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">{item.label}</div>
            <div className="mt-2 text-sm font-semibold text-zinc-950">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DeveloperHero({ locale, page }: DeveloperResourcePageProps) {
  return (
    <section className="relative overflow-hidden border-b border-zinc-200/80 bg-[linear-gradient(180deg,#ffffff_0%,#fafafa_100%)]">
      <div aria-hidden={true} className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-44 bg-[radial-gradient(circle_at_top,rgba(148,163,184,0.18),transparent_65%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.92),rgba(255,255,255,0.58)_46%,rgba(255,255,255,0.92)_100%)]" />
      </div>

      <div className="relative mx-auto grid min-h-[88vh] max-w-360 items-center gap-12 px-6 py-20 sm:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:px-12 lg:py-28">
        <div className="max-w-4xl">
          <SectionEyebrow>{page.eyebrow}</SectionEyebrow>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <h1 className="max-w-5xl text-[clamp(3.2rem,6.8vw,7rem)] font-semibold leading-[0.92] tracking-[-0.06em] text-zinc-950">
              {page.title}
            </h1>
            <DeveloperStatusBadge status={page.status} />
          </div>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-600 sm:text-xl">{page.description}</p>
          {page.body ? <p className="mt-5 max-w-3xl text-base leading-7 text-zinc-600">{page.body}</p> : null}
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
            {page.ctas.map((cta) => (
              <Button
                key={cta.href}
                asChild
                size="lg"
                variant={cta.variant === "secondary" ? "outline" : "default"}
                className={cn(
                  "h-14 rounded-full px-8 text-sm font-medium",
                  cta.variant === "secondary"
                    ? "border-zinc-300 bg-white/85 text-zinc-950"
                    : "bg-zinc-950 text-white hover:bg-zinc-800",
                )}
              >
                <Link href={localizeHref(locale, cta.href)}>
                  {cta.label}
                  {cta.variant === "secondary" ? null : <ArrowRight className="h-4 w-4" />}
                </Link>
              </Button>
            ))}
          </div>
        </div>
        <HeroVisual page={page} />
      </div>
    </section>
  );
}

function gridClass(columns: 2 | 3 = 3) {
  return columns === 2 ? "grid gap-5 md:grid-cols-2" : "grid gap-5 md:grid-cols-2 lg:grid-cols-3";
}

function DeveloperCardView({ card, locale, number, dark = false }: { card: DeveloperCard; locale: string; number?: number; dark?: boolean }) {
  const Icon = card.icon ? iconMap[card.icon] : undefined;
  const content = (
    <div
      className={cn(
        "group relative h-full overflow-hidden rounded-4xl border p-6 transition duration-300",
        dark
          ? "border-white/10 bg-white/4 hover:border-white/20"
          : "border-zinc-200/80 bg-white shadow-[0_20px_60px_-40px_rgba(15,23,42,0.22)] hover:-translate-y-1 hover:border-zinc-300 hover:shadow-[0_24px_80px_-36px_rgba(15,23,42,0.22)]",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          {typeof number === "number" ? (
            <span
              className={cn(
                "inline-flex h-11 w-11 items-center justify-center rounded-2xl border text-sm font-semibold",
                dark ? "border-white/10 bg-white/6 text-white" : "border-zinc-200 bg-zinc-50 text-zinc-700",
              )}
            >
              {number + 1}
            </span>
          ) : Icon ? (
            <span
              className={cn(
                "inline-flex h-12 w-12 items-center justify-center rounded-2xl border",
                dark ? "border-white/10 bg-white/6 text-white" : "border-zinc-200 bg-zinc-50 text-zinc-700",
              )}
            >
              <Icon className="h-5 w-5" />
            </span>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          {card.status ? <DeveloperStatusBadge status={card.status} dark={dark} /> : null}
          {card.href ? (
            <span
              className={cn(
                "inline-flex h-10 w-10 items-center justify-center rounded-full border transition",
                dark
                  ? "border-white/10 text-white/54 group-hover:border-white/20 group-hover:text-white"
                  : "border-zinc-200 text-zinc-500 group-hover:border-zinc-300 group-hover:text-zinc-900",
              )}
            >
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden={true} />
            </span>
          ) : null}
        </div>
      </div>
      <h3 className={cn("mt-7 text-xl font-semibold tracking-[-0.03em]", dark ? "text-white" : "text-zinc-950")}>{card.title}</h3>
      <p className={cn("mt-4 text-sm leading-7", dark ? "text-white/64" : "text-zinc-600")}>{card.description}</p>
      {card.meta?.length ? (
        <ul className={cn("mt-5 space-y-2 text-sm leading-6", dark ? "text-white/58" : "text-zinc-500")}>
          {card.meta.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );

  if (!card.href) {
    return content;
  }

  return <Link href={localizeHref(locale, card.href)}>{content}</Link>;
}

function DefinitionsGrid({ section, dark = false }: { section: DeveloperDefinitionSection; dark?: boolean }) {
  return (
    <div className={gridClass(section.columns)}>
      {section.items.map((item) => (
        <div
          key={`${item.label}-${item.value}`}
          className={cn(
            "rounded-4xl border p-6",
            dark ? "border-white/10 bg-white/4" : "border-zinc-200/80 bg-white shadow-[0_20px_60px_-40px_rgba(15,23,42,0.2)]",
          )}
        >
          <div className="flex items-start justify-between gap-4">
            <p className={cn("text-[11px] font-semibold uppercase tracking-[0.2em]", dark ? "text-white/48" : "text-zinc-500")}>
              {item.label}
            </p>
            {item.status ? <DeveloperStatusBadge status={item.status} dark={dark} /> : null}
          </div>
          <p className={cn("mt-4 text-lg font-semibold", item.monospace && "font-mono text-sm", dark ? "text-white" : "text-zinc-950")}>
            {item.value}
          </p>
          {item.description ? <p className={cn("mt-3 text-sm leading-7", dark ? "text-white/62" : "text-zinc-600")}>{item.description}</p> : null}
        </div>
      ))}
    </div>
  );
}

function CodeSectionView({ locale, section, dark = false }: { locale: string; section: DeveloperCodeSection; dark?: boolean }) {
  const hasNotes = Boolean(section.notes?.length);

  return (
    <div className={cn("grid gap-6", hasNotes && "lg:grid-cols-[1.1fr_0.9fr]")}>
      <div className={cn("overflow-hidden rounded-4xl border", dark ? "border-white/10 bg-black/30" : "border-zinc-200 bg-zinc-950 text-white")}>
        {section.caption ? (
          <div className={cn("border-b px-5 py-4 text-sm font-medium", dark ? "border-white/10 text-white" : "border-white/10 text-white")}>
            {section.caption}
          </div>
        ) : null}
        <pre className="overflow-x-auto p-5 text-sm leading-7 text-white/78">
          <code>{section.code}</code>
        </pre>
      </div>
      {hasNotes ? (
        <div className="grid gap-5">
          {section.notes?.map((card) => <DeveloperCardView key={card.title} card={card} locale={locale} dark={dark} />)}
        </div>
      ) : null}
    </div>
  );
}

function renderSection(locale: string, section: DeveloperSection) {
  const tone = section.kind === "code" ? "dark" : section.muted ? "muted" : "default";
  const dark = tone === "dark";

  return (
    <Section key={`${section.kind}-${section.title}`} eyebrow={section.eyebrow} title={section.title} description={section.description} tone={tone}>
      {section.kind === "cards" ? (
        <div className={gridClass(section.columns)}>
          {section.cards.map((card) => (
            <DeveloperCardView key={card.title} card={card} locale={locale} dark={dark} />
          ))}
        </div>
      ) : null}
      {section.kind === "numbered" ? (
        <div className={gridClass(section.columns)}>
          {section.items.map((item, index) => (
            <DeveloperCardView key={item.title} card={item} locale={locale} number={index} dark={dark} />
          ))}
        </div>
      ) : null}
      {section.kind === "definitions" ? <DefinitionsGrid section={section} dark={dark} /> : null}
      {section.kind === "code" ? <CodeSectionView locale={locale} section={section} dark={dark} /> : null}
    </Section>
  );
}

function BottomSection({ locale, page }: DeveloperResourcePageProps) {
  if (!page.bottomTitle || !page.bottomLinks?.length) {
    return null;
  }

  return (
    <section className="bg-zinc-50/80 py-20 sm:py-24">
      <div className="mx-auto max-w-360 px-6 lg:px-12">
        <div className="rounded-4xl border border-zinc-200 bg-white p-8 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.3)] lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-3xl">
              <SectionEyebrow>{page.bottomEyebrow ?? "Next step"}</SectionEyebrow>
              <h2 className="mt-6 text-3xl font-semibold tracking-[-0.04em] text-zinc-950 sm:text-4xl">{page.bottomTitle}</h2>
              {page.bottomDescription ? <p className="mt-5 text-base leading-7 text-zinc-600">{page.bottomDescription}</p> : null}
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
              {page.bottomLinks.map((link) => (
                <Button
                  key={link.href}
                  asChild
                  variant={link.variant === "secondary" ? "outline" : "default"}
                  className={cn(
                    "h-12 rounded-full px-6 text-sm font-medium",
                    link.variant === "secondary" ? "border-zinc-300 bg-white text-zinc-950" : "bg-zinc-950 text-white hover:bg-zinc-800",
                  )}
                >
                  <Link href={localizeHref(locale, link.href)}>
                    {link.label}
                    {link.variant === "secondary" ? null : <ArrowRight className="h-4 w-4" />}
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function DeveloperResourcePage({ locale, page }: DeveloperResourcePageProps) {
  return (
    <div className="flex min-h-screen flex-col bg-white text-zinc-950">
      <Header locale={locale as Locale} />
      <main className="flex-1">
        <DeveloperHero locale={locale} page={page} />
        {page.sections.map((section) => renderSection(locale, section))}
        {page.supplementalSections?.map((section) => renderSection(locale, section))}
        <BottomSection locale={locale} page={page} />
      </main>
      <Footer locale={locale as Locale} />
    </div>
  );
}
