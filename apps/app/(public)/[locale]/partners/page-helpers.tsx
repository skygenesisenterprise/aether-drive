import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  BadgeCheck,
  Banknote,
  BookOpen,
  BookOpenCheck,
  Boxes,
  Braces,
  BriefcaseBusiness,
  Building2,
  CircleHelp,
  ClipboardCheck,
  ClipboardList,
  CloudCog,
  Code2,
  Compass,
  Contact,
  Database,
  Eye,
  Factory,
  FileCheck2,
  FileCode2,
  FileText,
  Fingerprint,
  Flag,
  GitBranch,
  GitMerge,
  Goal,
  GraduationCap,
  Handshake,
  Headphones,
  HeartPulse,
  KeyRound,
  Landmark,
  Layers3,
  Library,
  LifeBuoy,
  Mail,
  Map,
  Megaphone,
  MessagesSquare,
  Network,
  PackageCheck,
  Palette,
  Rocket,
  Route,
  ScrollText,
  SearchCheck,
  Server,
  ShieldCheck,
  ShieldQuestion,
  Sparkles,
  Store,
  TerminalSquare,
  UsersRound,
  Workflow,
  Wrench,
} from "lucide-react";
import {
  PartnersPage,
  type PartnerCard,
  type PartnerLinkCard,
  type PartnerPageContent,
  type PartnerSupplementalSection,
  type ProcessStep,
} from "@/components/public/partners/partners-page";

export interface PartnersPageParams {
  params: Promise<{ locale: string }>;
}

export type PartnerPageSlug =
  | "program"
  | "resources"
  | "become"
  | "technology"
  | "service"
  | "distribution";

interface PartnerIconConfig {
  hero: LucideIcon;
  audience: LucideIcon;
  build: LucideIcon[];
  collaboration: LucideIcon[];
  positioning: LucideIcon[];
  operating: LucideIcon[];
  resources: LucideIcon[];
  enablement: LucideIcon[];
  nextSteps: LucideIcon[];
}

interface PartnerRouteConfig {
  primaryHref: (locale: string) => string;
  secondaryHref?: (locale: string) => string;
  ctaHref: (locale: string) => string;
  nextStepHrefs: ((locale: string) => string)[];
  icons: PartnerIconConfig;
}

