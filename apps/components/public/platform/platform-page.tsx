import * as React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Banknote,
  Blocks,
  Brain,
  Braces,
  Cloud,
  Code2,
  Activity,
  Database,
  Fingerprint,
  Globe2,
  Layers3,
  LockKeyhole,
  Megaphone,
  Network,
  Radio,
  RadioTower,
  Route,
  Server,
  ShieldCheck,
  Terminal,
  Users,
  Vault,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { Button } from "@/components/ui/button";
import { platformConfigList, type PlatformConfig, type PlatformIcon } from "@/data/platform";
import type { Locale } from "@/lib/locale";
import { cn } from "@/lib/utils";

export interface PlatformMetric {
  value: string;
  label: string;
}

export interface PlatformProductCopy {
  name: string;
  description: string;
}

export interface PlatformSectionItem {
  title: string;
  description: string;
}

export interface PlatformSectionCopy {
  eyebrow: string;
  title: string;
  description: string;
  items: PlatformSectionItem[];
}

export interface PlatformPageCopy {
  metadata: {
    title: string;
    description: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    statement: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
  };
  mission: {
    eyebrow: string;
    statement: string;
    description: string;
  };
  labels: {
    platformEcosystem: string;
    integrationSurface: string;
    sovereigntyStatement: string;
  };
  products: PlatformProductCopy[];
  metrics: PlatformMetric[];
  sections: {
    ecosystem: PlatformSectionCopy;
    operatingModel: PlatformSectionCopy;
    architecture: PlatformSectionCopy & { flow: PlatformSectionItem[] };
    controlPlane: PlatformSectionCopy;
    workflow: PlatformSectionCopy;
    dataGovernance: PlatformSectionCopy;
    identityAccess: PlatformSectionCopy;
    security: PlatformSectionCopy;
    api: PlatformSectionCopy & { endpoints: string[] };
    observability: PlatformSectionCopy;
    rollout: PlatformSectionCopy;
    global: PlatformSectionCopy;
  };
  cta: {
    eyebrow: string;
    title: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
  };
}

export interface PlatformOverviewCopy {
  metadata: {
    title: string;
    description: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    description: string;
  };
  domains: {
    eyebrow: string;
    title: string;
    description: string;
  };
  pages: Record<string, { title: string; description: string }>;
}

interface PlatformPageProps {
  locale: string;
  config: PlatformConfig;
  copy: PlatformPageCopy;
}

interface PlatformOverviewPageProps {
  locale: string;
  copy: PlatformOverviewCopy;
}

interface PlatformSectionShellProps {
  eyebrow: string;
  title: string;
  description?: string;
  tone?: "default" | "muted" | "dark";
  centered?: boolean;
  children: React.ReactNode;
}

const iconMap: Record<PlatformIcon, LucideIcon> = {
  api: Braces,
  bank: Banknote,
  blocks: Blocks,
  brain: Brain,
  broadcast: Radio,
  cloud: Cloud,
  code: Code2,
  database: Database,
  edge: RadioTower,
  globe: Globe2,
  identity: Fingerprint,
  lock: LockKeyhole,
  media: Megaphone,
  network: Network,
  route: Route,
  server: Server,
  shield: ShieldCheck,
  terminal: Terminal,
  vault: Vault,
  workflow: Workflow,
};

