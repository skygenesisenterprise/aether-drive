import * as React from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  AudioLines,
  BadgeCheck,
  Blocks,
  BookOpen,
  Building2,
  Cloud,
  Code2,
  Cpu,
  Globe2,
  GraduationCap,
  Headphones,
  Layers3,
  LockKeyhole,
  Mic2,
  Network,
  PlayCircle,
  Radio,
  ShieldCheck,
  Sparkles,
  Terminal,
  Users,
  Video,
  Waypoints,
  Workflow,
} from "lucide-react";
import {
  CompanyCardGrid,
  CompanyFinalCta,
  CompanyHero,
  CompanyPageShell,
  CompanyPillList,
  CompanySection,
} from "@/components/public/company/company-page";
import { cn } from "@/lib/utils";

interface ShowcasePageProps {
  locale: string;
  page: AcademyPageContent | PodcastPageContent;
}

interface ShowcaseLink {
  label: string;
  href: string;
  variant?: "default" | "outline";
}

interface ShowcaseCard {
  title: string;
  description: string;
  meta?: string;
  href?: string;
  cta?: string;
  icon?: string;
}

interface ShowcaseStep {
  title: string;
  description: string;
  label: string;
}

interface ShowcaseMetric {
  value: string;
  label: string;
  description: string;
}

interface ShowcaseResource {
  title: string;
  description: string;
  format: string;
}

interface ShowcaseSpotlight {
  eyebrow: string;
  title: string;
  description: string;
  primaryLabel: string;
  secondaryLabel: string;
  tertiaryLabel?: string;
}

interface ShowcaseConnection {
  title: string;
  description: string;
  href: string;
  cta: string;
}

export interface AcademyPageContent {
  metadata: {
    title: string;
    description: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    actions: ShowcaseLink[];
    stats: ShowcaseMetric[];
  };
  benefits: {
    eyebrow: string;
    title: string;
    description: string;
    items: string[];
  };
  productPaths: {
    eyebrow: string;
    title: string;
    description: string;
    cards: ShowcaseCard[];
  };
  developerPaths: {
    eyebrow: string;
    title: string;
    description: string;
    cards: ShowcaseCard[];
  };
  infrastructurePaths: {
    eyebrow: string;
    title: string;
    description: string;
    cards: ShowcaseCard[];
  };
  securityPaths: {
    eyebrow: string;
    title: string;
    description: string;
    cards: ShowcaseCard[];
  };
  governancePaths: {
    eyebrow: string;
    title: string;
    description: string;
    cards: ShowcaseCard[];
  };
  learningPaths: {
    eyebrow: string;
    title: string;
    description: string;
    steps: ShowcaseStep[];
  };
  resources: {
    eyebrow: string;
    title: string;
    description: string;
    items: ShowcaseResource[];
  };
  labs: ShowcaseSpotlight;
  certifications: {
    eyebrow: string;
    title: string;
    description: string;
    cards: ShowcaseCard[];
  };
  featuredCourses: {
    eyebrow: string;
    title: string;
    description: string;
    cards: ShowcaseCard[];
  };
  connections: {
    eyebrow: string;
    title: string;
    description: string;
    items: ShowcaseConnection[];
  };
  openSource: {
    eyebrow: string;
    title: string;
    description: string;
    items: string[];
  };
  cta: {
    eyebrow: string;
    title: string;
    description: string;
    actions: ShowcaseLink[];
  };
}

interface PodcastEpisodeCard extends ShowcaseCard {
  duration: string;
  guest: string;
  theme: string;
}

interface PodcastPlatform {
  title: string;
  description: string;
  href: string;
  cta: string;
}

export interface PodcastPageContent {
  metadata: {
    title: string;
    description: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    actions: ShowcaseLink[];
    stats: ShowcaseMetric[];
  };
  featuredEpisode: {
    eyebrow: string;
    title: string;
    description: string;
    episode: PodcastEpisodeCard;
  };
  series: {
    eyebrow: string;
    title: string;
    description: string;
    cards: ShowcaseCard[];
  };
  latestEpisodes: {
    eyebrow: string;
    title: string;
    description: string;
    episodes: PodcastEpisodeCard[];
  };
  topics: {
    eyebrow: string;
    title: string;
    description: string;
    items: string[];
  };
  founderSeries: ShowcaseSpotlight;
  engineeringTalks: ShowcaseSpotlight;
  securityTalks: ShowcaseSpotlight;
  openSourceTalks: ShowcaseSpotlight;
  productStories: ShowcaseSpotlight;
  platforms: {
    eyebrow: string;
    title: string;
    description: string;
    items: PodcastPlatform[];
  };
  newsletter: {
    eyebrow: string;
    title: string;
    description: string;
    points: string[];
  };
  connections: {
    eyebrow: string;
    title: string;
    description: string;
    items: ShowcaseConnection[];
  };
  cta: {
    eyebrow: string;
    title: string;
    description: string;
    actions: ShowcaseLink[];
  };
}

