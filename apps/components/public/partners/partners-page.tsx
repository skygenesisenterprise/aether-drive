import * as React from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Boxes,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  CloudCog,
  Code2,
  Compass,
  FileCheck2,
  GitBranch,
  Globe2,
  GraduationCap,
  Handshake,
  KeyRound,
  Layers3,
  LifeBuoy,
  Megaphone,
  Network,
  PackageCheck,
  Rocket,
  ShieldCheck,
  Sparkles,
  Store,
  UsersRound,
  Workflow,
  Wrench,
} from "lucide-react";
import { Footer } from "@/components/public/Footer";
import { Header } from "@/components/public/Header";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/lib/locale";
import { cn } from "@/lib/utils";

export interface PartnerCard {
  title: string;
  description: string;
  href?: string;
  icon?: string;
}

export interface ProcessStep {
  title: string;
  description: string;
  href?: string;
}

export interface PartnerLinkCard extends PartnerCard {
  label: string;
  href: string;
}

export interface PartnerSupplementalSection {
  eyebrow: string;
  title: string;
  description: string;
  tone?: "default" | "muted" | "dark";
  columns?: 2 | 3;
  items: PartnerCard[];
}

export interface PartnerPageContent {
  badge: string;
  title: string;
  description: string;
  primaryCta: string;
  primaryHref: string;
  secondaryCta?: string;
  secondaryHref?: string;
  audienceTitle: string;
  audienceDescription: string;
  audienceItems: string[];
  buildTitle: string;
  buildDescription: string;
  buildItems: PartnerCard[];
  collaborationTitle: string;
  collaborationDescription: string;
  collaborationItems: PartnerCard[];
  positioningTitle: string;
  positioningDescription: string;
  positioningItems: PartnerCard[];
  processTitle: string;
  processDescription: string;
  processItems: ProcessStep[];
  operatingTitle: string;
  operatingDescription: string;
  operatingItems: PartnerCard[];
  resourcesTitle: string;
  resourcesDescription: string;
  resourcesItems: PartnerCard[];
  enablementTitle: string;
  enablementDescription: string;
  enablementItems: PartnerCard[];
  supplementalSections?: PartnerSupplementalSection[];
  nextStepsTitle: string;
  nextStepsDescription: string;
  nextStepsItems: PartnerLinkCard[];
  ctaTitle: string;
  ctaDescription: string;
  ctaLabel: string;
  ctaHref: string;
}

interface PartnersPageProps {
  locale: string;
  content: PartnerPageContent;
  icons: {
    hero: LucideIcon;
    audience: LucideIcon;
    build: LucideIcon[];
    collaboration: LucideIcon[];
    positioning: LucideIcon[];
    operating: LucideIcon[];
    resources: LucideIcon[];
    enablement: LucideIcon[];
    nextSteps: LucideIcon[];
  };
}

interface SectionProps {
  eyebrow?: string;
  title: string;
  description?: string;
  tone?: "default" | "muted" | "dark";
  centered?: boolean;
  children: React.ReactNode;
}

const iconMap: Record<string, LucideIcon> = {
  BadgeCheck,
  BookOpen,
  Boxes,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  CloudCog,
  Code2,
  Compass,
  FileCheck2,
  GitBranch,
  Globe2,
  GraduationCap,
  Handshake,
  KeyRound,
  Layers3,
  LifeBuoy,
  Megaphone,
  Network,
  PackageCheck,
  Rocket,
  ShieldCheck,
  Sparkles,
  Store,
  UsersRound,
  Workflow,
  Wrench,
};

