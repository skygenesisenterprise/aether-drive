import * as React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  Activity,
  ArrowRight,
  Code2,
  Database,
  Fingerprint,
  Globe2,
  Layers3,
  Route,
  Search,
  ShieldCheck,
  Users,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/locale";
import {
  adjacentSolutionThemes,
  industrySolutions,
  solutions,
  useCaseSolutions,
  type RelatedStackItem,
  type SolutionContent,
  type SolutionCta,
  type SolutionIconItem,
  type SolutionSlug,
} from "@/lib/solutions/solution-content";

interface LocaleProps {
  locale: string;
}

interface SolutionPageProps extends LocaleProps {
  solution: SolutionContent;
}

interface SolutionSectionProps {
  eyebrow: string;
  title: string;
  description?: string;
  tone?: "default" | "muted" | "dark";
  centered?: boolean;
  children: React.ReactNode;
}

interface TextCard {
  title: string;
  description: string;
}

interface TextCardWithIcon extends TextCard {
  icon?: LucideIcon;
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

function SolutionSection({
  eyebrow,
  title,
  description,
  tone = "default",
  centered = false,
  children,
}: SolutionSectionProps) {
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
      <path d="M240 284C376 231 517 230 640 271C731 301 821 307 930 274C1061 235 1188 255 1340 337" stroke={stroke} strokeWidth="1.25" />
      <path d="M264 348C403 403 516 415 646 390C772 365 885 328 1008 347C1113 363 1221 394 1317 432" stroke={stroke} strokeWidth="1.25" />
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

function SolutionCTA({
  cta,
  label,
  locale,
  inverted = false,
}: {
  cta: SolutionCta;
  label: string;
  locale: string;
  inverted?: boolean;
}) {
  const primary = cta.variant !== "secondary";

  return (
    <Button
      asChild
      size="lg"
      variant={primary ? "default" : "outline"}
      className={cn(
        "h-14 rounded-full px-8 text-sm font-medium",
        primary && !inverted && "bg-zinc-950 text-white hover:bg-zinc-800",
        !primary && !inverted && "border-zinc-300 bg-white/85 text-zinc-950",
        primary && inverted && "bg-white text-zinc-950 hover:bg-zinc-100",
        !primary && inverted && "border-white/15 bg-white/4 text-white hover:bg-white/8",
      )}
    >
      <Link href={localizeHref(locale, cta.href)}>
        {label}
        {primary ? <ArrowRight className="h-4 w-4" /> : null}
      </Link>
    </Button>
  );
}

function withIcons(items: TextCard[], iconItems: SolutionIconItem[]): TextCardWithIcon[] {
  return items.map((item, index) => ({ ...item, icon: iconItems[index]?.icon }));
}

function IconCard({
  item,
  dark = false,
  className,
}: {
  item: TextCardWithIcon;
  dark?: boolean;
  className?: string;
}) {
  const Icon = item.icon;

  return (
    <div
      className={cn(
        "relative h-full overflow-hidden rounded-4xl border p-6 transition duration-300",
        dark
          ? "border-white/10 bg-white/4 hover:-translate-y-1 hover:border-white/20 hover:bg-white/6"
          : "border-zinc-200/80 bg-white shadow-[0_20px_60px_-40px_rgba(15,23,42,0.26)] hover:-translate-y-1 hover:border-zinc-300 hover:shadow-[0_24px_80px_-40px_rgba(15,23,42,0.22)]",
        className,
      )}
    >
      {Icon ? (
        <span
          className={cn(
            "inline-flex h-12 w-12 items-center justify-center rounded-2xl border",
            dark ? "border-white/10 bg-white/4 text-white/88" : "border-zinc-200 bg-zinc-50 text-zinc-700",
          )}
        >
          <Icon className="h-5 w-5" />
        </span>
      ) : null}
      <h3 className={cn("mt-8 text-xl font-semibold tracking-[-0.03em]", dark ? "text-white" : "text-zinc-950")}>
        {item.title}
      </h3>
      <p className={cn("mt-4 text-sm leading-7", dark ? "text-white/64" : "text-zinc-600")}>{item.description}</p>
    </div>
  );
}

function HubCard({ locale, slug }: LocaleProps & { slug: SolutionSlug }) {
  const solution = solutions[slug];
  const tPage = useTranslations("Public.home.solutionPage");
  const tSolutions = useTranslations("Public.home.page.solutions.services");

  return (
    <Link
      href={localizeHref(locale, `/solutions/${solution.slug}`)}
      className="group relative min-h-72 overflow-hidden rounded-4xl border border-zinc-200/80 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.26)] transition duration-300 hover:-translate-y-1 hover:border-zinc-300 hover:shadow-[0_24px_80px_-40px_rgba(15,23,42,0.22)]"
    >
      <div aria-hidden={true} className="absolute inset-x-0 top-0 h-1 bg-zinc-950" />
      <div className="flex items-start justify-between gap-4">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-50 text-zinc-700">
          <Layers3 className="h-5 w-5" />
        </span>
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 text-zinc-500 transition group-hover:border-zinc-300 group-hover:text-zinc-900">
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden={true} />
        </span>
      </div>
      <div className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
        {tPage(`categories.${solution.category}`)}
      </div>
      <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-zinc-950">
        {tSolutions(`${slug}.shortTitle`)}
      </h3>
      <p className="mt-4 text-sm leading-7 text-zinc-600">{tSolutions(`${slug}.statement`)}</p>
    </Link>
  );
}

function SolutionsHubHero({ locale }: LocaleProps) {
  const t = useTranslations("Public.home.solutionPage");

  return (
    <section className="relative overflow-hidden border-b border-zinc-200/80 bg-[linear-gradient(180deg,#ffffff_0%,#fafafa_100%)]">
      <div aria-hidden={true} className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-44 bg-[radial-gradient(circle_at_top,rgba(148,163,184,0.18),transparent_65%)]" />
        <div className="absolute inset-x-[-14%] top-[13%] h-[58%] opacity-95 sm:top-[17%] lg:inset-x-[-4%] lg:top-[17%] lg:h-[64%]">
          <WorldMap />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.78),rgba(255,255,255,0.38)_32%,rgba(255,255,255,0.86)_100%)]" />
      </div>

