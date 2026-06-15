import * as React from "react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import {
  Archive,
  ArrowRight,
  Bot,
  CalendarDays,
  CheckCircle2,
  Cloud,
  FileSpreadsheet,
  FileText,
  Files,
  FolderKanban,
  GlobeLock,
  KeyRound,
  ListTodo,
  LockKeyhole,
  Mail,
  MessageSquare,
  Network,
  Presentation,
  ShieldCheck,
  Sparkles,
  StickyNote,
  Users,
  Video,
  Waypoints,
} from "lucide-react";
import { Footer } from "@/components/public/Footer";
import { Header } from "@/components/public/Header";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/lib/locale";
import { cn } from "@/lib/utils";

interface OfficePageProps {
  locale: string;
}

interface SectionProps {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  tone?: "default" | "muted" | "dark";
  centered?: boolean;
  children: React.ReactNode;
}

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  accent?: string;
  dark?: boolean;
  compact?: boolean;
  githubHref?: string;
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

interface ComparisonCellProps {
  label: string;
  highlighted?: boolean;
}

function localizeHref(locale: string, href: string) {
  if (href.startsWith("http")) {
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
      {dark ? (
        <div
          aria-hidden={true}
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />
      ) : null}
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

function FeatureCard({ title, description, icon: Icon, accent, dark = false, compact = false, githubHref }: FeatureCardProps) {
  return (
    <div
      className={cn(
        "group relative h-full overflow-hidden rounded-4xl border p-6",
        dark ? "border-white/10 bg-white/4" : "border-zinc-200/80 bg-white shadow-[0_20px_60px_-40px_rgba(15,23,42,0.22)]",
        compact ? "p-5" : "p-6",
      )}
    >
      {accent ? <div aria-hidden={true} className={cn("absolute inset-x-0 top-0 h-1", accent)} /> : null}
      {githubHref ? (
        <a
          href={githubHref}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-xl border border-zinc-200 bg-white/90 text-zinc-400 opacity-0 transition-all duration-200 hover:border-zinc-300 hover:text-zinc-700 group-hover:opacity-100"
          aria-label="GitHub repository"
        >
          <GitHubIcon className="h-4 w-4" />
        </a>
      ) : null}
      <span
        className={cn(
          "inline-flex h-12 w-12 items-center justify-center rounded-2xl border",
          dark ? "border-white/10 bg-white/6 text-white" : "border-zinc-200 bg-zinc-50 text-zinc-700",
        )}
      >
        <Icon className="h-5 w-5" />
      </span>
      <h3 className={cn("mt-6 text-xl font-semibold tracking-[-0.03em]", dark ? "text-white" : "text-zinc-950")}>{title}</h3>
      <p className={cn("mt-3 text-sm leading-7", dark ? "text-white/64" : "text-zinc-600")}>{description}</p>
    </div>
  );
}

function MetricPill({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em]",
        dark ? "border-white/10 bg-white/5 text-white/72" : "border-zinc-200 bg-zinc-50 text-zinc-600",
      )}
    >
      {children}
    </span>
  );
}

function ComparisonCell({ label, highlighted = false }: ComparisonCellProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border px-4 py-3 text-sm leading-6",
        highlighted
          ? "border-zinc-950 bg-zinc-950 text-white"
          : "border-zinc-200 bg-zinc-50/80 text-zinc-600",
      )}
    >
      {label}
    </div>
  );
}

