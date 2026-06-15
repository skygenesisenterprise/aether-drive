import * as React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/lib/locale";
import {
  type SecurityCard,
  type SecurityDefinitionSection,
  type SecurityNumberedSection,
  type SecurityPageContent,
  type SecurityPageStatus,
  type SecuritySection,
} from "@/lib/security/security-resources";
import { cn } from "@/lib/utils";

interface SecurityResourcePageProps {
  locale: string;
  page: SecurityPageContent;
}

interface SecuritySectionProps {
  eyebrow: string;
  title: string;
  description?: string;
  muted?: boolean;
  children: React.ReactNode;
}

function localizeHref(locale: string, href: string) {
  if (href.startsWith("http") || href.startsWith("mailto:")) {
    return href;
  }

  return `/${locale}${href.startsWith("/") ? href : `/${href}`}`;
}

function SecuritySection({
  eyebrow,
  title,
  description,
  muted = false,
  children,
}: SecuritySectionProps) {
  return (
    <section className={cn("py-20 sm:py-24", muted && "bg-muted/35")}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
            {eyebrow}
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {title}
          </h2>
          {description ? (
            <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
              {description}
            </p>
          ) : null}
        </div>
        {children}
      </div>
    </section>
  );
}

function SecurityStatusBadge({ status }: { status: SecurityPageStatus }) {
  const toneByStatus: Record<SecurityPageStatus, string> = {
    "Cadre public": "border-primary/20 bg-primary/10 text-primary",
    "En amélioration continue":
      "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    "Approche progressive":
      "border-sky-500/25 bg-sky-500/10 text-sky-700 dark:text-sky-300",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium",
        toneByStatus[status]
      )}
    >
      {status}
    </span>
  );
}

function SecurityCTA({
  locale,
  href,
  label,
  variant = "primary",
}: {
  locale: string;
  href: string;
  label: string;
  variant?: "primary" | "secondary";
}) {
  const isPrimary = variant !== "secondary";

  return (
    <Button
      asChild
      size="lg"
      variant={isPrimary ? "default" : "outline"}
      className={cn(
        "h-12 rounded-md px-6 text-sm font-medium",
        isPrimary && "bg-primary text-primary-foreground hover:bg-primary/90"
      )}
    >
      <Link href={localizeHref(locale, href)}>
        {label}
        {isPrimary ? <ArrowRight className="h-4 w-4" /> : null}
      </Link>
    </Button>
  );
}

