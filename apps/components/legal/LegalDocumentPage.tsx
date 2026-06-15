/**
 * Sky Genesis Enterprise
 *
 * Scope: Official Website
 * Layer: Public Legal
 * Purpose: Provides shared legal document rendering for public legal pages.
 *
 * Stability: Active
 * Owner: SGE Web Platform
 * Contact: legal@skygenesisenterprise.com
 */

import * as React from "react";
import Link from "next/link";
import { Mail } from "lucide-react";

import { LegalSidebar } from "@/components/legal/LegalSidebar";
import { Footer } from "@/components/public/Footer";
import { Header } from "@/components/public/Header";
import { Button } from "@/components/ui/button";
import type { LegalDocument } from "@/lib/legal/legal-documents";
import type { Locale } from "@/lib/locale";

type LegalDocumentPageProps = {
  locale: string;
  document: LegalDocument;
};

export function LegalDocumentPage({
  locale,
  document,
}: LegalDocumentPageProps): React.JSX.Element {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header locale={locale as Locale} />

      <main className="flex-1">
        <section className="border-b border-border/50 bg-muted/20 py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex rounded-full border border-border/50 bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
                {document.badge}
              </div>
              <h1 className="mt-6 text-4xl font-normal tracking-tight text-foreground sm:text-5xl">
                {document.title}
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
                {document.description}
              </p>
              <dl className="mt-8 grid gap-4 rounded-2xl border border-border/50 bg-card p-5 text-sm text-muted-foreground sm:grid-cols-3">
                <div>
                  <dt className="font-medium text-foreground">
                    Dernière mise à jour
                  </dt>
                  <dd className="mt-1">{document.lastUpdated}</dd>
                </div>
                {document.effectiveDate && (
                  <div>
                    <dt className="font-medium text-foreground">
                      Date d'effet
                    </dt>
                    <dd className="mt-1">{document.effectiveDate}</dd>
                  </div>
                )}
                <div>
                  <dt className="font-medium text-foreground">Contact</dt>
                  <dd className="mt-1">
                    <Link
                      href={`mailto:${document.contactEmail}`}
                      className="transition-colors hover:text-foreground"
                    >
                      {document.contactEmail}
                    </Link>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        {document.highlights && document.highlights.length > 0 && (
          <section className="py-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid gap-4 md:grid-cols-3">
                {document.highlights.map((highlight) => (
                  <div
                    key={highlight.title}
                    className="rounded-2xl border border-border/50 bg-card p-5"
                  >
                    <h2 className="text-sm font-medium text-foreground">
                      {highlight.title}
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {highlight.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="pb-16 pt-8 lg:pb-24">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[280px_1fr] lg:px-8">
            <LegalSidebar locale={locale} activeSlug={document.slug} />

            <article className="max-w-3xl rounded-2xl border border-border/50 bg-card p-6 sm:p-8 lg:p-10">
              <div className="space-y-12">
                {document.sections.map((section) => (
                  <section
                    key={section.id}
                    id={section.id}
                    className="scroll-mt-28"
                  >
                    <h2 className="text-2xl font-medium tracking-tight text-foreground">
                      {section.title}
                    </h2>
                    <div className="mt-5 space-y-4 text-base leading-relaxed text-muted-foreground">
                      {section.content.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                  </section>
                ))}
              </div>

              <div className="mt-14 rounded-2xl border border-border/50 bg-muted/20 p-6">
                <h2 className="text-xl font-medium text-foreground">
                  Une question sur ce document ?
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Contactez l'équipe concernée pour toute demande liée à ce
                  document.
                </p>
                <Button asChild className="mt-5">
                  <Link href={`mailto:${document.contactEmail}`}>
                    <Mail className="h-4 w-4" />
                    {document.contactEmail}
                  </Link>
                </Button>
              </div>
            </article>
          </div>
        </section>
      </main>

      <Footer locale={locale as Locale} />
    </div>
  );
}