function HeroVisual() {
  return (
    <svg viewBox="0 0 1600 620" className="h-full w-full" fill="none" aria-hidden={true}>
      <defs>
        <linearGradient id="office-hero-fill" x1="0%" x2="100%" y1="0%" y2="0%">
          <stop offset="0%" stopColor="rgba(24,24,27,0.12)" />
          <stop offset="100%" stopColor="rgba(24,24,27,0.04)" />
        </linearGradient>
        <radialGradient id="office-hero-node" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(59,130,246,0.16)" />
          <stop offset="100%" stopColor="rgba(59,130,246,0)" />
        </radialGradient>
      </defs>

      <path
        d="M76 238C176 178 291 174 414 219C512 255 593 251 690 209C808 158 918 177 1016 263C1089 328 1160 331 1257 294C1352 258 1445 282 1532 357V446C1432 438 1341 407 1253 375C1153 338 1084 346 1002 396C904 456 787 452 678 383C587 326 506 318 398 348C286 379 177 357 76 291V238Z"
        fill="url(#office-hero-fill)"
      />
      <path
        d="M158 312C320 246 473 244 615 304C760 365 880 370 1012 315C1171 249 1304 278 1443 365"
        stroke="rgba(24,24,27,0.14)"
        strokeWidth="1.25"
      />
      <path
        d="M218 400C360 438 504 435 650 391C795 347 909 337 1048 377C1168 412 1285 424 1408 390"
        stroke="rgba(24,24,27,0.1)"
        strokeWidth="1.25"
      />
      <g fill="rgba(24,24,27,0.38)">
        {[
          [258, 322],
          [456, 286],
          [646, 326],
          [828, 276],
          [1018, 318],
          [1194, 348],
          [1392, 382],
        ].map(([cx, cy]) => (
          <g key={`${cx}-${cy}`}>
            <circle cx={cx} cy={cy} r="5.5" />
            <circle cx={cx} cy={cy} r="22" fill="url(#office-hero-node)" />
          </g>
        ))}
      </g>
    </svg>
  );
}