function SecurityHero({ locale, page }: SecurityResourcePageProps) {
  const t = useTranslations("Public.home.page.securityPage.common");

  return (
    <section className="border-b border-border bg-background py-24 sm:py-28 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <div className="max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-primary">
            {page.eyebrow}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <h1 className="text-5xl font-semibold tracking-tight text-foreground sm:text-6xl">
              {page.title}
            </h1>
            <SecurityStatusBadge status={page.status} />
          </div>
          <p className="mt-6 max-w-2xl text-xl leading-8 text-muted-foreground">
            {page.description}
          </p>
          {page.body ? (
            <p className="mt-5 max-w-3xl text-base leading-7 text-muted-foreground">
              {page.body}
            </p>
          ) : null}
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            {page.ctas.map((cta) => (
              <SecurityCTA
                key={cta.href}
                locale={locale}
                href={cta.href}
                label={cta.label}
                variant={cta.variant}
              />
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-border bg-muted/50 p-6 lg:p-8">
          <div className="flex items-center justify-between gap-4 border-b border-border pb-5">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                {t("profile")}
              </p>
              <p className="mt-2 text-lg font-semibold text-foreground">{page.title}</p>
            </div>
            <SecurityStatusBadge status={page.status} />
          </div>
          <dl className="mt-6 grid gap-4">
            {page.profileItems.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between gap-4 rounded-md border border-border bg-card px-4 py-3"
              >
                <dt className="text-sm text-muted-foreground">{item.label}</dt>
                <dd className="text-right text-sm font-medium text-foreground">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

function cardGridClass(columns: 2 | 3 = 3) {
  return columns === 2 ? "grid gap-5 md:grid-cols-2" : "grid gap-5 md:grid-cols-2 lg:grid-cols-3";
}

function CardContent({ card, number }: { card: SecurityCard; number?: number }) {
  const Icon = card.icon;
  const t = useTranslations("Public.home.page.securityPage.common");

  return (
    <>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          {typeof number === "number" ? (
            <div className="flex h-9 w-9 items-center justify-center rounded-md border border-primary/20 bg-primary/10 text-sm font-semibold text-primary">
              {number + 1}
            </div>
          ) : Icon ? (
            <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
          ) : null}
          <h3 className="text-base font-semibold text-foreground">{card.title}</h3>
        </div>
        {card.status ? <SecurityStatusBadge status={card.status} /> : null}
      </div>
      <p className="mt-4 text-sm leading-7 text-muted-foreground">{card.description}</p>
      {card.meta?.length ? (
        <ul className="mt-5 space-y-2">
          {card.meta.map((item) => (
            <li key={item} className="text-sm text-muted-foreground">
              {item}
            </li>
          ))}
        </ul>
      ) : null}
      {card.href ? (
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary">
          {t("explore")}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </span>
      ) : null}
    </>
  );
}

function renderCardItem(locale: string, card: SecurityCard, number?: number) {
  const className =
    "rounded-lg border border-border bg-card p-6 transition-colors hover:border-primary/20";

  if (card.href) {
    return (
      <Link key={card.title} href={localizeHref(locale, card.href)} className={className}>
        <CardContent card={card} number={number} />
      </Link>
    );
  }

  return (
    <div key={card.title} className={className}>
      <CardContent card={card} number={number} />
    </div>
  );
}

function SecurityCardsSection({
  locale,
  section,
}: {
  locale: string;
  section: Extract<SecuritySection, { kind: "cards" }>;
}) {
  return (
    <SecuritySection
      eyebrow={section.eyebrow}
      title={section.title}
      description={section.description}
      muted={section.muted}
    >
      <div className={cardGridClass(section.columns)}>
        {section.cards.map((card) => renderCardItem(locale, card))}
      </div>
    </SecuritySection>
  );
}

function SecurityNumberedGridSection({
  locale,
  section,
}: {
  locale: string;
  section: SecurityNumberedSection;
}) {
  return (
    <SecuritySection
      eyebrow={section.eyebrow}
      title={section.title}
      description={section.description}
      muted={section.muted}
    >
      <div className={cardGridClass(section.columns)}>
        {section.items.map((item, index) =>
          renderCardItem(
            locale,
            { title: item.title, description: item.description, href: item.href },
            index
          )
        )}
      </div>
    </SecuritySection>
  );
}

function SecurityDefinitionsSection({ section }: { section: SecurityDefinitionSection }) {
  return (
    <SecuritySection
      eyebrow={section.eyebrow}
      title={section.title}
      description={section.description}
      muted={section.muted}
    >
      <div className={cardGridClass(section.columns)}>
        {section.items.map((item) => (
          <div key={item.label} className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-start justify-between gap-4">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                {item.label}
              </p>
              {item.status ? <SecurityStatusBadge status={item.status} /> : null}
            </div>
            <p
              className={cn(
                "mt-4 text-base font-semibold text-foreground",
                item.monospace && "font-mono text-sm"
              )}
            >
              {item.value}
            </p>
            {item.description ? (
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.description}</p>
            ) : null}
          </div>
        ))}
      </div>
    </SecuritySection>
  );
}

function SecurityBottomSection({ locale, page }: SecurityResourcePageProps) {
  const t = useTranslations("Public.home.page.securityPage.common");

  if (!page.bottomTitle || !page.bottomLinks?.length) {
    return null;
  }

  return (
    <SecuritySection
      eyebrow={t("bottomEyebrow")}
      title={page.bottomTitle}
      description={page.bottomDescription}
      muted
    >
      <div className="grid gap-5 md:grid-cols-3">
        {page.bottomLinks.map((link) => (
          <Link
            key={link.href}
            href={localizeHref(locale, link.href)}
            className="rounded-lg border border-border bg-card p-6 transition-colors hover:border-primary/20"
          >
            <h3 className="text-base font-semibold text-foreground">{link.label}</h3>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              {page.bottomDescription}
            </p>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary">
              {t("continue")}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </span>
          </Link>
        ))}
      </div>
    </SecuritySection>
  );
}

function renderSection(locale: string, section: SecuritySection) {
  switch (section.kind) {
    case "cards":
      return <SecurityCardsSection key={section.title} locale={locale} section={section} />;
    case "numbered":
      return <SecurityNumberedGridSection key={section.title} locale={locale} section={section} />;
    case "definitions":
      return <SecurityDefinitionsSection key={section.title} section={section} />;
    default:
      return null;
  }
}

export function SecurityResourcePage({ locale, page }: SecurityResourcePageProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header locale={locale as Locale} />
      <main className="flex-1">
        <SecurityHero locale={locale} page={page} />
        {page.sections.map((section) => renderSection(locale, section))}
        <SecurityBottomSection locale={locale} page={page} />
      </main>
      <Footer locale={locale as Locale} />
    </div>
  );
}