const iconMap: Record<string, LucideIcon> = {
  AudioLines,
  BadgeCheck,
  Blocks,
  BookOpen,
  Building2,
  Cloud,
  Code2,
  Cpu,
  Globe2,
  GraduationCap,
  Headphones,
  Layers3,
  LockKeyhole,
  Mic2,
  Network,
  PlayCircle,
  Radio,
  ShieldCheck,
  Sparkles,
  Terminal,
  Users,
  Video,
  Waypoints,
  Workflow,
};

function localizeHref(locale: string, href: string) {
  if (href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("#")) {
    return href;
  }

  return `/${locale}${href.startsWith("/") ? href : `/${href}`}`;
}

function localizeActions(locale: string, actions: ShowcaseLink[]) {
  return actions.map((action) => ({
    ...action,
    href: localizeHref(locale, action.href),
  }));
}

function localizeCards(locale: string, cards: ShowcaseCard[]) {
  return cards.map((card) => ({
    ...card,
    href: card.href ? localizeHref(locale, card.href) : undefined,
    icon: card.icon,
  }));
}

function localizeConnections(locale: string, items: ShowcaseConnection[]) {
  return items.map((item) => ({
    ...item,
    href: localizeHref(locale, item.href),
  }));
}

function localizePlatforms(locale: string, items: PodcastPlatform[]) {
  return items.map((item) => ({
    ...item,
    href: localizeHref(locale, item.href),
  }));
}

function MetricsVisual({ stats, tone = "default" }: { stats: ShowcaseMetric[]; tone?: "default" | "dark" }) {
  const dark = tone === "dark";

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[2.4rem] border p-5 shadow-[0_32px_100px_-52px_rgba(15,23,42,0.28)]",
        dark ? "border-white/10 bg-white/5 text-white" : "border-zinc-200 bg-white text-zinc-950",
      )}
    >
      <div
        aria-hidden={true}
        className={cn(
          "absolute inset-x-0 top-0 h-28",
          dark
            ? "bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.12),transparent_58%),linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0))]"
            : "bg-[radial-gradient(circle_at_top_left,rgba(148,163,184,0.18),transparent_58%),linear-gradient(180deg,rgba(244,244,245,0.96),rgba(255,255,255,0))]",
        )}
      />
      <div className="relative grid gap-4 sm:grid-cols-2">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={cn(
              "rounded-[1.6rem] border p-5",
              dark ? "border-white/10 bg-white/5" : "border-zinc-200 bg-zinc-50/80",
            )}
          >
            <div className="text-4xl font-semibold tracking-tighter">{stat.value}</div>
            <div className={cn("mt-3 text-[11px] font-semibold uppercase tracking-[0.2em]", dark ? "text-white/56" : "text-zinc-500")}>
              {stat.label}
            </div>
            <p className={cn("mt-4 text-sm leading-7", dark ? "text-white/68" : "text-zinc-600")}>{stat.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function LearningPathSteps({ steps }: { steps: ShowcaseStep[] }) {
  return (
    <div className="grid gap-5 lg:grid-cols-4">
      {steps.map((step, index) => (
        <div key={step.label} className="rounded-4xl border border-zinc-200/80 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.24)]">
          <div className="flex items-center justify-between gap-4">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 bg-zinc-50 text-sm font-semibold text-zinc-950">
              {index + 1}
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">{step.label}</span>
          </div>
          <h3 className="mt-8 text-2xl font-semibold tracking-[-0.04em] text-zinc-950">{step.title}</h3>
          <p className="mt-4 text-sm leading-7 text-zinc-600">{step.description}</p>
        </div>
      ))}
    </div>
  );
}

function ResourceTiles({ items }: { items: ShowcaseResource[] }) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <div key={item.title} className="rounded-4xl border border-zinc-200/80 bg-white p-6 shadow-[0_18px_60px_-45px_rgba(15,23,42,0.22)]">
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">{item.format}</div>
          <h3 className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-zinc-950">{item.title}</h3>
          <p className="mt-4 text-sm leading-7 text-zinc-600">{item.description}</p>
        </div>
      ))}
    </div>
  );
}

