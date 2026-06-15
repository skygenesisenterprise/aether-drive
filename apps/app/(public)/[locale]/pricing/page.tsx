import * as React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Cloud,
  Database,
  Globe,
  HardDrive,
  Headphones,
  LockKeyhole,
  Network,
  Server,
  ShieldCheck,
  Users,
  Wallet,
} from "lucide-react";
import {
  CompanyCTA,
  CompanyPageShell,
  CompanySection,
} from "@/components/public/company/company-page";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface MetadataParams {
  params: Promise<{ locale: string }>;
}

interface HeroSummaryItem {
  label: string;
  value: string;
}

interface PhilosophyItem {
  title: string;
  description: string;
}

interface PricingPlan {
  name: string;
  label: string;
  price: string;
  audience: string;
  description: string;
  cta: string;
  href: string;
  features: string[];
}

interface UsageFactor {
  label: string;
}

interface SupportRow {
  label: string;
  values: [string, string, string, string];
}

interface FaqItem {
  question: string;
  answer: string;
}

const planIcons = [BadgeCheck, Cloud, Building2, ShieldCheck] as const;
const usageIcons = [
  Server,
  HardDrive,
  Network,
  Users,
  Wallet,
  Database,
  Globe,
  Headphones,
  Cloud,
  LockKeyhole,
] as const;

function localizeHref(locale: string, href: string) {
  if (href.startsWith("#")) {
    return href;
  }

  return `/${locale}${href.startsWith("/") ? href : `/${href}`}`;
}

export async function generateMetadata({ params }: MetadataParams): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "CompanyPages.pricing.metadata" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