      <div className="relative mx-auto flex min-h-[84vh] max-w-360 items-center px-6 py-20 sm:py-24 lg:px-12 lg:py-28">
        <div className="max-w-5xl">
          <SectionEyebrow>{t("brand")}</SectionEyebrow>
          <h1 className="mt-7 max-w-6xl text-[clamp(3.35rem,6.8vw,7rem)] font-semibold leading-[0.92] tracking-[-0.06em] text-zinc-950">
            {t("hub.hero.title")}
          </h1>
          <p className="mt-7 max-w-3xl text-2xl font-medium leading-10 tracking-[-0.04em] text-zinc-800">
            {t("hub.hero.statement")}
          </p>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-600 sm:text-xl">
            {t("hub.hero.description")}
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <SolutionCTA cta={{ href: "/company/contact", variant: "primary" }} label={t("hub.hero.primaryCta")} locale={locale} />
            <SolutionCTA cta={{ href: "/platform", variant: "secondary" }} label={t("hub.hero.secondaryCta")} locale={locale} />
          </div>
        </div>
      </div>
    </section>
  );
}

function SolutionsHubModel() {
  const t = useTranslations("Public.home.solutionPage");
  const steps = t.raw("hub.model.steps") as TextCard[];

  return (
    <SolutionSection
      eyebrow={t("hub.model.eyebrow")}
      title={t("hub.model.title")}
      description={t("hub.model.description")}
      tone="muted"
    >
      <div className="mx-auto max-w-5xl rounded-[2.5rem] border border-zinc-200 bg-white p-6 shadow-[0_30px_100px_-60px_rgba(15,23,42,0.28)] sm:p-8">
        <div className="grid gap-5">
          {steps.map((step, index) => (
            <React.Fragment key={step.title}>
              <div className="rounded-[1.75rem] border border-zinc-200 bg-zinc-50/75 p-6">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  {t("hub.model.stepLabel", { index: index + 1 })}
                </div>
                <div className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-zinc-950">{step.title}</div>
                <p className="mt-3 text-sm leading-7 text-zinc-600">{step.description}</p>
              </div>
              {index < steps.length - 1 ? (
                <div className="flex justify-center" aria-hidden={true}>
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-400">
                    <ArrowRight className="h-4 w-4 rotate-90" />
                  </div>
                </div>
              ) : null}
            </React.Fragment>
          ))}
        </div>
      </div>
    </SolutionSection>
  );
}

