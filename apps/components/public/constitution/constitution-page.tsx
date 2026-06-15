import * as React from "react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import {
  ArrowRight,
  Building2,
  Landmark,
  Leaf,
  Network,
  Orbit,
  Scale,
  Shield,
  Sparkles,
  Telescope,
} from "lucide-react";
import { Footer } from "@/components/public/Footer";
import { Header } from "@/components/public/Header";
import type { Locale } from "@/lib/locale";
import { cn } from "@/lib/utils";

interface ConstitutionPageProps {
  locale: string;
}

interface ConstitutionPageContentProps extends ConstitutionPageProps {
  t: (key: string) => string;
}

interface SectionProps {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  tone?: "default" | "muted" | "dark";
  children: React.ReactNode;
}

interface GovernanceCardProps {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface LocalizedLinkProps {
  locale: string;
  href: string;
  children: React.ReactNode;
  className?: string;
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
        inverted ? "text-background/60" : "text-muted-foreground",
      )}
    >
      <span className={cn("h-px w-10", inverted ? "bg-background/20" : "bg-border")} />
      {children}
    </span>
  );
}

function Section({ id, eyebrow, title, description, tone = "default", children }: SectionProps) {
  const dark = tone === "dark";

  return (
    <section
      id={id}
      className={cn(
        "relative overflow-hidden py-24 sm:py-28 lg:py-32",
        tone === "muted" && "bg-muted",
        dark && "bg-foreground text-background",
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
        <div className="mx-auto max-w-4xl">
          {eyebrow ? <SectionEyebrow inverted={dark}>{eyebrow}</SectionEyebrow> : null}
          <div>
            <h2
              className={cn(
                "mt-6 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl lg:text-6xl",
                dark ? "text-background" : "text-foreground",
              )}
            >
              {title}
            </h2>
            {description ? (
              <p className={cn("mt-6 text-lg leading-8", dark ? "text-background/68" : "text-muted-foreground")}>
                {description}
              </p>
            ) : null}
          </div>
        </div>
        <div className="mt-14">{children}</div>
      </div>
    </section>
  );
}

function LocalizedLink({ locale, href, children, className }: LocalizedLinkProps) {
  return (
    <Link href={localizeHref(locale, href)} className={className}>
      {children}
    </Link>
  );
}

function ConstitutionHeroVisual() {
  const nodes = [
    { cx: 262, cy: 180, label: "NA" },
    { cx: 452, cy: 148, label: "EU" },
    { cx: 654, cy: 205, label: "AP" },
    { cx: 514, cy: 272, label: "INT" },
  ];

  return (
    <div className="relative overflow-hidden rounded-[2.5rem] border border-border/80 bg-card p-6 shadow-[0_32px_100px_-56px_rgba(15,23,42,0.3)]">
      <div
        aria-hidden={true}
        className="absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_top_left,rgba(148,163,184,0.18),transparent_58%)]"
      />
      <svg viewBox="0 0 760 420" className="relative h-full w-full" fill="none" aria-hidden={true}>
        <defs>
          <linearGradient id="constitution-grid" x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(15,23,42,0.12)" />
            <stop offset="100%" stopColor="rgba(15,23,42,0.03)" />
          </linearGradient>
        </defs>

        <rect x="0" y="0" width="760" height="420" rx="28" fill="url(#constitution-grid)" />
        <g opacity="0.12" stroke="rgba(15,23,42,0.32)" strokeWidth="1">
          {Array.from({ length: 9 }).map((_, index) => (
            <line key={`v-${index}`} x1={80 + index * 75} x2={80 + index * 75} y1="44" y2="376" />
          ))}
          {Array.from({ length: 5 }).map((_, index) => (
            <line key={`h-${index}`} x1="68" x2="692" y1={78 + index * 62} y2={78 + index * 62} />
          ))}
        </g>

        <g opacity="0.22" fill="rgba(15,23,42,0.7)">
          <path d="M91 156C132 128 178 115 238 119C286 122 324 137 361 160C388 177 421 180 452 168C499 150 546 148 596 165C629 176 658 196 688 228V298C651 278 617 266 576 262C527 257 484 267 442 287C407 303 370 307 332 300C283 291 240 294 197 315C158 335 124 343 91 346V156Z" />
        </g>

        <g stroke="rgba(15,23,42,0.22)" strokeWidth="2">
          <path d="M514 272C480 231 465 183 452 148" />
          <path d="M514 272C452 245 362 226 262 180" />
          <path d="M514 272C566 254 617 228 654 205" />
        </g>

        {nodes.map((node) => (
          <g key={node.label}>
            <circle cx={node.cx} cy={node.cy} r="14" fill="rgba(15,23,42,0.88)" />
            <circle cx={node.cx} cy={node.cy} r="34" fill="rgba(15,23,42,0.06)" />
            <text
              x={node.cx}
              y={node.cy + 4}
              textAnchor="middle"
              className="fill-white text-[10px] font-semibold tracking-[0.18em]"
            >
              {node.label}
            </text>
          </g>
        ))}

        <g>
          <rect x="72" y="312" width="616" height="44" rx="22" fill="rgba(255,255,255,0.76)" stroke="rgba(15,23,42,0.1)" />
          <text x="108" y="339" className="fill-[rgba(15,23,42,0.7)] text-[11px] font-semibold uppercase tracking-[0.24em]">
            Federal charter
          </text>
          <text x="315" y="339" className="fill-[rgba(15,23,42,0.5)] text-[11px] font-medium uppercase tracking-[0.18em]">
            Coordinated sovereignty
          </text>
          <text x="530" y="339" className="fill-[rgba(15,23,42,0.5)] text-[11px] font-medium uppercase tracking-[0.18em]">
            Global alignment
          </text>
        </g>
      </svg>
    </div>
  );
}

function HomeAlignedHero({ t }: { t: (key: string) => string }) {
  return (
    <section className="relative overflow-hidden border-b border-border/80 bg-linear-to-b from-background to-muted">
      <div aria-hidden={true} className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-44 bg-[radial-gradient(circle_at_top,rgba(148,163,184,0.18),transparent_65%)]" />
        <div className="absolute inset-0 bg-linear-to-b from-background/72 via-background/28 to-background/84" />
      </div>

      <div className="relative mx-auto flex min-h-[92vh] max-w-360 items-center px-6 py-20 sm:py-24 lg:px-12 lg:py-28">
        <div className="grid w-full gap-12 xl:grid-cols-[minmax(0,0.94fr)_minmax(0,0.88fr)] xl:items-end">
          <div className="max-w-4xl">
            <SectionEyebrow>{t("hero.eyebrow")}</SectionEyebrow>
            <h1 className="mt-7 max-w-5xl text-[clamp(3.2rem,6.5vw,6.6rem)] font-semibold leading-[0.92] tracking-[-0.06em] text-foreground">
              {t("hero.title")}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground sm:text-xl">{t("hero.description")}</p>
            <div className="mt-10 grid max-w-3xl gap-3 sm:grid-cols-2">
              {["federation", "governance", "continuity", "autonomy"].map((item) => (
                <div key={item} className="rounded-[1.5rem] border border-border/80 bg-background/82 px-5 py-4 backdrop-blur-sm">
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    {t(`hero.signals.${item}.label`)}
                  </div>
                  <div className="mt-2 text-sm leading-7 text-foreground">{t(`hero.signals.${item}.value`)}</div>
                </div>
              ))}
            </div>
          </div>
          <ConstitutionHeroVisual />
        </div>
      </div>
    </section>
  );
}

function PreambleSection({ t }: { t: (key: string) => string }) {
  return (
    <Section id="preamble" eyebrow={t("preamble.eyebrow")} title={t("preamble.title")} description={t("preamble.description")}>
      <div className="mx-auto max-w-5xl rounded-[2.5rem] border border-border bg-card p-8 shadow-[0_24px_80px_-52px_rgba(15,23,42,0.24)] sm:p-12">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.3fr)_minmax(0,1fr)]">
          <div className="rounded-[1.75rem] border border-border bg-muted px-6 py-5">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">{t("preamble.panel.label")}</div>
            <div className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-foreground">{t("preamble.panel.value")}</div>
          </div>
          <div className="rounded-[1.75rem] border border-border bg-background px-6 py-6">
            <p className="text-base leading-8 text-muted-foreground">{t("preamble.body")}</p>
          </div>
        </div>
      </div>
    </Section>
  );
}