const partnerRouteConfig: Record<PartnerPageSlug, PartnerRouteConfig> = {
  program: {
    primaryHref: (locale) => `/${locale}/partners/become`,
    secondaryHref: (locale) => `/${locale}/partners/resources`,
    ctaHref: (locale) => `/${locale}/partners/become`,
    nextStepHrefs: [
      (locale) => `/${locale}/partners/technology`,
      (locale) => `/${locale}/partners/service`,
      (locale) => `/${locale}/partners/distribution`,
    ],
    icons: {
      hero: Compass,
      audience: Handshake,
      build: [Boxes, Layers3, GraduationCap, GitMerge],
      collaboration: [Eye, BookOpenCheck, BadgeCheck, Sparkles],
      positioning: [Handshake, Compass, Goal],
      operating: [ClipboardList, Contact, Flag],
      resources: [ShieldCheck, FileCheck2, BookOpenCheck],
      enablement: [GraduationCap, Sparkles, BadgeCheck],
      nextSteps: [Workflow, Wrench, Map],
    },
  },
  resources: {
    primaryHref: (locale) => `/${locale}/partners/program`,
    secondaryHref: (locale) => `/${locale}/partners/become`,
    ctaHref: (locale) => `/${locale}/partners/program`,
    nextStepHrefs: [
      (locale) => `/${locale}/partners/technology`,
      (locale) => `/${locale}/partners/service`,
      (locale) => `/${locale}/partners/distribution`,
    ],
    icons: {
      hero: Library,
      audience: BookOpen,
      build: [FileText, Palette, FileCode2, Megaphone, ShieldCheck, Code2],
      collaboration: [ScrollText, KeyRound, Activity],
      positioning: [Library, BookOpen, ShieldCheck],
      operating: [Activity, KeyRound, ScrollText],
      resources: [Boxes, BookOpen, ShieldCheck],
      enablement: [Code2, Megaphone, FileText],
      nextSteps: [Workflow, Wrench, Map],
    },
  },
  become: {
    primaryHref: () => "mailto:partners@skygenesisenterprise.com",
    secondaryHref: (locale) => `/${locale}/partners/program`,
    ctaHref: () => "mailto:partners@skygenesisenterprise.com",
    nextStepHrefs: [
      (locale) => `/${locale}/partners/program`,
      (locale) => `/${locale}/partners/resources`,
      () => "mailto:partners@skygenesisenterprise.com",
    ],
    icons: {
      hero: Mail,
      audience: Building2,
      build: [UsersRound, Handshake, GraduationCap, CircleHelp],
      collaboration: [ClipboardList, Goal, Contact, FileText, Flag],
      positioning: [Building2, Handshake, Goal],
      operating: [ClipboardList, Contact, Mail],
      resources: [MessagesSquare, CircleHelp, Rocket],
      enablement: [GraduationCap, FileText, UsersRound],
      nextSteps: [Compass, Library, Mail],
    },
  },
  technology: {
    primaryHref: (locale) => `/${locale}/partners/become`,
    secondaryHref: (locale) => `/${locale}/partners/resources`,
    ctaHref: (locale) => `/${locale}/partners/become`,
    nextStepHrefs: [
      (locale) => `/${locale}/platform/identity`,
      (locale) => `/${locale}/developers/api`,
      (locale) => `/${locale}/partners/resources`,
    ],
    icons: {
      hero: Workflow,
      audience: Boxes,
      build: [Fingerprint, Server, ShieldCheck, TerminalSquare, Activity, Database],
      collaboration: [Braces, KeyRound, GitBranch],
      positioning: [Workflow, Boxes, Database],
      operating: [Braces, GitBranch, KeyRound],
      resources: [Network, TerminalSquare, Database],
      enablement: [ShieldCheck, Activity, Fingerprint],
      nextSteps: [Layers3, Code2, Library],
    },
  },
  service: {
    primaryHref: (locale) => `/${locale}/partners/become`,
    secondaryHref: (locale) => `/${locale}/partners/program`,
    ctaHref: (locale) => `/${locale}/partners/become`,
    nextStepHrefs: [
      (locale) => `/${locale}/solutions/workplace`,
      (locale) => `/${locale}/partners/resources`,
      (locale) => `/${locale}/company/contact`,
    ],
    icons: {
      hero: Wrench,
      audience: UsersRound,
      build: [CloudCog, Layers3, GraduationCap, SearchCheck, Headphones],
      collaboration: [Route, BadgeCheck, ShieldQuestion, LifeBuoy],
      positioning: [Wrench, UsersRound, CloudCog],
      operating: [Route, LifeBuoy, ClipboardCheck],
      resources: [ClipboardCheck, GraduationCap, LifeBuoy],
      enablement: [SearchCheck, BadgeCheck, Headphones],
      nextSteps: [Building2, Library, Contact],
    },
  },
  distribution: {
    primaryHref: (locale) => `/${locale}/partners/become`,
    secondaryHref: (locale) => `/${locale}/partners/program`,
    ctaHref: (locale) => `/${locale}/partners/become`,
    nextStepHrefs: [
      (locale) => `/${locale}/solutions/government`,
      (locale) => `/${locale}/partners/resources`,
      (locale) => `/${locale}/company/contact`,
    ],
    icons: {
      hero: Map,
      audience: Handshake,
      build: [Store, Landmark, GraduationCap, Factory, HeartPulse, Banknote],
      collaboration: [PackageCheck, BriefcaseBusiness, Megaphone],
      positioning: [Map, Handshake, Banknote],
      operating: [PackageCheck, Megaphone, BriefcaseBusiness],
      resources: [PackageCheck, GraduationCap, Building2],
      enablement: [Store, Landmark, Factory],
      nextSteps: [HeartPulse, Library, Contact],
    },
  },
};

