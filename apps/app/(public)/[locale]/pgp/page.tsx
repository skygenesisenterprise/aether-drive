import * as React from "react";
import type { Metadata } from "next";
import { createHash } from "node:crypto";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import {
  AlertTriangle,
  ArrowRight,
  Binary,
  CheckCircle2,
  ChevronRight,
  Download,
  FileCheck2,
  Fingerprint,
  Globe2,
  KeyRound,
  Landmark,
  LifeBuoy,
  Link2,
  LockKeyhole,
  Mail,
  RotateCw,
  SearchCheck,
  Shield,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { Footer } from "@/components/public/Footer";
import { Header } from "@/components/public/Header";
import { FingerprintCopyButton } from "@/components/public/pgp/fingerprint-copy-button";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/lib/locale";
import { cn } from "@/lib/utils";

interface PageParams {
  params: Promise<{ locale: string }>;
}

interface SimpleItem {
  title: string;
  description: string;
}

interface DownloadItem extends SimpleItem {
  format: string;
  cta?: string;
  href?: string;
}

interface ContactItem extends SimpleItem {
  email: string;
}

interface VerificationItem extends SimpleItem {
  href?: string;
  label: string;
}

function localizeHref(locale: string, href: string) {
  if (href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("/pgp/") || href.startsWith("/.well-known/")) {
    return href;
  }

  return `/${locale}${href.startsWith("/") ? href : `/${href}`}`;
}

function SectionEyebrow({ children, inverted = false }: { children: React.ReactNode; inverted?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.26em]",
        inverted ? "text-background/58" : "text-muted-foreground",
      )}
    >
      <span className={cn("h-px w-10", inverted ? "bg-background/18" : "bg-border")} />
      {children}
    </span>
  );
}

function PageSection({
  id,
  eyebrow,
  title,
  description,
  tone = "default",
  children,
}: {
  id?: string;
  eyebrow: string;
  title: string;
  description?: string;
  tone?: "default" | "muted" | "dark";
  children: React.ReactNode;
}) {
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
              "linear-gradient(to right, rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.7) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
      ) : null}
      <div className="relative mx-auto max-w-360 px-6 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionEyebrow inverted={dark}>{eyebrow}</SectionEyebrow>
          <h2
            className={cn(
              "mt-6 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl lg:text-6xl",
              dark ? "text-background" : "text-foreground",
            )}
          >
            {title}
          </h2>
          {description ? (
            <p className={cn("mt-6 max-w-3xl text-lg leading-8", dark ? "text-background/68" : "text-muted-foreground")}>
              {description}
            </p>
          ) : null}
        </div>
        <div className="mt-14">{children}</div>
      </div>
    </section>
  );
}