function localizeHref(locale: string, href: string) {
  if (href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("#") || href.startsWith(`/${locale}/`)) {
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

function Section({ eyebrow, title, description, tone = "default", centered = false, children }: SectionProps) {
  const dark = tone === "dark";

  return (
    <section
      className={cn(
        "relative overflow-hidden py-24 sm:py-28 lg:py-32",
        tone === "muted" && "bg-zinc-50/80",
        dark && "bg-zinc-950 text-white",
      )}
    >
      {dark ? <DarkGrid /> : null}
      <div className="relative mx-auto max-w-360 px-6 lg:px-12">
        <div className={cn("max-w-4xl", centered && "mx-auto text-center")}>
          {eyebrow ? <SectionEyebrow inverted={dark}>{eyebrow}</SectionEyebrow> : null}
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

function gridClass(columns: 2 | 3 = 3) {
  return columns === 2 ? "grid gap-5 md:grid-cols-2" : "grid gap-5 md:grid-cols-2 lg:grid-cols-3";
}

function CardGrid({
  locale,
  items,
  icons,
  columns = 3,
  dark = false,
}: {
  locale: string;
  items: PartnerCard[];
  icons: LucideIcon[];
  columns?: 2 | 3;
  dark?: boolean;
}) {
  return (
    <div className={gridClass(columns)}>
      {items.map((item, index) => {
        const Icon = item.icon ? iconMap[item.icon] ?? icons[index % icons.length] : icons[index % icons.length];
        const card = (
          <article
            className={cn(
              "group relative h-full overflow-hidden rounded-4xl border p-6 transition duration-300",
              dark
                ? "border-white/10 bg-white/4 hover:border-white/20"
                : "border-zinc-200/80 bg-white shadow-[0_20px_60px_-40px_rgba(15,23,42,0.22)] hover:-translate-y-1 hover:border-zinc-300 hover:shadow-[0_24px_80px_-36px_rgba(15,23,42,0.22)]",
            )}
          >
            <div className="flex items-start justify-between gap-4">
              <span
                className={cn(
                  "inline-flex h-12 w-12 items-center justify-center rounded-2xl border",
                  dark ? "border-white/10 bg-white/6 text-white" : "border-zinc-200 bg-zinc-50 text-zinc-700",
                )}
              >
                <Icon className="h-5 w-5" strokeWidth={1.7} />
              </span>
              {item.href ? (
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
            <h3 className={cn("mt-7 text-xl font-semibold tracking-[-0.03em]", dark ? "text-white" : "text-zinc-950")}>{item.title}</h3>
            <p className={cn("mt-4 text-sm leading-7", dark ? "text-white/64" : "text-zinc-600")}>{item.description}</p>
          </article>
        );

        if (!item.href) {
          return <React.Fragment key={item.title}>{card}</React.Fragment>;
        }

        return (
          <Link key={item.title} href={localizeHref(locale, item.href)}>
            {card}
          </Link>
        );
      })}
    </div>
  );
}

function LinkCardGrid({ locale, items, icons }: { locale: string; items: PartnerLinkCard[]; icons: LucideIcon[] }) {
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item, index) => {
        const Icon = icons[index % icons.length];

        return (
          <Link
            key={item.title}
            href={localizeHref(locale, item.href)}
            className="group rounded-4xl border border-zinc-200/80 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.22)] transition duration-300 hover:-translate-y-1 hover:border-zinc-300 hover:shadow-[0_24px_80px_-36px_rgba(15,23,42,0.22)]"
          >
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-50 text-zinc-700">
              <Icon className="h-5 w-5" strokeWidth={1.7} />
            </span>
            <h3 className="mt-7 text-xl font-semibold tracking-[-0.03em] text-zinc-950">{item.title}</h3>
            <p className="mt-4 text-sm leading-7 text-zinc-600">{item.description}</p>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-zinc-950">
              {item.label}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        );
      })}
    </div>
  );
}

function PartnersHeroVisual() {
  return (
    <svg viewBox="0 0 1600 620" className="h-full w-full" fill="none" aria-hidden={true}>
      <defs>
        <linearGradient id="partners-hero-fill" x1="0%" x2="100%" y1="0%" y2="0%">
          <stop offset="0%" stopColor="rgba(24,24,27,0.13)" />
          <stop offset="100%" stopColor="rgba(24,24,27,0.04)" />
        </linearGradient>
        <radialGradient id="partners-hero-node" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(14,165,233,0.15)" />
          <stop offset="100%" stopColor="rgba(14,165,233,0)" />
        </radialGradient>
      </defs>

      <path
        d="M86 300C188 221 302 208 428 260C528 301 612 292 710 238C828 173 936 185 1038 270C1114 333 1186 335 1282 298C1372 264 1454 286 1530 356V450C1430 445 1334 410 1242 374C1146 337 1072 352 995 404C895 470 777 458 672 386C578 322 493 313 382 352C272 390 170 370 86 306V300Z"
        fill="url(#partners-hero-fill)"
      />
      <path
        d="M170 330C320 247 480 253 624 314C764 374 884 372 1022 316C1172 255 1308 278 1446 370"
        stroke="rgba(24,24,27,0.14)"
        strokeWidth="1.25"
      />
      <path
        d="M230 416C376 450 514 440 652 392C792 344 912 336 1055 380C1172 416 1294 426 1412 390"
        stroke="rgba(24,24,27,0.1)"
        strokeWidth="1.25"
      />
      <g fill="rgba(24,24,27,0.38)">
        {[
          [260, 332],
          [454, 286],
          [650, 330],
          [830, 278],
          [1024, 320],
          [1200, 350],
          [1390, 384],
        ].map(([cx, cy]) => (
          <g key={`${cx}-${cy}`}>
            <circle cx={cx} cy={cy} r="5.5" />
            <circle cx={cx} cy={cy} r="22" fill="url(#partners-hero-node)" />
          </g>
        ))}
      </g>
    </svg>
  );
}

export function PartnersPage({ locale, content, icons }: PartnersPageProps) {
  return (
    <div className="flex min-h-screen flex-col bg-white text-zinc-950">
      <Header locale={locale as Locale} />

      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-zinc-200/80 bg-[linear-gradient(180deg,#ffffff_0%,#fafafa_100%)]">
          <div aria-hidden={true} className="pointer-events-none absolute inset-0">
            <div className="absolute inset-x-0 top-0 h-44 bg-[radial-gradient(circle_at_top,rgba(148,163,184,0.18),transparent_65%)]" />
            <div className="absolute inset-x-[-10%] top-[16%] h-[56%] opacity-95 sm:top-[18%] lg:inset-x-[-4%] lg:top-[19%] lg:h-[62%]">
              <PartnersHeroVisual />
            </div>
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.76),rgba(255,255,255,0.34)_30%,rgba(255,255,255,0.82)_100%)]" />
          </div>

          <div className="relative mx-auto flex min-h-[88vh] max-w-360 items-center px-6 py-20 sm:py-24 lg:px-12 lg:py-28">
            <div className="max-w-4xl">
              <SectionEyebrow>{content.badge}</SectionEyebrow>
              <h1 className="mt-7 max-w-5xl text-[clamp(3.4rem,7vw,7rem)] font-semibold leading-[0.92] tracking-[-0.06em] text-zinc-950">
                {content.title}
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-600 sm:text-xl">{content.description}</p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
                <Button asChild size="lg" className="h-14 rounded-full bg-zinc-950 px-8 text-sm font-medium text-white hover:bg-zinc-800">
                  <Link href={localizeHref(locale, content.primaryHref)}>
                    {content.primaryCta}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                {content.secondaryCta && content.secondaryHref ? (
                  <Button asChild size="lg" variant="outline" className="h-14 rounded-full border-zinc-300 bg-white/85 px-8 text-sm font-medium text-zinc-950">
                    <Link href={localizeHref(locale, content.secondaryHref)}>{content.secondaryCta}</Link>
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        <Section eyebrow={content.badge} title={content.buildTitle} description={content.buildDescription} tone="muted">
          <CardGrid locale={locale} items={content.buildItems} icons={icons.build} />
        </Section>

        <Section eyebrow={content.badge} title={content.collaborationTitle} description={content.collaborationDescription}>
          <CardGrid locale={locale} items={content.collaborationItems} icons={icons.collaboration} />
        </Section>

        <Section eyebrow={content.badge} title={content.positioningTitle} description={content.positioningDescription} tone="muted">
          <CardGrid locale={locale} items={content.positioningItems} icons={icons.positioning} />
        </Section>

        <Section eyebrow={content.badge} title={content.processTitle} description={content.processDescription}>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {content.processItems.map((step, index) => (
              <article key={step.title} className="rounded-4xl border border-zinc-200/80 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.22)]">
                <div className="mb-8 text-sm font-semibold text-zinc-400">{String(index + 1).padStart(2, "0")}</div>
                <h3 className="text-xl font-semibold tracking-[-0.03em] text-zinc-950">{step.title}</h3>
                <p className="mt-4 text-sm leading-7 text-zinc-600">{step.description}</p>
              </article>
            ))}
          </div>
        </Section>

        <Section eyebrow={content.badge} title={content.operatingTitle} description={content.operatingDescription} tone="dark">
          <CardGrid locale={locale} items={content.operatingItems} icons={icons.operating} dark />
        </Section>

        <Section eyebrow={content.badge} title={content.resourcesTitle} description={content.resourcesDescription}>
          <CardGrid locale={locale} items={content.resourcesItems} icons={icons.resources} />
        </Section>

        <Section eyebrow={content.badge} title={content.enablementTitle} description={content.enablementDescription} tone="muted">
          <CardGrid locale={locale} items={content.enablementItems} icons={icons.enablement} />
        </Section>

        {content.supplementalSections?.map((section) => (
          <Section
            key={section.title}
            eyebrow={section.eyebrow}
            title={section.title}
            description={section.description}
            tone={section.tone}
          >
            <CardGrid
              locale={locale}
              items={section.items}
              icons={[Handshake, Workflow, ShieldCheck, Rocket, LifeBuoy, Building2]}
              columns={section.columns}
              dark={section.tone === "dark"}
            />
          </Section>
        ))}

        <Section eyebrow={content.badge} title={content.nextStepsTitle} description={content.nextStepsDescription}>
          <LinkCardGrid locale={locale} items={content.nextStepsItems} icons={icons.nextSteps} />
        </Section>

        <Section eyebrow={content.badge} title={content.ctaTitle} description={content.ctaDescription} tone="muted" centered>
          <div className="flex justify-center">
            <Button asChild size="lg" className="h-14 rounded-full bg-zinc-950 px-8 text-sm font-medium text-white hover:bg-zinc-800">
              <Link href={localizeHref(locale, content.ctaHref)}>
                {content.ctaLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Section>
      </main>

      <Footer locale={locale as Locale} />
    </div>
  );
}