function buildPartnerContent(
  locale: string,
  slug: PartnerPageSlug,
  tPartners: Awaited<ReturnType<typeof getTranslations>>
): PartnerPageContent {
  const routeConfig = partnerRouteConfig[slug];
  const cards = (key: string) => tPartners.raw(key) as PartnerCard[];
  const steps = (key: string) => tPartners.raw(key) as ProcessStep[];
  const nextSteps = (key: string) => tPartners.raw(key) as Array<Omit<PartnerLinkCard, "href">>;

  return {
    badge: tPartners(`${slug}.badge`),
    title: tPartners(`${slug}.heroTitle`),
    description: tPartners(`${slug}.heroDescription`),
    primaryCta: tPartners(`${slug}.primaryCta`),
    primaryHref: routeConfig.primaryHref(locale),
    secondaryCta: routeConfig.secondaryHref ? tPartners(`${slug}.secondaryCta`) : undefined,
    secondaryHref: routeConfig.secondaryHref?.(locale),
    audienceTitle: tPartners(`${slug}.audienceTitle`),
    audienceDescription: tPartners(`${slug}.audienceDescription`),
    audienceItems: tPartners.raw(`${slug}.audienceItems`) as string[],
    buildTitle: tPartners(`${slug}.buildTitle`),
    buildDescription: tPartners(`${slug}.buildDescription`),
    buildItems: cards(`${slug}.buildItems`),
    collaborationTitle: tPartners(`${slug}.collaborationTitle`),
    collaborationDescription: tPartners(`${slug}.collaborationDescription`),
    collaborationItems: cards(`${slug}.collaborationItems`),
    positioningTitle: tPartners(`${slug}.positioningTitle`),
    positioningDescription: tPartners(`${slug}.positioningDescription`),
    positioningItems: cards(`${slug}.positioningItems`),
    processTitle: tPartners(`${slug}.processTitle`),
    processDescription: tPartners(`${slug}.processDescription`),
    processItems: steps(`${slug}.processItems`),
    operatingTitle: tPartners(`${slug}.operatingTitle`),
    operatingDescription: tPartners(`${slug}.operatingDescription`),
    operatingItems: cards(`${slug}.operatingItems`),
    resourcesTitle: tPartners(`${slug}.resourcesTitle`),
    resourcesDescription: tPartners(`${slug}.resourcesDescription`),
    resourcesItems: cards(`${slug}.resourcesItems`),
    enablementTitle: tPartners(`${slug}.enablementTitle`),
    enablementDescription: tPartners(`${slug}.enablementDescription`),
    enablementItems: cards(`${slug}.enablementItems`),
    supplementalSections: tPartners.raw(`${slug}.supplementalSections`) as PartnerSupplementalSection[],
    nextStepsTitle: tPartners(`${slug}.nextStepsTitle`),
    nextStepsDescription: tPartners(`${slug}.nextStepsDescription`),
    nextStepsItems: nextSteps(`${slug}.nextStepsItems`).map((item, index) => ({
      ...item,
      href: routeConfig.nextStepHrefs[index]?.(locale) ?? `/${locale}/partners/program`,
    })),
    ctaTitle: tPartners(`${slug}.ctaTitle`),
    ctaDescription: tPartners(`${slug}.ctaDescription`),
    ctaLabel: tPartners(`${slug}.ctaLabel`),
    ctaHref: routeConfig.ctaHref(locale),
  };
}

export async function generatePartnersMetadata(
  params: PartnersPageParams["params"],
  slug: PartnerPageSlug
): Promise<Metadata> {
  const { locale } = await params;
  const tPartners = await getTranslations({ locale, namespace: "Partners" });

  return {
    title: `${tPartners(`${slug}.heroTitle`)} | ${tPartners("meta.brand")}`,
    description: tPartners(`${slug}.heroDescription`),
  };
}

export async function renderPartnersPage(
  params: PartnersPageParams["params"],
  slug: PartnerPageSlug
) {
  const { locale } = await params;
  const tPartners = await getTranslations({ locale, namespace: "Partners" });
  const content = buildPartnerContent(locale, slug, tPartners);

  return (
    <PartnersPage
      locale={locale}
      content={content}
      icons={partnerRouteConfig[slug].icons}
    />
  );
}