function SpotlightPanel({
  spotlight,
  tone = "light",
  icon: Icon,
}: {
  spotlight: ShowcaseSpotlight;
  tone?: "light" | "dark";
  icon: LucideIcon;
}) {
  const dark = tone === "dark";

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[2.25rem] border p-7 shadow-[0_24px_80px_-52px_rgba(15,23,42,0.24)]",
        dark ? "border-white/10 bg-white/5 text-white" : "border-zinc-200 bg-white text-zinc-950",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className={cn("inline-flex h-13 w-13 items-center justify-center rounded-3xl border", dark ? "border-white/10 bg-white/5" : "border-zinc-200 bg-zinc-50")}>
          <Icon className="h-5 w-5" />
        </div>
        <span className={cn("text-[11px] font-semibold uppercase tracking-[0.2em]", dark ? "text-white/56" : "text-zinc-500")}>
          {spotlight.eyebrow}
        </span>
      </div>
      <h3 className="mt-8 text-3xl font-semibold tracking-[-0.04em]">{spotlight.title}</h3>
      <p className={cn("mt-5 max-w-3xl text-base leading-8", dark ? "text-white/68" : "text-zinc-600")}>{spotlight.description}</p>
      <div className="mt-10 flex flex-wrap gap-3">
        {[spotlight.primaryLabel, spotlight.secondaryLabel, spotlight.tertiaryLabel].filter(Boolean).map((item) => (
          <span
            key={item}
            className={cn(
              "inline-flex rounded-full border px-4 py-2 text-xs font-medium uppercase tracking-[0.18em]",
              dark ? "border-white/10 bg-white/5 text-white/72" : "border-zinc-200 bg-zinc-50 text-zinc-600",
            )}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function EpisodeCard({ episode, href, cta, featured = false }: { episode: PodcastEpisodeCard; href?: string; cta?: string; featured?: boolean }) {
  const content = (
    <article
      className={cn(
        "group relative h-full overflow-hidden rounded-4xl border p-6 transition duration-300",
        featured
          ? "border-zinc-200 bg-white shadow-[0_32px_100px_-52px_rgba(15,23,42,0.28)]"
          : "border-zinc-200/80 bg-white shadow-[0_18px_60px_-45px_rgba(15,23,42,0.22)] hover:-translate-y-1 hover:border-zinc-300",
      )}
    >
      <div
        aria-hidden={true}
        className="absolute inset-x-0 top-0 h-28 bg-[radial-gradient(circle_at_top_left,rgba(148,163,184,0.18),transparent_58%),linear-gradient(180deg,rgba(244,244,245,0.96),rgba(255,255,255,0))]"
      />
      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <span className="inline-flex h-13 w-13 items-center justify-center rounded-3xl border border-zinc-200 bg-zinc-50 text-zinc-950">
            <PlayCircle className="h-5 w-5" />
          </span>
          {href ? (
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 text-zinc-500 transition group-hover:border-zinc-300 group-hover:text-zinc-950">
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          ) : null}
        </div>
        <div className="mt-8 flex flex-wrap gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
          <span>{episode.duration}</span>
          <span>{episode.guest}</span>
          <span>{episode.theme}</span>
        </div>
        <h3 className="mt-5 text-3xl font-semibold tracking-[-0.04em] text-zinc-950">{episode.title}</h3>
        <p className="mt-5 text-sm leading-7 text-zinc-600">{episode.description}</p>
        {cta ? <span className="mt-8 inline-flex text-sm font-medium text-zinc-950">{cta}</span> : null}
      </div>
    </article>
  );

  if (!href) {
    return content;
  }

  return <Link href={href}>{content}</Link>;
}

function PlatformGrid({ items }: { items: PodcastPlatform[] }) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
      {items.map((item) => (
        <Link
          key={item.title}
          href={item.href}
          className="group rounded-4xl border border-white/10 bg-white/5 p-6 transition duration-300 hover:-translate-y-1 hover:border-white/20"
        >
          <div className="text-xl font-semibold tracking-[-0.03em] text-white">{item.title}</div>
          <p className="mt-4 text-sm leading-7 text-white/64">{item.description}</p>
          <span className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-white">
            {item.cta}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </Link>
      ))}
    </div>
  );
}

function ConnectionsGrid({ items }: { items: ShowcaseConnection[] }) {
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {items.map((item) => (
        <Link
          key={item.title}
          href={item.href}
          className="group rounded-4xl border border-zinc-200/80 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.24)] transition duration-300 hover:-translate-y-1 hover:border-zinc-300 hover:shadow-[0_24px_80px_-36px_rgba(15,23,42,0.2)]"
        >
          <h3 className="text-2xl font-semibold tracking-[-0.04em] text-zinc-950">{item.title}</h3>
          <p className="mt-4 text-sm leading-7 text-zinc-600">{item.description}</p>
          <span className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-zinc-950">
            {item.cta}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </Link>
      ))}
    </div>
  );
}

export function AcademyPage({ locale, page }: { locale: string; page: AcademyPageContent }) {
  const productCards = localizeCards(locale, page.productPaths.cards).map((card) => ({
    ...card,
    icon: card.icon ? iconMap[card.icon] : undefined,
  }));
  const developerCards = localizeCards(locale, page.developerPaths.cards).map((card) => ({
    ...card,
    icon: card.icon ? iconMap[card.icon] : undefined,
  }));
  const infrastructureCards = localizeCards(locale, page.infrastructurePaths.cards).map((card) => ({
    ...card,
    icon: card.icon ? iconMap[card.icon] : undefined,
  }));
  const securityCards = localizeCards(locale, page.securityPaths.cards).map((card) => ({
    ...card,
    icon: card.icon ? iconMap[card.icon] : undefined,
  }));
  const governanceCards = localizeCards(locale, page.governancePaths.cards).map((card) => ({
    ...card,
    icon: card.icon ? iconMap[card.icon] : undefined,
  }));
  const certificationCards = localizeCards(locale, page.certifications.cards).map((card) => ({
    ...card,
    icon: card.icon ? iconMap[card.icon] : undefined,
  }));
  const featuredCourseCards = localizeCards(locale, page.featuredCourses.cards).map((card) => ({
    ...card,
    icon: card.icon ? iconMap[card.icon] : undefined,
  }));

  return (
    <CompanyPageShell locale={locale}>
      <CompanyHero
        eyebrow={page.hero.eyebrow}
        title={page.hero.title}
        description={page.hero.description}
        actions={localizeActions(locale, page.hero.actions)}
        visual={<MetricsVisual stats={page.hero.stats} />}
      />

      <CompanySection eyebrow={page.benefits.eyebrow} title={page.benefits.title} description={page.benefits.description}>
        <CompanyPillList items={page.benefits.items} />
      </CompanySection>

      <CompanySection eyebrow={page.productPaths.eyebrow} title={page.productPaths.title} description={page.productPaths.description} tone="muted">
        <CompanyCardGrid items={productCards} />
      </CompanySection>

      <CompanySection eyebrow={page.developerPaths.eyebrow} title={page.developerPaths.title} description={page.developerPaths.description}>
        <CompanyCardGrid items={developerCards} />
      </CompanySection>

      <CompanySection eyebrow={page.infrastructurePaths.eyebrow} title={page.infrastructurePaths.title} description={page.infrastructurePaths.description} tone="muted">
        <CompanyCardGrid items={infrastructureCards} />
      </CompanySection>

      <CompanySection eyebrow={page.securityPaths.eyebrow} title={page.securityPaths.title} description={page.securityPaths.description} tone="dark">
        <CompanyCardGrid items={securityCards} />
      </CompanySection>

      <CompanySection eyebrow={page.governancePaths.eyebrow} title={page.governancePaths.title} description={page.governancePaths.description}>
        <CompanyCardGrid items={governanceCards} />
      </CompanySection>

      <CompanySection eyebrow={page.learningPaths.eyebrow} title={page.learningPaths.title} description={page.learningPaths.description} tone="muted">
        <LearningPathSteps steps={page.learningPaths.steps} />
      </CompanySection>

      <CompanySection eyebrow={page.resources.eyebrow} title={page.resources.title} description={page.resources.description}>
        <ResourceTiles items={page.resources.items} />
      </CompanySection>

      <CompanySection eyebrow={page.labs.eyebrow} title={page.labs.title} description={page.labs.description} tone="dark">
        <SpotlightPanel spotlight={page.labs} tone="dark" icon={Terminal} />
      </CompanySection>

      <CompanySection eyebrow={page.certifications.eyebrow} title={page.certifications.title} description={page.certifications.description}>
        <CompanyCardGrid items={certificationCards} />
      </CompanySection>

      <CompanySection eyebrow={page.featuredCourses.eyebrow} title={page.featuredCourses.title} description={page.featuredCourses.description} tone="muted">
        <CompanyCardGrid items={featuredCourseCards} />
      </CompanySection>

      <CompanySection eyebrow={page.connections.eyebrow} title={page.connections.title} description={page.connections.description}>
        <ConnectionsGrid items={localizeConnections(locale, page.connections.items)} />
      </CompanySection>

      <CompanySection eyebrow={page.openSource.eyebrow} title={page.openSource.title} description={page.openSource.description} tone="dark">
        <CompanyPillList items={page.openSource.items} inverted />
      </CompanySection>

      <CompanyFinalCta
        eyebrow={page.cta.eyebrow}
        title={page.cta.title}
        description={page.cta.description}
        actions={localizeActions(locale, page.cta.actions)}
      />
    </CompanyPageShell>
  );
}

export function PodcastPage({ locale, page }: { locale: string; page: PodcastPageContent }) {
  const seriesCards = localizeCards(locale, page.series.cards).map((card) => ({
    ...card,
    icon: card.icon ? iconMap[card.icon] : undefined,
  }));

  return (
    <CompanyPageShell locale={locale}>
      <CompanyHero
        eyebrow={page.hero.eyebrow}
        title={page.hero.title}
        description={page.hero.description}
        actions={localizeActions(locale, page.hero.actions)}
        visual={<MetricsVisual stats={page.hero.stats} />}
      />

      <CompanySection eyebrow={page.featuredEpisode.eyebrow} title={page.featuredEpisode.title} description={page.featuredEpisode.description}>
        <EpisodeCard
          episode={page.featuredEpisode.episode}
          href={page.featuredEpisode.episode.href ? localizeHref(locale, page.featuredEpisode.episode.href) : undefined}
          cta={page.featuredEpisode.episode.cta}
          featured
        />
      </CompanySection>

      <CompanySection eyebrow={page.series.eyebrow} title={page.series.title} description={page.series.description} tone="muted">
        <CompanyCardGrid items={seriesCards} />
      </CompanySection>

      <CompanySection eyebrow={page.latestEpisodes.eyebrow} title={page.latestEpisodes.title} description={page.latestEpisodes.description}>
        <div className="grid gap-5 lg:grid-cols-3">
          {page.latestEpisodes.episodes.map((episode) => (
            <EpisodeCard
              key={episode.title}
              episode={episode}
              href={episode.href ? localizeHref(locale, episode.href) : undefined}
              cta={episode.cta}
            />
          ))}
        </div>
      </CompanySection>

      <CompanySection eyebrow={page.topics.eyebrow} title={page.topics.title} description={page.topics.description} tone="dark">
        <CompanyPillList items={page.topics.items} inverted />
      </CompanySection>

      <CompanySection eyebrow={page.founderSeries.eyebrow} title={page.founderSeries.title} description={page.founderSeries.description}>
        <SpotlightPanel spotlight={page.founderSeries} icon={Mic2} />
      </CompanySection>

      <CompanySection eyebrow={page.engineeringTalks.eyebrow} title={page.engineeringTalks.title} description={page.engineeringTalks.description} tone="muted">
        <SpotlightPanel spotlight={page.engineeringTalks} icon={Code2} />
      </CompanySection>

      <CompanySection eyebrow={page.securityTalks.eyebrow} title={page.securityTalks.title} description={page.securityTalks.description}>
        <SpotlightPanel spotlight={page.securityTalks} icon={ShieldCheck} />
      </CompanySection>

      <CompanySection eyebrow={page.openSourceTalks.eyebrow} title={page.openSourceTalks.title} description={page.openSourceTalks.description} tone="muted">
        <SpotlightPanel spotlight={page.openSourceTalks} icon={Blocks} />
      </CompanySection>

      <CompanySection eyebrow={page.productStories.eyebrow} title={page.productStories.title} description={page.productStories.description}>
        <SpotlightPanel spotlight={page.productStories} icon={Sparkles} />
      </CompanySection>

      <CompanySection eyebrow={page.platforms.eyebrow} title={page.platforms.title} description={page.platforms.description} tone="dark">
        <PlatformGrid items={localizePlatforms(locale, page.platforms.items)} />
      </CompanySection>

      <CompanySection eyebrow={page.newsletter.eyebrow} title={page.newsletter.title} description={page.newsletter.description}>
        <CompanyPillList items={page.newsletter.points} />
      </CompanySection>

      <CompanySection eyebrow={page.connections.eyebrow} title={page.connections.title} description={page.connections.description} tone="muted">
        <ConnectionsGrid items={localizeConnections(locale, page.connections.items)} />
      </CompanySection>

      <CompanyFinalCta
        eyebrow={page.cta.eyebrow}
        title={page.cta.title}
        description={page.cta.description}
        actions={localizeActions(locale, page.cta.actions)}
      />
    </CompanyPageShell>
  );
}

export function renderShowcasePage({ locale, page }: ShowcasePageProps) {
  if ("productPaths" in page) {
    return <AcademyPage locale={locale} page={page} />;
  }

  return <PodcastPage locale={locale} page={page} />;
}