async function PricingHero({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "CompanyPages.pricing.hero" });
  const summaryItems = t.raw("summary.items") as HeroSummaryItem[];

  return (
    <section className="border-b border-border/60 bg-background py-24 sm:py-28 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:px-8">
        <div className="max-w-4xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/70 bg-muted/30 px-3 py-1 text-xs font-medium text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            {t("eyebrow")}
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-foreground text-balance sm:text-5xl lg:text-6xl">
            {t("title")}
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground sm:text-xl">
            {t("description")}
          </p>
          <p className="mt-5 max-w-3xl text-sm font-medium text-foreground/80 sm:text-base">
            {t("trust")}
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-12 px-6">
              <Link href="#plans">
                {t("primaryCta")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-12 px-6">
              <Link href={localizeHref(locale, "/company/contact")}>{t("secondaryCta")}</Link>
            </Button>
          </div>
        </div>

        <div className="rounded-2xl border border-border/60 bg-muted/30 p-4 sm:p-6">
          <div className="rounded-xl border border-border/60 bg-card p-5 sm:p-6">
            <div className="flex items-center justify-between border-b border-border/60 pb-4">
              <div>
                <p className="text-sm font-semibold text-foreground">{t("summary.title")}</p>
                <p className="mt-1 text-sm text-muted-foreground">{t("summary.description")}</p>
              </div>
              <Badge variant="outline" className="rounded-full px-3 py-1">
                {t("summary.badge")}
              </Badge>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {summaryItems.map((item, index) => {
                const Icon = planIcons[index];

                return (
                  <div
                    key={item.label}
                    className="rounded-xl border border-border/60 bg-background px-4 py-4"
                  >
                    <Icon className="h-4 w-4 text-foreground" />
                    <p className="mt-4 text-sm font-medium text-muted-foreground">
                      {item.label}
                    </p>
                    <p className="mt-1 text-base font-semibold text-foreground">{item.value}</p>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 rounded-xl border border-border/60 bg-background px-4 py-4">
              <p className="text-sm font-medium text-foreground">{t("summary.footerTitle")}</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {t("summary.footerDescription")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

async function PricingPhilosophy({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "CompanyPages.pricing.philosophy" });
  const items = t.raw("items") as PhilosophyItem[];

  return (
    <CompanySection eyebrow={t("eyebrow")} title={t("title")} description={t("description")}>
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-border/60 bg-card p-6 sm:p-8">
          <p className="text-lg leading-8 text-muted-foreground">{t("body")}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          {items.map((item) => (
            <div key={item.title} className="rounded-2xl border border-border/60 bg-muted/20 p-5">
              <p className="text-base font-semibold text-foreground">{item.title}</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </CompanySection>
  );
}

async function PlansSection({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "CompanyPages.pricing.plans" });
  const plans = t.raw("items") as PricingPlan[];

  return (
    <CompanySection eyebrow={t("eyebrow")} title={t("title")} description={t("description")}>
      <div id="plans" className="grid gap-5 scroll-mt-24 xl:grid-cols-4">
        {plans.map((plan, index) => {
          const Icon = planIcons[index];
          const isFeatured = plan.name === t("featuredPlan");

          return (
            <div
              key={plan.name}
              className={cn(
                "flex h-full flex-col rounded-2xl border border-border/60 bg-card p-6",
                isFeatured && "border-foreground/20 bg-muted/20 shadow-sm",
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-border/60 bg-muted/30">
                  <Icon className="h-5 w-5 text-foreground" />
                </div>
                <Badge
                  variant="outline"
                  className="rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.14em]"
                >
                  {plan.label}
                </Badge>
              </div>

              <div className="mt-6">
                <h3 className="text-xl font-semibold text-foreground">{plan.name}</h3>
                <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
                  {plan.price}
                </p>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">{plan.audience}</p>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                  {plan.description}
                </p>
              </div>

              <div className="mt-6 space-y-3 border-t border-border/60 pt-6">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-foreground/70" />
                    <span className="text-sm leading-6 text-foreground/90">{feature}</span>
                  </div>
                ))}
              </div>

              <Button
                asChild
                variant={isFeatured ? "default" : "outline"}
                className="mt-8 h-11 justify-between px-4"
              >
                <Link href={localizeHref(locale, plan.href)}>
                  {plan.cta}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          );
        })}
      </div>
    </CompanySection>
  );
}

async function UsageBasedSection({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "CompanyPages.pricing.usageBased" });
  const items = t.raw("items") as UsageFactor[];

  return (
    <CompanySection
      eyebrow={t("eyebrow")}
      title={t("title")}
      description={t("description")}
      muted
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {items.map((item, index) => {
          const Icon = usageIcons[index];

          return (
            <div key={item.label} className="rounded-2xl border border-border/60 bg-background p-5">
              <Icon className="h-4 w-4 text-foreground" />
              <p className="mt-4 text-sm font-medium text-foreground">{item.label}</p>
            </div>
          );
        })}
      </div>
      <div className="mt-8 rounded-2xl border border-border/60 bg-background p-6 sm:p-8">
        <p className="max-w-4xl text-base leading-7 text-muted-foreground sm:text-lg">
          {t("body")}
        </p>
      </div>
    </CompanySection>
  );
}

async function EnterpriseSection({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "CompanyPages.pricing.enterprise" });
  const items = t.raw("items") as string[];

  return (
    <CompanySection eyebrow={t("eyebrow")} title={t("title")} description={t("description")}>
      <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-stretch">
        <div className="rounded-2xl border border-foreground/15 bg-foreground px-6 py-8 text-background sm:px-8">
          <Badge className="rounded-full bg-background/10 px-3 py-1 text-background hover:bg-background/10">
            {t("badge")}
          </Badge>
          <h3 className="mt-6 text-3xl font-semibold tracking-tight">{t("cardTitle")}</h3>
          <p className="mt-4 text-base leading-7 text-background/80">{t("cardDescription")}</p>
          <Button
            asChild
            variant="secondary"
            size="lg"
            className="mt-8 h-12 px-6 text-foreground"
          >
            <Link href={localizeHref(locale, "/company/contact")}>{t("cta")}</Link>
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((item) => (
            <div key={item} className="rounded-2xl border border-border/60 bg-card p-5">
              <p className="text-sm font-medium text-foreground">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </CompanySection>
  );
}

async function OpenSourceSection({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "CompanyPages.pricing.openSource" });
  const items = t.raw("items") as string[];

  return (
    <CompanySection eyebrow={t("eyebrow")} title={t("title")} description={t("description")} muted>
      <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <div className="rounded-2xl border border-border/60 bg-background p-6 sm:p-8">
          <p className="text-base leading-7 text-muted-foreground sm:text-lg">{t("body")}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild className="h-11 px-5">
              <Link href={localizeHref(locale, "/community")}>{t("primaryCta")}</Link>
            </Button>
            <Button asChild variant="outline" className="h-11 px-5">
              <Link href={localizeHref(locale, "/company/contact")}>{t("secondaryCta")}</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((item) => (
            <div key={item} className="rounded-2xl border border-border/60 bg-card p-5">
              <p className="text-sm font-medium text-foreground">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </CompanySection>
  );
}

async function SupportComparison({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "CompanyPages.pricing.support" });
  const columns = t.raw("columns") as string[];
  const rows = t.raw("rows") as SupportRow[];

  return (
    <CompanySection eyebrow={t("eyebrow")} title={t("title")} description={t("description")}>
      <div className="rounded-2xl border border-border/60 bg-card p-2 sm:p-4">
        <Table className="min-w-180">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="h-12 px-4 text-muted-foreground">{t("capability")}</TableHead>
              {columns.map((column) => (
                <TableHead key={column} className="h-12 px-4 text-foreground">
                  {column}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.label}>
                <TableCell className="px-4 py-4 font-medium text-foreground">{row.label}</TableCell>
                {row.values.map((value, index) => (
                  <TableCell
                    key={`${row.label}-${columns[index]}`}
                    className="px-4 py-4 text-muted-foreground"
                  >
                    {value}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </CompanySection>
  );
}

async function PricingFaq({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "CompanyPages.pricing.faq" });
  const items = t.raw("items") as FaqItem[];

  return (
    <CompanySection eyebrow={t("eyebrow")} title={t("title")} description={t("description")} muted>
      <div className="rounded-2xl border border-border/60 bg-background p-4 sm:p-6">
        <Accordion type="single" collapsible className="w-full">
          {items.map((item, index) => (
            <AccordionItem key={item.question} value={`item-${index}`}>
              <AccordionTrigger className="text-base font-medium text-foreground hover:no-underline">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="max-w-4xl text-sm leading-7 text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </CompanySection>
  );
}

export default async function PricingPage({ params }: MetadataParams) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "CompanyPages.pricing.cta" });
  const common = await getTranslations({ locale, namespace: "CompanyPages.common" });

  return (
    <CompanyPageShell locale={locale}>
      <PricingHero locale={locale} />
      <PricingPhilosophy locale={locale} />
      <PlansSection locale={locale} />
      <UsageBasedSection locale={locale} />
      <EnterpriseSection locale={locale} />
      <OpenSourceSection locale={locale} />
      <SupportComparison locale={locale} />
      <PricingFaq locale={locale} />
      <CompanyCTA
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
        actions={[
          { label: common("contact"), href: `/${locale}/company/contact` },
          { label: t("secondaryCta"), href: `/${locale}/platform`, variant: "outline" },
        ]}
      />
    </CompanyPageShell>
  );
}