export function localizeHref(locale: string, href: string) {
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

function PlatformSectionShell({
  eyebrow,
  title,
  description,
  tone = "default",
  centered = false,
  children,
}: PlatformSectionShellProps) {
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

function WorldMap({ inverted = false }: { inverted?: boolean }) {
  const stroke = inverted ? "rgba(255,255,255,0.2)" : "rgba(24,24,27,0.2)";
  const fill = inverted ? "rgba(255,255,255,0.18)" : "rgba(24,24,27,0.16)";
  const node = inverted ? "rgba(255,255,255,0.55)" : "rgba(24,24,27,0.48)";
  const glow = inverted ? "rgba(99,102,241,0.18)" : "rgba(59,130,246,0.12)";

  return (
    <svg viewBox="0 0 1600 620" className="h-full w-full" fill="none" aria-hidden={true}>
      <rect width="1600" height="620" fill={glow} opacity="0.22" />
      <path
        d="M95 203C140 173 204 154 285 155C335 156 384 165 432 187C452 196 476 193 498 184C549 164 608 155 683 157C727 158 764 170 798 190C816 201 841 202 864 196C914 183 956 187 991 212C1020 233 1048 238 1086 231C1148 220 1212 223 1281 244C1328 258 1370 280 1415 312C1448 335 1487 354 1528 366L1528 432C1483 433 1445 425 1408 409C1361 390 1313 378 1258 376C1199 373 1146 388 1093 413C1060 428 1024 432 988 425C950 418 916 421 880 435C842 450 803 456 748 455C692 454 647 442 605 417C557 388 507 378 448 384C382 391 323 382 267 353C226 331 181 314 128 304L95 302V203Z"
        fill={fill}
      />
      <path
        d="M240 284C376 231 517 230 640 271C731 301 821 307 930 274C1061 235 1188 255 1340 337"
        stroke={stroke}
        strokeWidth="1.25"
      />
      <path
        d="M264 348C403 403 516 415 646 390C772 365 885 328 1008 347C1113 363 1221 394 1317 432"
        stroke={stroke}
        strokeWidth="1.25"
      />
      {[
        [252, 286],
        [388, 244],
        [612, 285],
        [796, 302],
        [1008, 272],
        [1218, 320],
        [1324, 374],
      ].map(([cx, cy]) => (
        <g key={`${cx}-${cy}`}>
          <circle cx={cx} cy={cy} r="5.5" fill={node} />
          <circle cx={cx} cy={cy} r="20" fill={glow} />
        </g>
      ))}
    </svg>
  );
}

function PlatformHero({ locale, config, copy }: PlatformPageProps) {
  return (
    <section className="relative overflow-hidden border-b border-zinc-200/80 bg-[linear-gradient(180deg,#ffffff_0%,#fafafa_100%)]">
      <div aria-hidden={true} className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-44 bg-[radial-gradient(circle_at_top,rgba(148,163,184,0.18),transparent_65%)]" />
        <div className="absolute inset-x-[-14%] top-[13%] h-[58%] opacity-95 sm:top-[17%] lg:inset-x-[-4%] lg:top-[17%] lg:h-[64%]">
          <WorldMap />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.78),rgba(255,255,255,0.38)_32%,rgba(255,255,255,0.86)_100%)]" />
      </div>

      <div className="relative mx-auto flex min-h-[88vh] max-w-360 items-center px-6 py-20 sm:py-24 lg:px-12 lg:py-28">
        <div className="max-w-5xl">
          <SectionEyebrow>{copy.hero.eyebrow}</SectionEyebrow>
          <h1 className="mt-7 max-w-6xl text-[clamp(3.35rem,6.8vw,7rem)] font-semibold leading-[0.92] tracking-[-0.06em] text-zinc-950">
            {copy.hero.title}
          </h1>
          <p className="mt-7 max-w-3xl text-2xl font-medium leading-10 tracking-[-0.04em] text-zinc-800">
            {copy.hero.statement}
          </p>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-600 sm:text-xl">{copy.hero.description}</p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button asChild size="lg" className="h-14 rounded-full bg-zinc-950 px-8 text-sm font-medium text-white hover:bg-zinc-800">
              <Link href={localizeHref(locale, config.primaryHref)}>
                {copy.hero.primaryCta}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-14 rounded-full border-zinc-300 bg-white/85 px-8 text-sm font-medium text-zinc-950">
              <Link href={localizeHref(locale, config.secondaryHref)}>{copy.hero.secondaryCta}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function MissionStatement({ copy }: { copy: PlatformPageCopy }) {
  return (
    <PlatformSectionShell eyebrow={copy.mission.eyebrow} title={copy.mission.statement} description={copy.mission.description} centered>
      <div className="mx-auto grid max-w-5xl gap-5 sm:grid-cols-3">
        {copy.metrics.map((metric) => (
          <div key={metric.label} className="rounded-4xl border border-zinc-200 bg-white px-6 py-7 shadow-[0_22px_70px_-54px_rgba(15,23,42,0.28)]">
            <div className="text-4xl font-semibold tracking-tighter text-zinc-950">{metric.value}</div>
            <div className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">{metric.label}</div>
          </div>
        ))}
      </div>
    </PlatformSectionShell>
  );
}

function ProductShowcase({ config, copy }: { config: PlatformConfig; copy: PlatformPageCopy }) {
  return (
    <PlatformSectionShell
      eyebrow={copy.labels.platformEcosystem}
      title={copy.sections.ecosystem.title}
      description={copy.sections.ecosystem.description}
      tone="muted"
    >
      <div className="grid gap-8 xl:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)] xl:items-start">
        <div className="space-y-5">
          {copy.sections.ecosystem.items.map((item) => (
            <div key={item.title} className="rounded-[1.75rem] border border-zinc-200 bg-white px-6 py-5">
              <h3 className="text-sm font-semibold text-zinc-950">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-zinc-600">{item.description}</p>
            </div>
          ))}
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {copy.products.map((product, index) => {
            const Icon = iconMap[config.products[index]?.icon ?? "blocks"];
            return (
              <div
                key={product.name}
                className="group relative min-h-57 overflow-hidden rounded-4xl border border-zinc-200/80 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.26)] transition duration-300 hover:-translate-y-1 hover:border-zinc-300 hover:shadow-[0_24px_80px_-40px_rgba(15,23,42,0.22)]"
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-zinc-950" />
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-50 text-zinc-700">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-8 text-xl font-semibold tracking-[-0.03em] text-zinc-950">{product.name}</h3>
                <p className="mt-4 text-sm leading-7 text-zinc-600">{product.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </PlatformSectionShell>
  );
}

function PlatformCardGridSection({
  section,
  tone = "default",
  icons,
}: {
  section: PlatformSectionCopy;
  tone?: "default" | "muted" | "dark";
  icons: LucideIcon[];
}) {
  const dark = tone === "dark";

  return (
    <PlatformSectionShell
      eyebrow={section.eyebrow}
      title={section.title}
      description={section.description}
      tone={tone}
    >
      <div className="grid gap-5 md:grid-cols-3">
        {section.items.map((item, index) => {
          const Icon = icons[index] ?? Blocks;

          return (
            <div
              key={item.title}
              className={cn(
                "relative min-h-72 overflow-hidden rounded-4xl border p-6 transition duration-300",
                dark
                  ? "border-white/10 bg-white/4 hover:-translate-y-1 hover:border-white/20 hover:bg-white/6"
                  : "border-zinc-200/80 bg-white shadow-[0_20px_60px_-40px_rgba(15,23,42,0.26)] hover:-translate-y-1 hover:border-zinc-300 hover:shadow-[0_24px_80px_-40px_rgba(15,23,42,0.22)]",
              )}
            >
              <span
                className={cn(
                  "inline-flex h-12 w-12 items-center justify-center rounded-2xl border",
                  dark ? "border-white/10 bg-white/4 text-white/88" : "border-zinc-200 bg-zinc-50 text-zinc-700",
                )}
              >
                <Icon className="h-5 w-5" />
              </span>
              <h3 className={cn("mt-8 text-xl font-semibold tracking-[-0.03em]", dark ? "text-white" : "text-zinc-950")}>
                {item.title}
              </h3>
              <p className={cn("mt-4 text-sm leading-7", dark ? "text-white/64" : "text-zinc-600")}>{item.description}</p>
            </div>
          );
        })}
      </div>
    </PlatformSectionShell>
  );
}

function OperatingModelSection({ copy }: { copy: PlatformPageCopy }) {
  return (
    <PlatformCardGridSection
      section={copy.sections.operatingModel}
      icons={[Workflow, Users, Layers3]}
    />
  );
}

function ArchitectureSection({ copy }: { copy: PlatformPageCopy }) {
  return (
    <PlatformSectionShell
      eyebrow={copy.sections.architecture.eyebrow}
      title={copy.sections.architecture.title}
      description={copy.sections.architecture.description}
    >
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] xl:items-center">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-zinc-200 bg-white p-6 shadow-[0_30px_100px_-60px_rgba(15,23,42,0.28)] sm:p-8">
          <div aria-hidden={true} className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(148,163,184,0.22),transparent_48%)]" />
          <div className="relative space-y-4">
            {copy.sections.architecture.flow.map((step, index) => (
              <div key={step.title} className="grid gap-3 sm:grid-cols-[8rem_minmax(0,1fr)] sm:items-center">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-50 text-sm font-semibold text-zinc-950">
                    {index + 1}
                  </span>
                  <span className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">{step.title}</span>
                </div>
                <div className="rounded-[1.5rem] border border-zinc-200 bg-zinc-50/75 px-5 py-4 text-sm leading-7 text-zinc-600">
                  {step.description}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="grid gap-5">
          {copy.sections.architecture.items.map((item) => (
            <div key={item.title} className="rounded-[1.85rem] border border-zinc-200 bg-white p-6 shadow-[0_18px_60px_-48px_rgba(15,23,42,0.2)]">
              <h3 className="text-lg font-semibold tracking-[-0.03em] text-zinc-950">{item.title}</h3>
              <p className="mt-4 text-sm leading-7 text-zinc-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </PlatformSectionShell>
  );
}

function ControlPlaneSection({ copy }: { copy: PlatformPageCopy }) {
  return (
    <PlatformCardGridSection
      section={copy.sections.controlPlane}
      tone="muted"
      icons={[Server, Route, ShieldCheck]}
    />
  );
}

function WorkflowSection({ copy }: { copy: PlatformPageCopy }) {
  return (
    <PlatformSectionShell
      eyebrow={copy.sections.workflow.eyebrow}
      title={copy.sections.workflow.title}
      description={copy.sections.workflow.description}
      tone="dark"
    >
      <div className="grid gap-5 md:grid-cols-3">
        {copy.sections.workflow.items.map((item) => (
          <div key={item.title} className="rounded-4xl border border-white/10 bg-white/4 p-7 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/6">
            <h3 className="text-2xl font-semibold tracking-[-0.04em] text-white">{item.title}</h3>
            <p className="mt-5 text-sm leading-7 text-white/64">{item.description}</p>
          </div>
        ))}
      </div>
    </PlatformSectionShell>
  );
}

function DataGovernanceSection({ copy }: { copy: PlatformPageCopy }) {
  return (
    <PlatformCardGridSection
      section={copy.sections.dataGovernance}
      icons={[Database, Vault, Fingerprint]}
    />
  );
}

function IdentityAccessSection({ copy }: { copy: PlatformPageCopy }) {
  return (
    <PlatformCardGridSection
      section={copy.sections.identityAccess}
      tone="dark"
      icons={[Fingerprint, LockKeyhole, ShieldCheck]}
    />
  );
}

function SecuritySection({ copy }: { copy: PlatformPageCopy }) {
  return (
    <PlatformSectionShell
      eyebrow={copy.sections.security.eyebrow}
      title={copy.sections.security.title}
      description={copy.sections.security.description}
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:items-center">
        <div className="relative min-h-90 overflow-hidden rounded-[2.5rem] border border-zinc-200 bg-zinc-950 p-8 text-white shadow-[0_30px_100px_-60px_rgba(15,23,42,0.42)]">
          <DarkGrid />
          <div className="absolute inset-x-[-30%] bottom-[-5%] h-72 opacity-80">
            <WorldMap inverted />
          </div>
          <div className="relative">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/4 text-white">
              <ShieldCheck className="h-6 w-6" />
            </span>
            <p className="mt-16 max-w-sm text-3xl font-semibold leading-tight tracking-tighter">
              {copy.labels.sovereigntyStatement}
            </p>
          </div>
        </div>
        <div className="grid gap-5">
          {copy.sections.security.items.map((item) => (
            <div key={item.title} className="rounded-[1.85rem] border border-zinc-200 bg-white p-6 shadow-[0_18px_60px_-48px_rgba(15,23,42,0.2)]">
              <h3 className="text-lg font-semibold tracking-[-0.03em] text-zinc-950">{item.title}</h3>
              <p className="mt-4 text-sm leading-7 text-zinc-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </PlatformSectionShell>
  );
}

function ApiSection({ copy }: { copy: PlatformPageCopy }) {
  return (
    <PlatformSectionShell
      eyebrow={copy.sections.api.eyebrow}
      title={copy.sections.api.title}
      description={copy.sections.api.description}
      tone="muted"
    >
      <div className="grid gap-8 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] xl:items-start">
        <div className="rounded-[2.25rem] border border-zinc-200 bg-white p-7 shadow-[0_24px_80px_-52px_rgba(15,23,42,0.25)]">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">{copy.labels.integrationSurface}</div>
          <div className="mt-6 grid gap-3 font-mono text-sm text-zinc-700">
            {copy.sections.api.endpoints.map((endpoint) => (
              <div key={endpoint} className="rounded-2xl border border-zinc-200 bg-zinc-50/80 px-4 py-4">
                {endpoint}
              </div>
            ))}
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {copy.sections.api.items.map((item) => (
            <div key={item.title} className="rounded-[1.85rem] border border-zinc-200 bg-white p-6 shadow-[0_18px_60px_-48px_rgba(15,23,42,0.2)]">
              <h3 className="text-lg font-semibold tracking-[-0.03em] text-zinc-950">{item.title}</h3>
              <p className="mt-4 text-sm leading-7 text-zinc-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </PlatformSectionShell>
  );
}

function ObservabilitySection({ copy }: { copy: PlatformPageCopy }) {
  return (
    <PlatformCardGridSection
      section={copy.sections.observability}
      tone="muted"
      icons={[Activity, Network, RadioTower]}
    />
  );
}

function GlobalScaleSection({ copy }: { copy: PlatformPageCopy }) {
  return (
    <PlatformSectionShell
      eyebrow={copy.sections.global.eyebrow}
      title={copy.sections.global.title}
      description={copy.sections.global.description}
    >
      <div className="relative overflow-hidden rounded-[2.6rem] border border-zinc-200 bg-white p-6 shadow-[0_30px_100px_-60px_rgba(15,23,42,0.28)] sm:p-8">
        <div className="h-72 sm:h-90">
          <WorldMap />
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          {copy.sections.global.items.map((item) => (
            <div key={item.title} className="rounded-[1.75rem] border border-zinc-200 bg-zinc-50/80 p-6">
              <h3 className="text-lg font-semibold tracking-[-0.03em] text-zinc-950">{item.title}</h3>
              <p className="mt-4 text-sm leading-7 text-zinc-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </PlatformSectionShell>
  );
}

function RolloutSection({ copy }: { copy: PlatformPageCopy }) {
  return (
    <PlatformCardGridSection
      section={copy.sections.rollout}
      icons={[Blocks, Workflow, Globe2]}
    />
  );
}

function FinalCta({ locale, config, copy }: PlatformPageProps) {
  return (
    <section className="relative overflow-hidden border-t border-zinc-200 py-24 sm:py-28">
      <div aria-hidden={true} className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(9,9,11,1)_0%,rgba(24,24,27,0.98)_100%)]" />
      <DarkGrid />
      <div className="relative mx-auto max-w-360 px-6 lg:px-12">
        <div className="rounded-[2.6rem] border border-white/10 bg-white/3 px-8 py-10 shadow-[0_40px_120px_-80px_rgba(0,0,0,0.6)] sm:px-10 lg:px-14 lg:py-14">
          <SectionEyebrow inverted>{copy.cta.eyebrow}</SectionEyebrow>
          <h2 className="mt-6 max-w-4xl text-4xl font-semibold tracking-tighter text-white sm:text-5xl lg:text-6xl">
            {copy.cta.title}
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/68">{copy.cta.description}</p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button asChild size="lg" variant="secondary" className="h-14 rounded-full bg-white px-8 text-sm font-medium text-zinc-950 hover:bg-zinc-100">
              <Link href={localizeHref(locale, config.primaryHref)}>
                {copy.cta.primaryCta}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-14 rounded-full border-white/15 bg-white/4 px-8 text-sm font-medium text-white hover:bg-white/8">
              <Link href={localizeHref(locale, config.secondaryHref)}>{copy.cta.secondaryCta}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export function PlatformPage({ locale, config, copy }: PlatformPageProps) {
  return (
    <div className="flex min-h-screen flex-col bg-white text-zinc-950">
      <Header locale={locale as Locale} />
      <main className="flex-1 overflow-x-hidden">
        <PlatformHero locale={locale} config={config} copy={copy} />
        <MissionStatement copy={copy} />
        <ProductShowcase config={config} copy={copy} />
        <OperatingModelSection copy={copy} />
        <ArchitectureSection copy={copy} />
        <ControlPlaneSection copy={copy} />
        <WorkflowSection copy={copy} />
        <DataGovernanceSection copy={copy} />
        <IdentityAccessSection copy={copy} />
        <SecuritySection copy={copy} />
        <ApiSection copy={copy} />
        <ObservabilitySection copy={copy} />
        <RolloutSection copy={copy} />
        <GlobalScaleSection copy={copy} />
        <FinalCta locale={locale} config={config} copy={copy} />
      </main>
      <Footer locale={locale as Locale} />
    </div>
  );
}

export function PlatformOverviewPage({ locale, copy }: PlatformOverviewPageProps) {
  return (
    <div className="flex min-h-screen flex-col bg-white text-zinc-950">
      <Header locale={locale as Locale} />
      <main className="flex-1 overflow-x-hidden">
        <section className="relative overflow-hidden border-b border-zinc-200/80 bg-[linear-gradient(180deg,#ffffff_0%,#fafafa_100%)]">
          <div aria-hidden={true} className="pointer-events-none absolute inset-0">
            <div className="absolute inset-x-[-12%] top-[14%] h-[62%] opacity-95 lg:inset-x-[-4%]">
              <WorldMap />
            </div>
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.8),rgba(255,255,255,0.42)_34%,rgba(255,255,255,0.88)_100%)]" />
          </div>
          <div className="relative mx-auto flex min-h-[76vh] max-w-360 items-center px-6 py-20 sm:py-24 lg:px-12 lg:py-28">
            <div className="max-w-5xl">
              <SectionEyebrow>{copy.hero.eyebrow}</SectionEyebrow>
              <h1 className="mt-7 max-w-6xl text-[clamp(3.35rem,6.8vw,7rem)] font-semibold leading-[0.92] tracking-[-0.06em] text-zinc-950">
                {copy.hero.title}
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-600 sm:text-xl">
                {copy.hero.description}
              </p>
            </div>
          </div>
        </section>
        <PlatformSectionShell
          eyebrow={copy.domains.eyebrow}
          title={copy.domains.title}
          description={copy.domains.description}
        >
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {platformConfigList.map((page) => {
              const Icon = iconMap[page.products[0]?.icon ?? "blocks"];
              const pageCopy = copy.pages[page.slug];
              return (
                <Link
                  key={page.slug}
                  href={localizeHref(locale, `/platform/${page.slug}`)}
                  className="group relative min-h-72 overflow-hidden rounded-4xl border border-zinc-200/80 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.26)] transition duration-300 hover:-translate-y-1 hover:border-zinc-300 hover:shadow-[0_24px_80px_-40px_rgba(15,23,42,0.22)]"
                >
                  <div className="absolute inset-x-0 top-0 h-1 bg-zinc-950" />
                  <div className="flex items-start justify-between gap-4">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-50 text-zinc-700">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 text-zinc-500 transition group-hover:border-zinc-300 group-hover:text-zinc-900">
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                  <h2 className="mt-8 text-2xl font-semibold tracking-[-0.04em] text-zinc-950">{pageCopy.title}</h2>
                  <p className="mt-4 text-sm leading-7 text-zinc-600">{pageCopy.description}</p>
                </Link>
              );
            })}
          </div>
        </PlatformSectionShell>
      </main>
      <Footer locale={locale as Locale} />
    </div>
  );
}
