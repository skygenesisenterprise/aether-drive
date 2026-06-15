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

import {
  legalDocumentOrder,
  legalDocuments,
  type LegalDocumentSlug,
} from "@/lib/legal/legal-documents";
import { cn } from "@/lib/utils";

type LegalSidebarProps = {
  locale: string;
  activeSlug: LegalDocumentSlug;
};

export function LegalSidebar({
  locale,
  activeSlug,
}: LegalSidebarProps): React.JSX.Element {
  return (
    <aside className="lg:sticky lg:top-24">
      <div className="rounded-2xl border border-border/50 bg-card p-4">
        <h2 className="px-3 text-sm font-medium text-foreground">
          Documents légaux
        </h2>
        <nav className="mt-4 space-y-1" aria-label="Documents légaux">
          {legalDocumentOrder.map((slug) => {
            const document = legalDocuments[slug];
            const isActive = slug === activeSlug;

            return (
              <Link
                key={slug}
                href={`/${locale}/legal/${slug}`}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "block rounded-xl px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                )}
              >
                {document.shortTitle}
              </Link>
            );
          })}
        </nav>

        <div className="mt-6 rounded-2xl border border-border/50 bg-muted/20 p-4">
          <h3 className="text-sm font-medium text-foreground">
            Une question ?
          </h3>
          <Link
            href="mailto:legal@skygenesisenterprise.com"
            className="mt-2 block text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            legal@skygenesisenterprise.com
          </Link>
          <Link
            href={`/${locale}/company/contact`}
            className="mt-4 inline-flex text-sm font-medium text-foreground transition-colors hover:text-muted-foreground"
          >
            Contacter SGE
          </Link>
        </div>
      </div>
    </aside>
  );
}