export function SolutionsHubPage({ locale }: LocaleProps) {
  const t = useTranslations("Public.home.solutionPage");

  return (
    <div className="flex min-h-screen flex-col bg-white text-zinc-950">
      <Header locale={locale as Locale} />
      <main className="flex-1 overflow-x-hidden">
        <SolutionsHubHero locale={locale} />
        <SolutionSection
          eyebrow={t("hub.useCases.eyebrow")}
          title={t("hub.useCases.title")}
          description={t("hub.useCases.description")}
        >
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {useCaseSolutions.map((slug) => (
              <HubCard key={slug} locale={locale} slug={slug} />
            ))}
          </div>
        </SolutionSection>
        <SolutionSection
          eyebrow={t("hub.industries.eyebrow")}
          title={t("hub.industries.title")}
          description={t("hub.industries.description")}
          tone="muted"
        >
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {industrySolutions.map((slug) => (
              <HubCard key={slug} locale={locale} slug={slug} />
            ))}
          </div>
        </SolutionSection>
        <SolutionsHubModel />
        <SolutionSection
          eyebrow={t("hub.adjacent.eyebrow")}
          title={t("hub.adjacent.title")}
          description={t("hub.adjacent.description")}
        >
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {adjacentSolutionThemes.map((item) => (
              <IconCard
                key={item.key}
                item={{
                  title: t(`hub.adjacent.items.${item.key}.title`),
                  description: t(`hub.adjacent.items.${item.key}.description`),
                  icon: item.icon,
                }}
              />
            ))}
          </div>
        </SolutionSection>
        <FinalCta
          locale={locale}
          ctas={[
            { href: "/company/contact", variant: "primary" },
            { href: "/platform", variant: "secondary" },
          ]}
          labels={[t("hub.cta.primaryCta"), t("hub.cta.secondaryCta")]}
        />
      </main>
      <Footer locale={locale as Locale} />
    </div>
  );
}