function PrinciplesSection({ t }: { t: (key: string) => string }) {
  const principles = [
    { key: "innovation", icon: Sparkles },
    { key: "sovereignty", icon: Shield },
    { key: "openness", icon: Orbit },
    { key: "sustainability", icon: Leaf },
    { key: "regionalAutonomy", icon: Building2 },
    { key: "longTermVision", icon: Telescope },
  ];

  return (
    <Section
      id="principles"
      eyebrow={t("principles.eyebrow")}
      title={t("principles.title")}
      description={t("principles.description")}
      tone="muted"
    >
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {principles.map((principle) => (
          <div
            key={principle.key}
            className="group rounded-4xl border border-border bg-card p-7 shadow-[0_20px_60px_-45px_rgba(15,23,42,0.24)] transition duration-300 hover:-translate-y-1 hover:border-foreground/15"
          >
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-muted text-muted-foreground">
              <principle.icon className="h-5 w-5" />
            </span>
            <h3 className="mt-8 text-2xl font-semibold tracking-[-0.04em] text-foreground">
              {t(`principles.items.${principle.key}.title`)}
            </h3>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              {t(`principles.items.${principle.key}.description`)}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}

function FederalOrganizationSection({ t }: { t: (key: string) => string }) {
  const regions = ["europe", "asiaPacific", "northAmerica"] as const;
  const nationalEntities = ["france", "belgium", "germany", "japan", "singapore", "canada"] as const;

  return (
    <Section
      id="organization"
      eyebrow={t("organization.eyebrow")}
      title={t("organization.title")}
      description={t("organization.description")}
    >
      <div className="mx-auto max-w-6xl rounded-[2.5rem] border border-border bg-card p-6 shadow-[0_30px_100px_-60px_rgba(15,23,42,0.28)] sm:p-8">
        <div className="grid gap-8">
          <div className="flex justify-center">
            <div className="min-w-70 rounded-[1.9rem] border border-foreground/10 bg-foreground px-8 py-7 text-center text-background shadow-[0_18px_70px_-38px_rgba(15,23,42,0.45)]">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-background/50">{t("organization.root.eyebrow")}</div>
              <div className="mt-3 text-3xl font-semibold tracking-[-0.04em]">{t("organization.root.title")}</div>
              <p className="mt-3 text-sm leading-7 text-background/64">{t("organization.root.description")}</p>
            </div>
          </div>

          <div className="hidden justify-center lg:flex" aria-hidden={true}>
            <div className="h-12 w-px bg-border" />
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {regions.map((region) => (
              <div key={region} className="rounded-[1.9rem] border border-border bg-muted p-6">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  {t(`organization.regions.${region}.eyebrow`)}
                </div>
                <div className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-foreground">
                  {t(`organization.regions.${region}.title`)}
                </div>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {t(`organization.regions.${region}.description`)}
                </p>
              </div>
            ))}
          </div>

          <div className="rounded-[1.9rem] border border-border bg-background p-6 sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  {t("organization.nationals.eyebrow")}
                </div>
                <div className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-foreground">
                  {t("organization.nationals.title")}
                </div>
              </div>
              <span className="hidden rounded-full border border-border bg-muted px-4 py-2 text-xs uppercase tracking-[0.18em] text-muted-foreground sm:inline-flex">
                {t("organization.nationals.badge")}
              </span>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {nationalEntities.map((entity) => (
                <div key={entity} className="rounded-[1.5rem] border border-border bg-card px-5 py-4">
                  <div className="text-sm font-semibold text-foreground">{t(`organization.nationals.items.${entity}.title`)}</div>
                  <div className="mt-2 text-sm leading-6 text-muted-foreground">
                    {t(`organization.nationals.items.${entity}.description`)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

function DistributionOfPowersSection({ t }: { t: (key: string) => string }) {
  const columns = ["international", "regional", "national"] as const;

  return (
    <Section
      id="powers"
      eyebrow={t("powers.eyebrow")}
      title={t("powers.title")}
      description={t("powers.description")}
      tone="dark"
    >
      <div className="grid gap-5 xl:grid-cols-3">
        {columns.map((column) => (
          <div key={column} className="rounded-4xl border border-background/10 bg-background/4 p-7">
            <div className="inline-flex rounded-full border border-background/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-background/52">
              {t(`powers.columns.${column}.eyebrow`)}
            </div>
            <h3 className="mt-6 text-2xl font-semibold tracking-[-0.04em] text-background">
              {t(`powers.columns.${column}.title`)}
            </h3>
            <p className="mt-4 text-sm leading-7 text-background/64">{t(`powers.columns.${column}.description`)}</p>
            <div className="mt-8 space-y-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="rounded-[1.5rem] border border-background/10 bg-background/3 px-5 py-4 text-sm leading-7 text-background/78">
                  {t(`powers.columns.${column}.items.${item}`)}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function GovernanceCard({ title, description, icon: Icon }: GovernanceCardProps) {
  return (
    <div className="rounded-4xl border border-border bg-card p-7 shadow-[0_20px_60px_-45px_rgba(15,23,42,0.24)]">
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-muted text-muted-foreground">
        <Icon className="h-5 w-5" />
      </span>
      <h3 className="mt-8 text-2xl font-semibold tracking-[-0.04em] text-foreground">{title}</h3>
      <p className="mt-4 text-sm leading-7 text-muted-foreground">{description}</p>
    </div>
  );
}

function GovernanceSection({ t }: { t: (key: string) => string }) {
  return (
    <Section id="governance" eyebrow={t("governance.eyebrow")} title={t("governance.title")} description={t("governance.description")}>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <GovernanceCard
          title={t("governance.items.federalCouncil.title")}
          description={t("governance.items.federalCouncil.description")}
          icon={Landmark}
        />
        <GovernanceCard
          title={t("governance.items.internationalCeo.title")}
          description={t("governance.items.internationalCeo.description")}
          icon={Scale}
        />
        <GovernanceCard
          title={t("governance.items.regionalCeos.title")}
          description={t("governance.items.regionalCeos.description")}
          icon={Network}
        />
        <GovernanceCard
          title={t("governance.items.nationalCeos.title")}
          description={t("governance.items.nationalCeos.description")}
          icon={Building2}
        />
      </div>
    </Section>
  );
}

function ConstitutionalHistorySection({ t }: { t: (key: string) => string }) {
  return (
    <Section
      id="history"
      eyebrow={t("history.eyebrow")}
      title={t("history.title")}
      description={t("history.description")}
      tone="muted"
    >
      <div className="mx-auto max-w-5xl rounded-[2.5rem] border border-border bg-card p-8 shadow-[0_24px_80px_-52px_rgba(15,23,42,0.24)] sm:p-10">
        <div className="grid gap-6 md:grid-cols-[120px_minmax(0,1fr)] md:items-start">
          <div className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">{t("history.timeline.current.date")}</div>
          <div className="relative rounded-[1.75rem] border border-border bg-background px-6 py-6">
            <div className="absolute left-0 top-8 hidden h-px w-12 -translate-x-full bg-border md:block" />
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              {t("history.timeline.current.badge")}
            </div>
            <div className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-foreground">
              {t("history.timeline.current.title")}
            </div>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">{t("history.timeline.current.description")}</p>
          </div>
        </div>
      </div>
    </Section>
  );
}

function FutureArticlesSection({ t }: { t: (key: string) => string }) {
  return (
    <Section id="articles" eyebrow={t("articles.eyebrow")} title={t("articles.title")} description={t("articles.description")}>
      <div className="grid gap-8 xl:grid-cols-[minmax(0,0.84fr)_minmax(0,1.16fr)] xl:items-start">
        <div className="rounded-4xl border border-border bg-muted p-7">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">{t("articles.framework.eyebrow")}</div>
          <div className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-foreground">{t("articles.framework.title")}</div>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">{t("articles.framework.description")}</p>
        </div>
        <div className="grid gap-4">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="rounded-[1.75rem] border border-border bg-card px-6 py-5 shadow-[0_20px_60px_-45px_rgba(15,23,42,0.18)]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    {t(`articles.items.${item}.eyebrow`)}
                  </div>
                  <div className="mt-2 text-xl font-semibold tracking-[-0.03em] text-foreground">
                    {t(`articles.items.${item}.title`)}
                  </div>
                </div>
                <span className="rounded-full border border-border bg-muted px-4 py-2 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  {t(`articles.items.${item}.status`)}
                </span>
              </div>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">{t(`articles.items.${item}.description`)}</p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

function InstitutionalFooterNav({ locale, t }: ConstitutionPageContentProps) {
  const links = [
    { key: "constitution", href: "/constitution" },
    { key: "governance", href: "/company/leadership" },
    { key: "leadership", href: "/company/leadership" },
    { key: "transparency", href: "/security/trust" },
    { key: "legalFramework", href: "/legal/terms" },
  ];

  return (
    <section className="border-t border-border/80 bg-background">
      <div className="mx-auto max-w-360 px-6 py-12 lg:px-12">
        <div className="rounded-4xl border border-border bg-muted px-6 py-6 sm:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">{t("institutionalFooter.eyebrow")}</div>
              <div className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-foreground">{t("institutionalFooter.title")}</div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
              {links.map((link) => (
                <LocalizedLink
                  key={link.key}
                  locale={locale}
                  href={link.href}
                  className="group inline-flex items-center justify-between rounded-full border border-border bg-background px-5 py-3 text-sm font-medium text-foreground transition hover:border-foreground/15"
                >
                  {t(`institutionalFooter.links.${link.key}`)}
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </LocalizedLink>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export async function ConstitutionPage({ locale }: ConstitutionPageProps) {
  const translate = await getTranslations({ locale, namespace: "Public.constitution.page" });
  const t = (key: string) => translate(key);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header locale={locale as Locale} />
      <main className="flex-1 overflow-x-hidden">
        <HomeAlignedHero t={t} />
        <PreambleSection t={t} />
        <PrinciplesSection t={t} />
        <FederalOrganizationSection t={t} />
        <DistributionOfPowersSection t={t} />
        <GovernanceSection t={t} />
        <ConstitutionalHistorySection t={t} />
        <FutureArticlesSection t={t} />
      </main>
      <InstitutionalFooterNav locale={locale} t={t} />
      <Footer locale={locale as Locale} />
    </div>
  );
}
