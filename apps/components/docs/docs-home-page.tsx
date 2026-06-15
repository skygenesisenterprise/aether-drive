import * as React from "react";
import { DocsCardGrid } from "@/components/docs/docs-card-grid";
import type { DocsNavPage } from "@/components/docs/docs-nav";
import { DocsSearch } from "@/components/docs/docs-search";
import { ArrowRight, BookOpen, Box, Code2, CreditCard, GitBranch, KeyRound, Network, Server } from "lucide-react";
import Link from "next/link";

interface DocsHomePageProps {
  pages: DocsNavPage[];
}

const productCards = [
  {
    title: "Aether Platform",
    description: "Shared platform primitives for identity, finance, edge and cloud services.",
    href: "/docs/getting-started",
    icon: Box,
  },
  {
    title: "Aether Identity",
    description: "OAuth2, OpenID Connect, tenants, sessions and application access.",
    href: "/docs/aether-identity/overview",
    icon: KeyRound,
  },
  {
    title: "Aether Bank",
    description: "Ledger foundations, providers, payment operations and audit flows.",
    href: "/docs/aether-bank/overview",
    icon: CreditCard,
  },
  {
    title: "Aether Edge",
    description: "DNS, proxy, traffic routing and edge network operations.",
    href: "/docs/aether-edge/overview",
    icon: Network,
  },
  {
    title: "Aether Cloud",
    description: "Infrastructure, deployment and runtime standards for SGE services.",
    href: "/docs/aether-cloud/overview",
    icon: Server,
  },
  {
    title: "Giteria",
    description: "Source control, delivery workflows and developer collaboration.",
    href: "/docs/giteria/overview",
    icon: GitBranch,
  },
  {
    title: "Developer Platform",
    description: "SDKs, API conventions and integration guidance for builders.",
    href: "/docs/developer-platform/overview",
    icon: Code2,
  },
];

export function DocsHomePage({ pages }: DocsHomePageProps) {
  const featuredPages = pages.filter((page) => page.url !== "/docs").slice(0, 6);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-8 lg:px-12">
      <section className="border-b border-[#ededed] pb-10 dark:border-border">
        <div className="mb-4 inline-flex items-center gap-2 rounded-md border border-[#e5e5df] bg-[#fbfbfa] px-2.5 py-1 text-xs font-medium text-[#5f6662] dark:border-border dark:bg-muted dark:text-muted-foreground">
          <BookOpen className="size-3.5 text-[#238558]" />
          Sky Genesis Enterprise
        </div>
        <h1 className="max-w-3xl text-4xl font-semibold text-[#191b1a] sm:text-5xl dark:text-foreground">
          Sky Genesis Enterprise Documentation
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-[#5f6662] sm:text-lg dark:text-muted-foreground">
          Guides, API references and operating notes for building with the SGE product families.
        </p>
        <div className="mt-8 max-w-xl">
          <DocsSearch className="h-11 sm:w-full" />
        </div>
      </section>

      <section className="py-8">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-[#191b1a] dark:text-foreground">Products</h2>
          <p className="mt-1 text-sm text-[#6d726f] dark:text-muted-foreground">Choose a documentation area to start.</p>
        </div>
        <DocsCardGrid cards={productCards} />
      </section>

      <section className="overflow-hidden rounded-md border border-[#e5e5df] bg-white shadow-xs dark:border-border dark:bg-card">
        <div className="border-b border-[#ededed] bg-[#fbfbfa] px-5 py-4 dark:border-border dark:bg-muted/30">
          <h2 className="text-base font-semibold text-[#191b1a] dark:text-foreground">Getting started</h2>
        </div>
        <div className="divide-y divide-[#ededed] dark:divide-border">
          {featuredPages.map((page) => (
            <Link
              key={page.url}
              href={page.url}
              className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-[#fbfbfa] dark:hover:bg-muted/50"
            >
              <div className="min-w-0">
                <p className="font-medium text-[#252927] dark:text-foreground">{page.title}</p>
                {page.description ? (
                  <p className="mt-1 text-sm text-[#6d726f] dark:text-muted-foreground">{page.description}</p>
                ) : null}
              </div>
              <ArrowRight className="size-4 shrink-0 text-[#8a8f8b]" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