function SolutionHero({ locale, solution }: SolutionPageProps) {
  const tPage = useTranslations("Public.home.solutionPage");
  const tSolutions = useTranslations("Public.home.page.solutions.services");
  const ctaLabels = tSolutions.raw(`${solution.slug}.ctas`) as [string, string];

  return (
    <section className="relative overflow-hidden border-b border-zinc-200/80 bg-[linear-gradient(180deg,#ffffff_0%,#fafafa_100%)]">
      <div aria-hidden={true} className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-44 bg-[radial-gradient(circle_at_top,rgba(148,163,184,0.18),transparent_65%)]" />
        <div className="absolute inset-x-[-14%] top-[13%] h-[58%] opacity-95 sm:top-[17%] lg:inset-x-[-4%] lg:top-[17%] lg:h-[64%]">
          <WorldMap />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.78),rgba(255,255,255,0.38)_32%,rgba(255,255,255,0.86)_100%)]" />
      </div>

      <div className="relative mx-auto grid min-h-[88vh] max-w-360 items-center gap-10 px-6 py-20 sm:py-24 lg:grid-cols-[minmax(0,1fr)_420px] lg:px-12 lg:py-28">
        <div className="max-w-5xl">
          <SectionEyebrow>{tSolutions(`${solution.slug}.eyebrow`)}</SectionEyebrow>
          <h1 className="mt-7 max-w-6xl text-[clamp(3.35rem,6.8vw,7rem)] font-semibold leading-[0.92] tracking-[-0.06em] text-zinc-950">
            {tSolutions(`${solution.slug}.title`)}
          </h1>
          <p className="mt-7 max-w-3xl text-2xl font-medium leading-10 tracking-[-0.04em] text-zinc-800">
            {tSolutions(`${solution.slug}.statement`)}
          </p>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-600 sm:text-xl">
            {tSolutions(`${solution.slug}.description`)}
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            {solution.ctas.map((cta, index) => (
              <SolutionCTA key={cta.href} cta={cta} label={ctaLabels[index]} locale={locale} />
            ))}
          </div>
        </div>
        <div className="relative hidden overflow-hidden rounded-[2.5rem] border border-zinc-200 bg-white/88 p-6 shadow-[0_30px_100px_-60px_rgba(15,23,42,0.34)] backdrop-blur lg:block">
          <div aria-hidden={true} className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(148,163,184,0.24),transparent_52%)]" />
          <div className="relative">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
              {tPage("hero.solutionFrame")}
            </div>
            <div className="mt-6 grid gap-3">
              {solution.heroNodeKeys.map((node, index) => (
                <div key={node} className="flex items-center gap-3 rounded-[1.35rem] border border-zinc-200 bg-zinc-50/80 px-4 py-4">
                  <span className="flex h-9 w-9 items-center justify-center rounded-2xl border border-zinc-200 bg-white text-sm font-semibold text-zinc-950">
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium text-zinc-800">{tPage(`nodeLabels.${node}`)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function OperationalChallenges({ solution }: { solution: SolutionContent }) {
  const tPage = useTranslations("Public.home.solutionPage");
  const tSolutions = useTranslations("Public.home.page.solutions.services");
  const challenges = tSolutions.raw(`${solution.slug}.challenges`) as TextCard[];

  return (
    <SolutionSection
      eyebrow={tPage("challenge.eyebrow")}
      title={tPage("challenge.title")}
      description={tPage("challenge.description")}
    >
      <div className="grid gap-5 md:grid-cols-3">
        {withIcons(challenges, solution.challengeIcons).map((item) => (
          <IconCard key={item.title} item={item} className="min-h-72" />
        ))}
      </div>
    </SolutionSection>
  );
}

function EcosystemSection({ solution }: { solution: SolutionContent }) {
  const tSolutions = useTranslations("Public.home.page.solutions.services");
  const layers = tSolutions.raw(`${solution.slug}.ecosystem.layers`) as TextCard[];

  return (
    <SolutionSection
      eyebrow={tSolutions(`${solution.slug}.ecosystem.eyebrow`)}
      title={tSolutions(`${solution.slug}.ecosystem.title`)}
      description={tSolutions(`${solution.slug}.ecosystem.description`)}
      tone="muted"
    >
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] xl:items-center">
        <FlowPanel items={layers} />
        <div className="grid gap-5">
          {layers.map((item) => (
            <div key={item.title} className="rounded-[1.85rem] border border-zinc-200 bg-white p-6 shadow-[0_18px_60px_-48px_rgba(15,23,42,0.2)]">
              <h3 className="text-lg font-semibold tracking-[-0.03em] text-zinc-950">{item.title}</h3>
              <p className="mt-4 text-sm leading-7 text-zinc-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </SolutionSection>
  );
}

function TextCardGridSection({
  solution,
  sectionKey,
  tone = "default",
  icons,
}: {
  solution: SolutionContent;
  sectionKey: string;
  tone?: "default" | "muted" | "dark";
  icons: SolutionIconItem[];
}) {
  const tSolutions = useTranslations("Public.home.page.solutions.services");
  const items = tSolutions.raw(`${solution.slug}.${sectionKey}.items`) as TextCard[];

  return (
    <SolutionSection
      eyebrow={tSolutions(`${solution.slug}.${sectionKey}.eyebrow`)}
      title={tSolutions(`${solution.slug}.${sectionKey}.title`)}
      description={tSolutions(`${solution.slug}.${sectionKey}.description`)}
      tone={tone}
    >
      <div className="grid gap-5 md:grid-cols-3">
        {withIcons(items, icons).map((item) => (
          <IconCard key={item.title} item={item} dark={tone === "dark"} className="min-h-72" />
        ))}
      </div>
    </SolutionSection>
  );
}

function OperatingModelSection({ solution }: { solution: SolutionContent }) {
  return (
    <TextCardGridSection
      solution={solution}
      sectionKey="operatingModel"
      icons={[{ icon: Workflow }, { icon: Users }, { icon: Layers3 }]}
    />
  );
}

function OrganizationMapSection({ solution }: { solution: SolutionContent }) {
  return (
    <TextCardGridSection
      solution={solution}
      sectionKey="organizationMap"
      tone="muted"
      icons={[{ icon: Users }, { icon: ShieldCheck }, { icon: Activity }]}
    />
  );
}

function DataGovernanceSection({ solution }: { solution: SolutionContent }) {
  return (
    <TextCardGridSection
      solution={solution}
      sectionKey="dataGovernance"
      icons={[{ icon: Database }, { icon: Search }, { icon: ShieldCheck }]}
    />
  );
}

function IdentityAccessSection({ solution }: { solution: SolutionContent }) {
  return (
    <TextCardGridSection
      solution={solution}
      sectionKey="identityAccess"
      tone="dark"
      icons={[{ icon: Fingerprint }, { icon: ShieldCheck }, { icon: Users }]}
    />
  );
}

function IntegrationApiSection({ solution }: { solution: SolutionContent }) {
  return (
    <TextCardGridSection
      solution={solution}
      sectionKey="integrationApi"
      icons={[{ icon: Code2 }, { icon: Workflow }, { icon: Layers3 }]}
    />
  );
}

function FlowPanel({ items }: { items: TextCard[] }) {
  return (
    <div className="relative overflow-hidden rounded-[2.5rem] border border-zinc-200 bg-white p-6 shadow-[0_30px_100px_-60px_rgba(15,23,42,0.28)] sm:p-8">
      <div aria-hidden={true} className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(148,163,184,0.22),transparent_48%)]" />
      <div className="relative space-y-4">
        {items.map((step, index) => (
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
  );
}

function WorkflowSection({ solution }: { solution: SolutionContent }) {
  const tPage = useTranslations("Public.home.solutionPage");
  const tSolutions = useTranslations("Public.home.page.solutions.services");
  const workflows = tSolutions.raw(`${solution.slug}.workflows`) as TextCard[];

  return (
    <SolutionSection
      eyebrow={tPage("workflows.eyebrow")}
      title={tPage("workflows.title")}
      description={tPage("workflows.description")}
      tone="dark"
    >
      <div className="grid gap-5 md:grid-cols-3">
        {withIcons(workflows, solution.workflowIcons).map((item) => (
          <IconCard key={item.title} item={item} dark className="min-h-76" />
        ))}
      </div>
    </SolutionSection>
  );
}

function StackLink({
  item,
  locale,
}: LocaleProps & {
  item: RelatedStackItem;
}) {
  const Icon = item.icon;
  const tPage = useTranslations("Public.home.solutionPage");

  return (
    <Link
      href={localizeHref(locale, item.href)}
      className="group flex items-center justify-between rounded-[1.35rem] border border-zinc-200 bg-zinc-50/80 px-4 py-4 text-sm font-medium text-zinc-900 transition hover:border-zinc-300 hover:bg-white"
    >
      <span className="flex items-center gap-3">
        {Icon ? <Icon className="h-4 w-4 text-zinc-500" /> : null}
        {tPage(`relatedItems.${item.key}`)}
      </span>
      <ArrowRight className="h-4 w-4 text-zinc-500 transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}

function InfrastructureLayer({ locale, solution }: SolutionPageProps) {
  const tPage = useTranslations("Public.home.solutionPage");
  const tSolutions = useTranslations("Public.home.page.solutions.services");

  return (
    <SolutionSection
      eyebrow={tPage("infrastructure.eyebrow")}
      title={tSolutions(`${solution.slug}.infrastructure.title`)}
      description={tSolutions(`${solution.slug}.infrastructure.description`)}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <StackColumn title={tPage("infrastructure.platformTitle")} items={solution.relatedPlatform} locale={locale} />
        <StackColumn title={tPage("infrastructure.productsTitle")} items={solution.relatedProducts} locale={locale} />
      </div>
    </SolutionSection>
  );
}

function ObservabilitySection({ solution }: { solution: SolutionContent }) {
  return (
    <TextCardGridSection
      solution={solution}
      sectionKey="observability"
      tone="muted"
      icons={[{ icon: Activity }, { icon: Route }, { icon: ShieldCheck }]}
    />
  );
}

function StackColumn({
  title,
  items,
  locale,
}: LocaleProps & {
  title: string;
  items: RelatedStackItem[];
}) {
  return (
    <div className="rounded-[2.25rem] border border-zinc-200 bg-white p-7 shadow-[0_24px_80px_-52px_rgba(15,23,42,0.25)]">
      <h3 className="text-2xl font-semibold tracking-[-0.04em] text-zinc-950">{title}</h3>
      <div className="mt-6 grid gap-3">
        {items.map((item) => (
          <StackLink key={item.key} item={item} locale={locale} />
        ))}
      </div>
    </div>
  );
}

function SovereigntySection({ solution }: { solution: SolutionContent }) {
  const tPage = useTranslations("Public.home.solutionPage");
  const tSolutions = useTranslations("Public.home.page.solutions.services");
  const controls = tPage.raw("sovereignty.controls") as TextCard[];

  return (
    <SolutionSection
      eyebrow={tPage("sovereignty.eyebrow")}
      title={tPage("sovereignty.title")}
      description={tPage("sovereignty.description")}
      tone="dark"
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:items-center">
        <div className="relative min-h-90 overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/4 p-8 text-white shadow-[0_30px_100px_-60px_rgba(0,0,0,0.65)]">
          <DarkGrid />
          <div className="absolute inset-x-[-30%] bottom-[-5%] h-72 opacity-80">
            <WorldMap inverted />
          </div>
          <div className="relative">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/4 text-white">
              <ShieldCheck className="h-6 w-6" />
            </span>
            <p className="mt-16 max-w-sm text-3xl font-semibold leading-tight tracking-tighter">
              {tSolutions(`${solution.slug}.sovereignty.statement`)}
            </p>
          </div>
        </div>
        <div className="grid gap-5">
          {withIcons(controls, [{ icon: ShieldCheck }, { icon: ShieldCheck }, { icon: ShieldCheck }]).map((item) => (
            <IconCard key={item.title} item={item} dark />
          ))}
        </div>
      </div>
    </SolutionSection>
  );
}

function GlobalScale({ solution }: { solution: SolutionContent }) {
  const tSolutions = useTranslations("Public.home.page.solutions.services");
  const nodes = tSolutions.raw(`${solution.slug}.global.nodes`) as TextCard[];

  return (
    <SolutionSection
      eyebrow={tSolutions(`${solution.slug}.global.eyebrow`)}
      title={tSolutions(`${solution.slug}.global.title`)}
      description={tSolutions(`${solution.slug}.global.description`)}
    >
      <div className="relative overflow-hidden rounded-[2.6rem] border border-zinc-200 bg-white p-6 shadow-[0_30px_100px_-60px_rgba(15,23,42,0.28)] sm:p-8">
        <div className="h-72 sm:h-90">
          <WorldMap />
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          {withIcons(nodes, [{ icon: Globe2 }, { icon: Route }, { icon: Activity }]).map((item) => (
            <IconCard key={item.title} item={item} className="shadow-none" />
          ))}
        </div>
      </div>
    </SolutionSection>
  );
}

function RolloutSection({ solution }: { solution: SolutionContent }) {
  return (
    <TextCardGridSection
      solution={solution}
      sectionKey="rollout"
      icons={[{ icon: Layers3 }, { icon: Workflow }, { icon: Globe2 }]}
    />
  );
}

function FinalCta({
  locale,
  ctas,
  labels,
}: LocaleProps & {
  ctas: [SolutionCta, SolutionCta];
  labels: [string, string];
}) {
  const t = useTranslations("Public.home.solutionPage");

  return (
    <section className="relative overflow-hidden border-t border-zinc-200 py-24 sm:py-28">
      <div aria-hidden={true} className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(9,9,11,1)_0%,rgba(24,24,27,0.98)_100%)]" />
      <DarkGrid />
      <div className="relative mx-auto max-w-360 px-6 lg:px-12">
        <div className="rounded-[2.6rem] border border-white/10 bg-white/3 px-8 py-10 shadow-[0_40px_120px_-80px_rgba(0,0,0,0.6)] sm:px-10 lg:px-14 lg:py-14">
          <SectionEyebrow inverted>{t("finalCta.eyebrow")}</SectionEyebrow>
          <h2 className="mt-6 max-w-4xl text-4xl font-semibold tracking-tighter text-white sm:text-5xl lg:text-6xl">
            {t("finalCta.title")}
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/68">{t("finalCta.description")}</p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            {ctas.map((cta, index) => (
              <SolutionCTA key={cta.href} cta={cta} label={labels[index]} locale={locale} inverted />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function SolutionPage({ locale, solution }: SolutionPageProps) {
  const tSolutions = useTranslations("Public.home.page.solutions.services");
  const ctaLabels = tSolutions.raw(`${solution.slug}.ctas`) as [string, string];

  return (
    <div className="flex min-h-screen flex-col bg-white text-zinc-950">
      <Header locale={locale as Locale} />
      <main className="flex-1 overflow-x-hidden">
        <SolutionHero locale={locale} solution={solution} />
        <OperationalChallenges solution={solution} />
        <OperatingModelSection solution={solution} />
        <EcosystemSection solution={solution} />
        <OrganizationMapSection solution={solution} />
        <WorkflowSection solution={solution} />
        <DataGovernanceSection solution={solution} />
        <IdentityAccessSection solution={solution} />
        <IntegrationApiSection solution={solution} />
        <InfrastructureLayer locale={locale} solution={solution} />
        <ObservabilitySection solution={solution} />
        <SovereigntySection solution={solution} />
        <RolloutSection solution={solution} />
        <GlobalScale solution={solution} />
        <FinalCta locale={locale} ctas={solution.ctas} labels={ctaLabels} />
      </main>
      <Footer locale={locale as Locale} />
    </div>
  );
}

export {
  SolutionHero,
  OperationalChallenges as SolutionChallenge,
  OperatingModelSection,
  EcosystemSection as SolutionEcosystemConnections,
  OrganizationMapSection,
  WorkflowSection as SolutionCapabilities,
  DataGovernanceSection,
  IdentityAccessSection,
  IntegrationApiSection,
  InfrastructureLayer as SolutionRelatedStack,
  ObservabilitySection,
  SovereigntySection as SolutionRecommendedNextStep,
  RolloutSection,
  GlobalScale as SolutionReferenceArchitecture,
  FinalCta as SolutionAdoptionPath,
};