export async function OfficePage({ locale }: OfficePageProps) {
  const t = await getTranslations({ locale, namespace: "Public.office.page" });

  const trustItems = [
    { key: "openSource", icon: Sparkles },
    { key: "privacy", icon: LockKeyhole },
    { key: "deployment", icon: Cloud },
    { key: "security", icon: ShieldCheck },
    { key: "ecosystem", icon: Waypoints },
  ] as const;

  const overviewGroups = [
    { key: "communication", icon: MessageSquare },
    { key: "productivity", icon: FileText },
    { key: "storage", icon: Files },
    { key: "governance", icon: ShieldCheck },
  ] as const;

  const appItems = [
    { key: "mail", icon: Mail, accent: "bg-sky-500/80", repo: "aether-mail" },
    { key: "calendar", icon: CalendarDays, accent: "bg-indigo-500/80", repo: "aether-calendar" },
    { key: "drive", icon: Files, accent: "bg-cyan-500/80", repo: "aether-drive" },
    { key: "docs", icon: FileText, accent: "bg-blue-500/80", repo: "aether-docs" },
    { key: "sheets", icon: FileSpreadsheet, accent: "bg-emerald-500/80", repo: "aether-sheets" },
    { key: "slides", icon: Presentation, accent: "bg-amber-500/80", repo: "aether-slides" },
    { key: "meet", icon: Video, accent: "bg-violet-500/80", repo: "aether-meet" },
    { key: "chat", icon: MessageSquare, accent: "bg-fuchsia-500/80", repo: "aether-chat" },
    { key: "tasks", icon: ListTodo, accent: "bg-zinc-500/80", repo: "aether-tasks" },
    { key: "notes", icon: StickyNote, accent: "bg-orange-500/80", repo: "aether-notes" },
    { key: "forms", icon: CheckCircle2, accent: "bg-lime-500/80", repo: "aether-forms" },
    { key: "vault", icon: Archive, accent: "bg-rose-500/80", repo: "aether-vault" },
    { key: "identity", icon: Users, accent: "bg-slate-500/80", repo: "aether-identity" },
    { key: "vpn", icon: Network, accent: "bg-teal-500/80", repo: "aether-vpn" },
    { key: "aiAssistant", icon: Bot, accent: "bg-purple-500/80", repo: "aether-ai" },
  ] as const;

  const comparisonRows = ["openness", "sovereignty", "integration", "control", "ai"] as const;
  const faqItems = ["what", "deployment", "migration", "security", "ai", "ecosystem"] as const;

  return (
    <>
      <Header locale={locale as Locale} />

      <main className="bg-white text-zinc-950">
        <section className="relative overflow-hidden border-b border-zinc-200/80 bg-[linear-gradient(180deg,#ffffff_0%,#fafafa_100%)]">
          <div aria-hidden={true} className="pointer-events-none absolute inset-0">
            <div className="absolute inset-x-0 top-0 h-44 bg-[radial-gradient(circle_at_top,rgba(148,163,184,0.18),transparent_65%)]" />
            <div className="absolute inset-x-[-10%] top-[16%] h-[56%] opacity-95 sm:top-[18%] lg:inset-x-[-4%] lg:top-[19%] lg:h-[62%]">
              <HeroVisual />
            </div>
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.76),rgba(255,255,255,0.34)_30%,rgba(255,255,255,0.82)_100%)]" />
          </div>

          <div className="relative mx-auto flex min-h-[88vh] max-w-360 items-center px-6 py-20 sm:py-24 lg:px-12 lg:py-28">
            <div className="max-w-4xl">
              <SectionEyebrow>{t("hero.eyebrow")}</SectionEyebrow>
              <h1 className="mt-7 max-w-5xl text-[clamp(3.4rem,7vw,7rem)] font-semibold leading-[0.92] tracking-[-0.06em] text-zinc-950">
                {t("hero.title")}
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-600 sm:text-xl">{t("hero.description")}</p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
                <Button asChild size="lg" className="h-14 rounded-full bg-zinc-950 px-8 text-sm font-medium text-white hover:bg-zinc-800">
                  <Link href="#apps">
                    {t("hero.primaryCta")}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-14 rounded-full border-zinc-300 bg-white/85 px-8 text-sm font-medium text-zinc-950">
                  <Link href={localizeHref(locale, "/pricing")}>{t("hero.secondaryCta")}</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-14 rounded-full border-zinc-300 bg-white/85 px-8 text-sm font-medium text-zinc-950">
                  <Link href={localizeHref(locale, "/solutions/workplace")}>{t("hero.tertiaryCta")}</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <Section
          eyebrow={t("trust.eyebrow")}
          title={t("trust.title")}
          description={t("trust.description")}
          centered
        >
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {trustItems.map(({ key, icon }) => (
              <FeatureCard
                key={key}
                title={t(`trust.items.${key}.title`)}
                description={t(`trust.items.${key}.description`)}
                icon={icon}
                compact
              />
            ))}
          </div>
        </Section>

        <Section
          eyebrow={t("overview.eyebrow")}
          title={t("overview.title")}
          description={t("overview.description")}
          tone="muted"
        >
          <div className="grid gap-8 xl:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)] xl:items-start">
            <div className="space-y-6">
              <div className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-[0_20px_60px_-44px_rgba(15,23,42,0.22)]">
                <p className="text-base leading-8 text-zinc-600">{t("overview.body")}</p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {["teams", "it", "developers", "leaders"].map((key) => (
                    <div key={key} className="rounded-2xl border border-zinc-200 bg-zinc-50/75 px-4 py-3">
                      <div className="text-sm font-semibold text-zinc-950">{t(`overview.audiences.${key}.title`)}</div>
                      <div className="mt-1 text-xs leading-6 text-zinc-500">{t(`overview.audiences.${key}.description`)}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {["mail", "calendar", "drive", "docs", "meet", "chat", "identity", "ai"].map((key) => (
                  <MetricPill key={key}>{t(`overview.apps.${key}`)}</MetricPill>
                ))}
              </div>
            </div>

            <div className="grid gap-5">
              <div className="grid gap-4 md:grid-cols-2">
                {overviewGroups.map(({ key, icon }) => (
                  <FeatureCard
                    key={key}
                    title={t(`overview.groups.${key}.title`)}
                    description={t(`overview.groups.${key}.description`)}
                    icon={icon}
                    compact
                  />
                ))}
              </div>
            </div>
          </div>
        </Section>

        <Section eyebrow={t("apps.eyebrow")} title={t("apps.title")} description={t("apps.description")} id="apps">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
            {appItems.map(({ key, icon, accent, repo }) => (
              <FeatureCard
                key={key}
                title={t(`apps.items.${key}.title`)}
                description={t(`apps.items.${key}.description`)}
                icon={icon}
                accent={accent}
                compact
                githubHref={`https://github.com/skygenesisenterprise/${repo}`}
              />
            ))}
          </div>
        </Section>

        <Section eyebrow={t("collaboration.eyebrow")} title={t("collaboration.title")} description={t("collaboration.description")}>
          <div className="grid gap-8 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] xl:items-center">
            <div className="space-y-5">
              {[1, 2, 3].map((item) => (
                <div key={item} className="rounded-[1.8rem] border border-zinc-200 bg-zinc-50/70 p-6">
                  <div className="text-sm font-semibold tracking-[-0.02em] text-zinc-950">{t(`collaboration.points.${item}.title`)}</div>
                  <div className="mt-3 text-sm leading-7 text-zinc-600">{t(`collaboration.points.${item}.description`)}</div>
                </div>
              ))}
            </div>

            <div className="rounded-[2.4rem] border border-zinc-200 bg-white p-6 shadow-[0_32px_100px_-56px_rgba(15,23,42,0.3)]">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">{t("collaboration.visual.label")}</div>
                  <div className="mt-2 text-xl font-semibold tracking-[-0.03em] text-zinc-950">{t("collaboration.visual.title")}</div>
                </div>
                <MetricPill>{t("collaboration.visual.status")}</MetricPill>
              </div>
              <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                <div className="rounded-[1.6rem] border border-zinc-200 bg-zinc-950 p-5 text-white">
                  <div className="text-sm font-medium">{t("collaboration.visual.roomTitle")}</div>
                  <div className="mt-6 flex -space-x-2">
                    {[1, 2, 3, 4].map((item) => (
                      <span key={item} className="h-10 w-10 rounded-full border border-white/10 bg-white/10" />
                    ))}
                  </div>
                  <div className="mt-5 text-sm leading-7 text-white/60">{t("collaboration.visual.roomDescription")}</div>
                </div>
                <div className="space-y-3">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="rounded-[1.4rem] border border-zinc-200 bg-zinc-50/75 p-4">
                      <div className="text-sm font-semibold text-zinc-950">{t(`collaboration.visual.events.${item}.title`)}</div>
                      <div className="mt-2 text-xs leading-6 text-zinc-500">{t(`collaboration.visual.events.${item}.meta`)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Section>

        <Section eyebrow={t("communication.eyebrow")} title={t("communication.title")} description={t("communication.description")} tone="muted">
          <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] xl:items-center">
            <div className="grid gap-4 sm:grid-cols-2">
              {["mail", "chat", "meet", "calendar"].map((key) => (
                <div key={key} className="rounded-[1.8rem] border border-zinc-200 bg-white p-6">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">{t(`communication.apps.${key}.label`)}</div>
                  <div className="mt-3 text-lg font-semibold tracking-[-0.03em] text-zinc-950">{t(`communication.apps.${key}.title`)}</div>
                  <div className="mt-3 text-sm leading-7 text-zinc-600">{t(`communication.apps.${key}.description`)}</div>
                </div>
              ))}
            </div>

            <div className="rounded-[2.4rem] border border-zinc-200 bg-white p-6 shadow-[0_32px_100px_-56px_rgba(15,23,42,0.26)]">
              <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">{t("communication.visual.label")}</div>
              <div className="mt-2 text-xl font-semibold tracking-[-0.03em] text-zinc-950">{t("communication.visual.title")}</div>
              <div className="mt-6 grid gap-3">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="rounded-[1.4rem] border border-zinc-200 bg-zinc-50/75 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-zinc-950">{t(`communication.visual.timeline.${item}.title`)}</div>
                        <div className="mt-2 text-xs leading-6 text-zinc-500">{t(`communication.visual.timeline.${item}.description`)}</div>
                      </div>
                      <span className="rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-500">
                        {t(`communication.visual.timeline.${item}.tag`)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        <Section eyebrow={t("productivity.eyebrow")} title={t("productivity.title")} description={t("productivity.description")}>
          <div className="grid gap-8 xl:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] xl:items-center">
            <div className="rounded-[2.4rem] border border-zinc-200 bg-white p-6 shadow-[0_32px_100px_-56px_rgba(15,23,42,0.26)]">
              <div className="grid gap-4 sm:grid-cols-2">
                {["docs", "sheets", "slides", "notes", "forms", "tasks"].map((key) => (
                  <div key={key} className="rounded-[1.5rem] border border-zinc-200 bg-zinc-50/70 p-5">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">{t(`productivity.apps.${key}.label`)}</div>
                    <div className="mt-2 text-base font-semibold tracking-[-0.02em] text-zinc-950">{t(`productivity.apps.${key}.title`)}</div>
                    <div className="mt-2 text-sm leading-7 text-zinc-600">{t(`productivity.apps.${key}.description`)}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-5">
              {[1, 2, 3].map((item) => (
                <div key={item} className="rounded-[1.8rem] border border-zinc-200 bg-zinc-50/70 p-6">
                  <div className="text-sm font-semibold tracking-[-0.02em] text-zinc-950">{t(`productivity.points.${item}.title`)}</div>
                  <div className="mt-3 text-sm leading-7 text-zinc-600">{t(`productivity.points.${item}.description`)}</div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Section eyebrow={t("storage.eyebrow")} title={t("storage.title")} description={t("storage.description")} tone="muted">
          <div className="grid gap-8 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] xl:items-center">
            <div className="space-y-5">
              {[1, 2, 3].map((item) => (
                <div key={item} className="rounded-[1.8rem] border border-zinc-200 bg-white p-6">
                  <div className="text-sm font-semibold tracking-[-0.02em] text-zinc-950">{t(`storage.points.${item}.title`)}</div>
                  <div className="mt-3 text-sm leading-7 text-zinc-600">{t(`storage.points.${item}.description`)}</div>
                </div>
              ))}
            </div>

            <div className="rounded-[2.4rem] border border-zinc-200 bg-white p-6 shadow-[0_32px_100px_-56px_rgba(15,23,42,0.26)]">
              <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">{t("storage.visual.label")}</div>
              <div className="mt-2 text-xl font-semibold tracking-[-0.03em] text-zinc-950">{t("storage.visual.title")}</div>
              <div className="mt-6 grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px]">
                <div className="space-y-3">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="rounded-[1.4rem] border border-zinc-200 bg-zinc-50/75 p-4">
                      <div className="text-sm font-semibold text-zinc-950">{t(`storage.visual.folders.${item}.title`)}</div>
                      <div className="mt-2 text-xs leading-6 text-zinc-500">{t(`storage.visual.folders.${item}.meta`)}</div>
                    </div>
                  ))}
                </div>
                <div className="rounded-[1.6rem] border border-zinc-200 bg-zinc-950 p-5 text-white">
                  <div className="text-sm font-medium">{t("storage.visual.permissionsTitle")}</div>
                  <div className="mt-4 space-y-2">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/72">
                        {t(`storage.visual.permissions.${item}`)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Section>

        <Section eyebrow={t("security.eyebrow")} title={t("security.title")} description={t("security.description")} tone="dark">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {["identity", "vault", "vpn", "compliance"].map((key) => (
              <FeatureCard
                key={key}
                title={t(`security.items.${key}.title`)}
                description={t(`security.items.${key}.description`)}
                icon={
                  key === "identity"
                    ? Users
                    : key === "vault"
                      ? Archive
                      : key === "vpn"
                        ? Network
                        : GlobeLock
                }
                dark
              />
            ))}
          </div>
        </Section>

        <Section eyebrow={t("ai.eyebrow")} title={t("ai.title")} description={t("ai.description")}>
          <div className="grid gap-8 xl:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] xl:items-center">
            <div className="rounded-[2.4rem] border border-zinc-200 bg-zinc-950 p-6 text-white shadow-[0_32px_100px_-56px_rgba(15,23,42,0.4)]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/46">{t("ai.visual.label")}</div>
                  <div className="mt-2 text-xl font-semibold tracking-[-0.03em] text-white">{t("ai.visual.title")}</div>
                </div>
                <Sparkles className="h-5 w-5 text-white/70" />
              </div>
              <div className="mt-6 rounded-[1.6rem] border border-white/10 bg-white/5 p-5">
                <div className="text-sm font-medium text-white">{t("ai.visual.prompt")}</div>
                <div className="mt-4 text-sm leading-7 text-white/68">{t("ai.visual.answer")}</div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {["write", "summarize", "organize", "automate"].map((key) => (
                <FeatureCard
                  key={key}
                  title={t(`ai.items.${key}.title`)}
                  description={t(`ai.items.${key}.description`)}
                  icon={key === "write" ? FileText : key === "summarize" ? MessageSquare : key === "organize" ? FolderKanban : Bot}
                />
              ))}
            </div>
          </div>
        </Section>

        <Section eyebrow={t("enterprise.eyebrow")} title={t("enterprise.title")} description={t("enterprise.description")} tone="muted">
          <div className="grid gap-8 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] xl:items-center">
            <div className="space-y-5">
              {[1, 2, 3].map((item) => (
                <div key={item} className="rounded-[1.8rem] border border-zinc-200 bg-white p-6">
                  <div className="text-sm font-semibold tracking-[-0.02em] text-zinc-950">{t(`enterprise.points.${item}.title`)}</div>
                  <div className="mt-3 text-sm leading-7 text-zinc-600">{t(`enterprise.points.${item}.description`)}</div>
                </div>
              ))}
            </div>

            <div className="rounded-[2.4rem] border border-zinc-200 bg-white p-6 shadow-[0_32px_100px_-56px_rgba(15,23,42,0.26)]">
              <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">{t("enterprise.visual.label")}</div>
              <div className="mt-2 text-xl font-semibold tracking-[-0.03em] text-zinc-950">{t("enterprise.visual.title")}</div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {["users", "domains", "groups", "logs"].map((key) => (
                  <div key={key} className="rounded-[1.4rem] border border-zinc-200 bg-zinc-50/75 p-4">
                    <div className="text-sm font-semibold text-zinc-950">{t(`enterprise.visual.cards.${key}.title`)}</div>
                    <div className="mt-2 text-xs leading-6 text-zinc-500">{t(`enterprise.visual.cards.${key}.description`)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        <Section eyebrow={t("developers.eyebrow")} title={t("developers.title")} description={t("developers.description")} tone="dark">
          <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] xl:items-center">
            <div className="grid gap-4 sm:grid-cols-2">
              {["developer", "apis", "sdks", "automation"].map((key) => (
                <FeatureCard
                  key={key}
                  title={t(`developers.items.${key}.title`)}
                  description={t(`developers.items.${key}.description`)}
                  icon={key === "developer" ? Waypoints : key === "apis" ? ArrowRight : key === "sdks" ? Files : FolderKanban}
                  dark
                />
              ))}
            </div>

            <div className="rounded-[2.4rem] border border-white/10 bg-white/4 p-6">
              <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/46">{t("developers.visual.label")}</div>
              <div className="mt-2 text-xl font-semibold tracking-[-0.03em] text-white">{t("developers.visual.title")}</div>
              <div className="mt-6 space-y-3">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="rounded-[1.4rem] border border-white/10 bg-white/4 p-4">
                    <div className="text-sm font-semibold text-white">{t(`developers.visual.flow.${item}.title`)}</div>
                    <div className="mt-2 text-xs leading-6 text-white/62">{t(`developers.visual.flow.${item}.description`)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        <Section eyebrow={t("deployment.eyebrow")} title={t("deployment.title")} description={t("deployment.description")}>
          <div className="grid gap-4 xl:grid-cols-3">
            {["cloud", "selfHosted", "hybrid"].map((key) => (
              <div key={key} className="rounded-4xl border border-zinc-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.22)]">
                <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">{t(`deployment.cards.${key}.label`)}</div>
                <div className="mt-3 text-xl font-semibold tracking-[-0.03em] text-zinc-950">{t(`deployment.cards.${key}.title`)}</div>
                <div className="mt-3 text-sm leading-7 text-zinc-600">{t(`deployment.cards.${key}.description`)}</div>
                <div className="mt-5 space-y-2">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="rounded-2xl border border-zinc-200 bg-zinc-50/80 px-4 py-3 text-sm text-zinc-600">
                      {t(`deployment.cards.${key}.points.${item}`)}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section eyebrow={t("comparison.eyebrow")} title={t("comparison.title")} description={t("comparison.description")} tone="muted">
          <div className="overflow-hidden rounded-[2.4rem] border border-zinc-200 bg-white shadow-[0_20px_60px_-40px_rgba(15,23,42,0.22)]">
            <div className="grid gap-px bg-zinc-200 lg:grid-cols-[minmax(220px,0.95fr)_minmax(0,1fr)_minmax(0,1fr)]">
              <div className="bg-zinc-50 px-6 py-5 text-sm font-semibold text-zinc-500">{t("comparison.headers.dimension")}</div>
              <div className="bg-white px-6 py-5 text-sm font-semibold text-zinc-950">{t("comparison.headers.aether")}</div>
              <div className="bg-zinc-50 px-6 py-5 text-sm font-semibold text-zinc-600">{t("comparison.headers.closed")}</div>

              {comparisonRows.map((row) => (
                <React.Fragment key={row}>
                  <div className="bg-zinc-50 px-6 py-5 text-sm font-medium text-zinc-700">{t(`comparison.rows.${row}.label`)}</div>
                  <div className="bg-white px-6 py-4">
                    <ComparisonCell label={t(`comparison.rows.${row}.aether`)} highlighted />
                  </div>
                  <div className="bg-zinc-50 px-6 py-4">
                    <ComparisonCell label={t(`comparison.rows.${row}.closed`)} />
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </Section>

        <Section eyebrow={t("faq.eyebrow")} title={t("faq.title")} description={t("faq.description")}>
          <div className="grid gap-4 lg:grid-cols-2">
            {faqItems.map((item) => (
              <div key={item} className="rounded-[1.75rem] border border-zinc-200 bg-white p-6 shadow-[0_20px_60px_-48px_rgba(15,23,42,0.2)]">
                <div className="flex items-start gap-4">
                  <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-zinc-50 text-xs font-semibold text-zinc-500">
                    {t(`faq.items.${item}.index`)}
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold tracking-[-0.03em] text-zinc-950">{t(`faq.items.${item}.question`)}</h3>
                    <p className="mt-3 text-sm leading-7 text-zinc-600">{t(`faq.items.${item}.answer`)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section eyebrow={t("finalCta.eyebrow")} title={t("finalCta.title")} description={t("finalCta.description")}>
          <div className="rounded-[2.6rem] border border-zinc-200 bg-zinc-950 p-8 text-white shadow-[0_40px_120px_-60px_rgba(15,23,42,0.5)] sm:p-10">
            <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-end">
              <div>
                <div className="flex flex-wrap gap-2.5">
                  {[1, 2, 3].map((item) => (
                    <MetricPill key={item} dark>
                      {t(`finalCta.signals.${item}`)}
                    </MetricPill>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="h-12 rounded-full bg-white px-6 text-sm text-zinc-950 hover:bg-zinc-100">
                  <Link href={localizeHref(locale, "/pricing")}>{t("finalCta.primaryCta")}</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-12 rounded-full border-white/16 bg-transparent px-6 text-sm text-white hover:bg-white/8 hover:text-white"
                >
                  <Link href={localizeHref(locale, "/company/contact")}>{t("finalCta.secondaryCta")}</Link>
                </Button>
              </div>
            </div>
          </div>
        </Section>
      </main>

      <Footer locale={locale as Locale} />
    </>
  );
}