function FingerprintMatrix({ value }: { value: string }) {
  const size = 29;
  const hash = createHash("sha256").update(value).digest("hex");
  const bits = hash
    .split("")
    .flatMap((char) => Number.parseInt(char, 16).toString(2).padStart(4, "0").split("").map((bit) => bit === "1"));

  let pointer = 0;
  const matrix = Array.from({ length: size }, (_, y) =>
    Array.from({ length: size }, (_, x) => {
      const inFinder =
        (x < 7 && y < 7) ||
        (x >= size - 7 && y < 7) ||
        (x < 7 && y >= size - 7);

      if (inFinder) {
        const localX = x < 7 ? x : x - (size - 7);
        const localY = y < 7 ? y : y - (size - 7);
        const outer = localX === 0 || localX === 6 || localY === 0 || localY === 6;
        const inner = localX >= 2 && localX <= 4 && localY >= 2 && localY <= 4;

        return outer || inner;
      }

      if (x === 7 || y === 7 || x === size - 8 || y === size - 8) {
        return (x + y) % 2 === 0;
      }

      const valueAtBit = bits[pointer % bits.length];
      pointer += 1;
      return valueAtBit;
    }),
  );

  return (
    <div className="rounded-4xl border border-border bg-card p-5 shadow-[0_24px_80px_-52px_rgba(15,23,42,0.25)]">
      <div className="grid grid-cols-29 gap-1 rounded-[1.4rem] bg-muted p-4">
        {matrix.flatMap((row, rowIndex) =>
          row.map((filled, columnIndex) => (
            <span
              key={`${rowIndex}-${columnIndex}`}
              className={cn("aspect-square rounded-[3px]", filled ? "bg-foreground" : "bg-background")}
            />
          )),
        )}
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Public.pgp.metadata" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function PGPPage({ params }: PageParams) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Public.pgp" });

  const purposeItems = t.raw("purpose.items") as string[];
  const downloads = t.raw("downloads.items") as DownloadItem[];
  const verificationSteps = t.raw("verification.steps") as string[];
  const useCases = t.raw("useCases.items") as SimpleItem[];
  const contacts = t.raw("contacts.items") as ContactItem[];
  const keyManagement = t.raw("keyManagement.items") as SimpleItem[];
  const trustChain = t.raw("trustChain.items") as string[];
  const transparencyItems = t.raw("transparency.items") as SimpleItem[];
  const securityProgram = t.raw("securityProgram.items") as SimpleItem[];
  const faqItems = t.raw("faq.items") as SimpleItem[];
  const verificationMethods = t.raw("additionalVerification.items") as VerificationItem[];

  const fingerprint = t("fingerprint.value");
  const fingerprintCompact = fingerprint.replaceAll(" ", "");
  const keyBlock = t("downloads.keyBlock");

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header locale={locale as Locale} />

      <main className="flex-1 overflow-x-hidden">
        <section className="relative overflow-hidden border-b border-border/80 bg-linear-to-b from-background to-muted">
          <div aria-hidden={true} className="pointer-events-none absolute inset-0">
            <div className="absolute inset-x-0 top-0 h-44 bg-[radial-gradient(circle_at_top,rgba(148,163,184,0.18),transparent_65%)]" />
            <div className="absolute inset-x-[-8%] top-[18%] h-[54%] bg-[radial-gradient(circle_at_center,rgba(15,23,42,0.08),transparent_62%)]" />
            <div className="absolute inset-0 bg-linear-to-b from-background/76 via-background/34 to-background/82" />
          </div>

          <div className="relative mx-auto flex min-h-[88vh] max-w-360 items-center px-6 py-20 sm:py-24 lg:px-12 lg:py-28">
            <div className="grid w-full gap-10 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] xl:items-center">
              <div className="max-w-4xl">
                <SectionEyebrow>{t("hero.eyebrow")}</SectionEyebrow>
                <h1 className="mt-7 max-w-5xl text-[clamp(3.2rem,7vw,6.8rem)] font-semibold leading-[0.92] tracking-[-0.06em] text-foreground">
                  {t("hero.title")}
                </h1>
                <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground sm:text-xl">{t("hero.description")}</p>
                <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                  <Button asChild size="lg" className="h-14 rounded-full bg-foreground px-8 text-sm font-medium text-background hover:bg-foreground/90">
                    <a href="/pgp/sky-genesis-enterprise.asc" download={true}>
                      {t("hero.primaryCta")}
                      <Download className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="h-14 rounded-full px-8 text-sm font-medium">
                    <Link href="#fingerprint">{t("hero.secondaryCta")}</Link>
                  </Button>
                </div>
                <div className="mt-10 grid gap-3 sm:grid-cols-3">
                  {(t.raw("hero.signals") as string[]).map((signal) => (
                    <div key={signal} className="rounded-3xl border border-border bg-card/85 px-5 py-4 shadow-[0_18px_60px_-48px_rgba(15,23,42,0.22)]">
                      <div className="text-sm font-medium text-foreground">{signal}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[2.4rem] border border-border bg-card p-6 shadow-[0_32px_100px_-52px_rgba(15,23,42,0.3)]">
                <div className="grid gap-4 sm:grid-cols-2">
                  {(t.raw("hero.metrics") as Array<{ label: string; value: string }>).map((metric) => (
                    <div key={metric.label} className="rounded-[1.6rem] border border-border bg-muted px-5 py-5">
                      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">{metric.label}</div>
                      <div className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-foreground">{metric.value}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 rounded-[1.75rem] border border-border bg-foreground px-6 py-6 text-background">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-background/46">{t("hero.identityCard.eyebrow")}</div>
                      <div className="mt-3 text-2xl font-semibold tracking-[-0.04em]">{t("hero.identityCard.title")}</div>
                    </div>
                    <Shield className="h-6 w-6 text-background/82" aria-hidden={true} />
                  </div>
                  <p className="mt-4 text-sm leading-7 text-background/68">{t("hero.identityCard.description")}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <PageSection eyebrow={t("purpose.eyebrow")} title={t("purpose.title")} description={t("purpose.description")}>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
            {purposeItems.map((item) => (
              <div key={item} className="rounded-4xl border border-border bg-card p-6 shadow-[0_20px_60px_-45px_rgba(15,23,42,0.24)]">
                <Shield className="h-5 w-5 text-muted-foreground" aria-hidden={true} />
                <div className="mt-5 text-base font-semibold text-foreground">{item}</div>
              </div>
            ))}
          </div>
        </PageSection>

        <PageSection
          id="fingerprint"
          eyebrow={t("fingerprint.eyebrow")}
          title={t("fingerprint.title")}
          description={t("fingerprint.description")}
          tone="muted"
        >
          <div className="grid gap-8 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] xl:items-center">
            <div className="rounded-[2.4rem] border border-border bg-card p-8 shadow-[0_32px_100px_-52px_rgba(15,23,42,0.28)]">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="inline-flex items-center gap-3 rounded-full border border-border bg-muted px-4 py-2 text-sm font-medium text-muted-foreground">
                  <Fingerprint className="h-4 w-4" aria-hidden={true} />
                  {t("fingerprint.badge")}
                </div>
                <FingerprintCopyButton value={fingerprint} />
              </div>
              <code className="mt-8 block rounded-[1.8rem] border border-border bg-muted px-5 py-6 font-mono text-lg leading-8 tracking-[0.18em] text-foreground sm:text-xl">
                {fingerprint}
              </code>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.6rem] border border-border bg-muted px-5 py-5">
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">{t("fingerprint.downloadLabel")}</div>
                  <div className="mt-3 text-base font-semibold text-foreground">{t("fingerprint.downloadValue")}</div>
                </div>
                <div className="rounded-[1.6rem] border border-border bg-muted px-5 py-5">
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">{t("fingerprint.wkdLabel")}</div>
                  <div className="mt-3 text-base font-semibold text-foreground">{t("fingerprint.wkdValue")}</div>
                </div>
              </div>
              <div className="mt-8">
                <Button asChild className="rounded-full px-6">
                  <a href="/pgp/sky-genesis-enterprise.asc" download={true}>
                    {t("fingerprint.cta")}
                    <Download className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <FingerprintMatrix value={`openpgp4fpr:${fingerprintCompact}`} />
              <div className="rounded-[1.8rem] border border-border bg-card p-6">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{t("fingerprint.qrEyebrow")}</div>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{t("fingerprint.qrDescription")}</p>
              </div>
            </div>
          </div>
        </PageSection>

        <PageSection eyebrow={t("downloads.eyebrow")} title={t("downloads.title")} description={t("downloads.description")}>
          <div className="grid gap-5 xl:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)]">
            <div className="space-y-5">
              {downloads.map((item) => (
                <div key={item.format} className="rounded-4xl border border-border bg-card p-7 shadow-[0_20px_60px_-45px_rgba(15,23,42,0.22)]">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{item.format}</div>
                      <div className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-foreground">{item.title}</div>
                    </div>
                    {item.format.includes("Binary") ? <Binary className="h-5 w-5 text-muted-foreground" aria-hidden={true} /> : <Download className="h-5 w-5 text-muted-foreground" aria-hidden={true} />}
                  </div>
                  <p className="mt-4 text-sm leading-7 text-muted-foreground">{item.description}</p>
                  {item.cta && item.href ? (
                    <div className="mt-6">
                      <Button asChild variant="outline" className="rounded-full px-5">
                        <a href={localizeHref(locale, item.href)} download={item.href.endsWith(".asc")}>
                          {item.cta}
                          <ArrowRight className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>

            <div className="rounded-[2.3rem] border border-border bg-card p-6 shadow-[0_30px_100px_-60px_rgba(15,23,42,0.28)]">
              <div className="flex items-center justify-between gap-4">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">{t("downloads.keyBlockLabel")}</div>
                <FingerprintCopyButton value={keyBlock} />
              </div>
                <div className="mt-6 max-h-136 overflow-auto rounded-[1.7rem] border border-border bg-muted p-5">
                <pre className="whitespace-pre-wrap break-all font-mono text-xs leading-6 text-muted-foreground">{keyBlock}</pre>
              </div>
            </div>
          </div>
        </PageSection>

        <PageSection eyebrow={t("verification.eyebrow")} title={t("verification.title")} description={t("verification.description")} tone="muted">
          <div className="mx-auto max-w-5xl rounded-[2.5rem] border border-border bg-card p-6 shadow-[0_30px_100px_-60px_rgba(15,23,42,0.28)] sm:p-8">
            <div className="grid gap-5">
              {verificationSteps.map((step, index) => (
                <React.Fragment key={step}>
                  <div className="rounded-[1.75rem] border border-border bg-muted p-6">
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-sm font-semibold text-foreground">
                        {index + 1}
                      </div>
                      <div className="text-2xl font-semibold tracking-[-0.04em] text-foreground">{step}</div>
                    </div>
                  </div>
                  {index < verificationSteps.length - 1 ? (
                    <div className="flex justify-center" aria-hidden={true}>
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card text-muted-foreground">
                        <ArrowRight className="h-4 w-4 rotate-90" />
                      </div>
                    </div>
                  ) : null}
                </React.Fragment>
              ))}
            </div>
          </div>
        </PageSection>

        <PageSection eyebrow={t("encryption.eyebrow")} title={t("encryption.title")} description={t("encryption.description")}>
          <div className="grid gap-6 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
            <div className="rounded-[2.2rem] border border-border bg-card p-7 shadow-[0_24px_80px_-52px_rgba(15,23,42,0.24)]">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">{t("encryption.panel.eyebrow")}</div>
              <div className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-foreground">{t("encryption.panel.title")}</div>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">{t("encryption.panel.description")}</p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Button asChild className="rounded-full px-6">
                  <a href="mailto:security@skygenesisenterprise.com">{t("encryption.panel.primaryCta")}</a>
                </Button>
                <Button asChild variant="outline" className="rounded-full px-6">
                  <a href="/pgp/sky-genesis-enterprise.asc" download={true}>
                    {t("encryption.panel.secondaryCta")}
                  </a>
                </Button>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {(t.raw("encryption.steps") as Array<{ title: string; description: string; icon: string }>).map((item) => {
                const iconByKey = {
                  key: KeyRound,
                  encrypt: LockKeyhole,
                  send: Mail,
                } as const;
                const Icon = iconByKey[item.icon as keyof typeof iconByKey] ?? Shield;

                return (
                  <div key={item.title} className="rounded-4xl border border-border bg-card p-6">
                    <Icon className="h-5 w-5 text-muted-foreground" aria-hidden={true} />
                    <div className="mt-5 text-xl font-semibold tracking-[-0.03em] text-foreground">{item.title}</div>
                    <p className="mt-4 text-sm leading-7 text-muted-foreground">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </PageSection>

        <PageSection eyebrow={t("useCases.eyebrow")} title={t("useCases.title")} description={t("useCases.description")} tone="muted">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {useCases.map((item) => (
              <div
                key={item.title}
                className="group rounded-4xl border border-border bg-card p-6 shadow-[0_20px_60px_-45px_rgba(15,23,42,0.22)] transition duration-300 hover:-translate-y-1 hover:border-foreground/15"
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-muted text-muted-foreground">
                  <FileCheck2 className="h-5 w-5" aria-hidden={true} />
                </div>
                <div className="mt-8 text-xl font-semibold tracking-[-0.03em] text-foreground">{item.title}</div>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </PageSection>

        <PageSection eyebrow={t("contacts.eyebrow")} title={t("contacts.title")} description={t("contacts.description")}>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {contacts.map((item) => (
              <a
                key={item.email}
                href={`mailto:${item.email}`}
                className="group rounded-4xl border border-border bg-card p-6 shadow-[0_18px_60px_-48px_rgba(15,23,42,0.22)] transition duration-300 hover:-translate-y-1 hover:border-foreground/15"
              >
                <div className="flex items-center justify-between gap-4">
                  <Mail className="h-5 w-5 text-muted-foreground" aria-hidden={true} />
                  <ChevronRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5" aria-hidden={true} />
                </div>
                <div className="mt-8 text-xl font-semibold tracking-[-0.03em] text-foreground">{item.email}</div>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">{item.description}</p>
              </a>
            ))}
          </div>
        </PageSection>

        <PageSection eyebrow={t("keyManagement.eyebrow")} title={t("keyManagement.title")} description={t("keyManagement.description")} tone="muted">
          <div className="grid gap-5 lg:grid-cols-2">
            {keyManagement.map((item) => (
              <div key={item.title} className="rounded-4xl border border-border bg-card p-7 shadow-[0_20px_60px_-45px_rgba(15,23,42,0.24)]">
                <div className="flex items-center gap-3">
                  <RotateCw className="h-5 w-5 text-muted-foreground" aria-hidden={true} />
                  <div className="text-2xl font-semibold tracking-[-0.04em] text-foreground">{item.title}</div>
                </div>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </PageSection>

        <PageSection eyebrow={t("trustChain.eyebrow")} title={t("trustChain.title")} description={t("trustChain.description")} tone="dark">
          <div className="mx-auto max-w-4xl">
            <div className="grid gap-4">
              {trustChain.map((item, index) => (
                <React.Fragment key={item}>
                  <div className="rounded-4xl border border-background/10 bg-background/4 px-6 py-6 text-2xl font-semibold tracking-[-0.04em] text-background">
                    {item}
                  </div>
                  {index < trustChain.length - 1 ? (
                    <div className="flex justify-center" aria-hidden={true}>
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-background/10 bg-background/4 text-background/68">
                        <ArrowRight className="h-4 w-4 rotate-90" />
                      </div>
                    </div>
                  ) : null}
                </React.Fragment>
              ))}
            </div>
          </div>
        </PageSection>

        <PageSection eyebrow={t("transparency.eyebrow")} title={t("transparency.title")} description={t("transparency.description")}>
          <div className="grid gap-5 lg:grid-cols-4">
            {transparencyItems.map((item, index) => {
              const icons = [Link2, SearchCheck, Sparkles, ShieldAlert] as const;
              const Icon = icons[index] ?? Globe2;

              return (
                <div key={item.title} className="rounded-4xl border border-border bg-card p-7 shadow-[0_20px_60px_-45px_rgba(15,23,42,0.22)]">
                  <Icon className="h-5 w-5 text-muted-foreground" aria-hidden={true} />
                  <div className="mt-5 text-xl font-semibold tracking-[-0.03em] text-foreground">{item.title}</div>
                  <p className="mt-4 text-sm leading-7 text-muted-foreground">{item.description}</p>
                </div>
              );
            })}
          </div>
        </PageSection>

        <PageSection eyebrow={t("securityProgram.eyebrow")} title={t("securityProgram.title")} description={t("securityProgram.description")} tone="muted">
          <div className="grid gap-5 md:grid-cols-3">
            {securityProgram.map((item) => (
              <div key={item.title} className="rounded-4xl border border-border bg-card p-7 shadow-[0_18px_60px_-48px_rgba(15,23,42,0.22)]">
                <LifeBuoy className="h-5 w-5 text-muted-foreground" aria-hidden={true} />
                <div className="mt-5 text-2xl font-semibold tracking-[-0.04em] text-foreground">{item.title}</div>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </PageSection>

        <PageSection eyebrow={t("faq.eyebrow")} title={t("faq.title")} description={t("faq.description")}>
          <div className="grid gap-5 lg:grid-cols-2">
            {faqItems.map((item) => (
              <div key={item.title} className="rounded-4xl border border-border bg-card p-7 shadow-[0_18px_60px_-48px_rgba(15,23,42,0.22)]">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-muted-foreground" aria-hidden={true} />
                  <div className="text-xl font-semibold tracking-[-0.03em] text-foreground">{item.title}</div>
                </div>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </PageSection>

        <PageSection eyebrow={t("additionalVerification.eyebrow")} title={t("additionalVerification.title")} description={t("additionalVerification.description")} tone="muted">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
            {verificationMethods.map((item) => {
              const iconByLabel = {
                github: Link2,
                linkedin: Globe2,
                securitytxt: Shield,
                dns: Globe2,
                ownership: Landmark,
              } as const;
              const Icon = iconByLabel[item.label as keyof typeof iconByLabel] ?? Link2;

              const card = (
                <div className="group h-full rounded-4xl border border-border bg-card p-6 shadow-[0_18px_60px_-48px_rgba(15,23,42,0.22)] transition duration-300 hover:-translate-y-1 hover:border-foreground/15">
                  <div className="flex items-center justify-between gap-4">
                    <Icon className="h-5 w-5 text-muted-foreground" aria-hidden={true} />
                    {item.href ? <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5" aria-hidden={true} /> : null}
                  </div>
                  <div className="mt-8 text-xl font-semibold tracking-[-0.03em] text-foreground">{item.title}</div>
                  <p className="mt-4 text-sm leading-7 text-muted-foreground">{item.description}</p>
                </div>
              );

              if (!item.href) {
                return <div key={item.title}>{card}</div>;
              }

              return (
                <Link key={item.title} href={localizeHref(locale, item.href)} target={item.href.startsWith("http") ? "_blank" : undefined} rel={item.href.startsWith("http") ? "noreferrer" : undefined}>
                  {card}
                </Link>
              );
            })}
          </div>
        </PageSection>

        <section className="relative overflow-hidden border-t border-border py-24 sm:py-28">
          <div aria-hidden={true} className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(9,9,11,1)_0%,rgba(24,24,27,0.98)_100%)]" />
          <div
            aria-hidden={true}
            className="pointer-events-none absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.8) 1px, transparent 1px)",
              backgroundSize: "80px 80px",
            }}
          />
          <div className="relative mx-auto max-w-360 px-6 lg:px-12">
            <div className="rounded-[2.6rem] border border-background/10 bg-background/3 px-8 py-10 shadow-[0_40px_120px_-80px_rgba(0,0,0,0.6)] sm:px-10 lg:px-14 lg:py-14">
              <SectionEyebrow inverted>{t("finalCta.eyebrow")}</SectionEyebrow>
              <h2 className="mt-6 max-w-4xl text-4xl font-semibold tracking-tighter text-background sm:text-5xl lg:text-6xl">
                {t("finalCta.title")}
              </h2>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-background/68">{t("finalCta.description")}</p>
              <div className="mt-12 grid gap-5 md:grid-cols-2">
                <a
                  href="mailto:security@skygenesisenterprise.com"
                  className="group rounded-4xl border border-background/10 bg-background/4 p-6 transition duration-300 hover:-translate-y-1 hover:border-background/20 hover:bg-background/6"
                >
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-background/10 bg-background/4 text-background/88">
                    <Mail className="h-5 w-5" />
                  </span>
                  <div className="mt-8 text-sm font-medium uppercase tracking-[0.18em] text-background/46">{t("finalCta.primary.eyebrow")}</div>
                  <div className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-background">{t("finalCta.primary.title")}</div>
                  <p className="mt-4 text-sm leading-7 text-background/64">{t("finalCta.primary.description")}</p>
                  <span className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-background">
                    {t("finalCta.primary.cta")}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </a>
                <a
                  href="mailto:security@skygenesisenterprise.com?subject=Vulnerability%20Report"
                  className="group rounded-4xl border border-background/10 bg-background/4 p-6 transition duration-300 hover:-translate-y-1 hover:border-background/20 hover:bg-background/6"
                >
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-background/10 bg-background/4 text-background/88">
                    <AlertTriangle className="h-5 w-5" />
                  </span>
                  <div className="mt-8 text-sm font-medium uppercase tracking-[0.18em] text-background/46">{t("finalCta.secondary.eyebrow")}</div>
                  <div className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-background">{t("finalCta.secondary.title")}</div>
                  <p className="mt-4 text-sm leading-7 text-background/64">{t("finalCta.secondary.description")}</p>
                  <span className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-background">
                    {t("finalCta.secondary.cta")}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer locale={locale as Locale} />
    </div>
  );
}
