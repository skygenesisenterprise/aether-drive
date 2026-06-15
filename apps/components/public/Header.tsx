/**
 * Sky Genesis Enterprise
 *
 * Scope: Official Website
 * Component: Header
 * Layer: Public UI
 * Purpose: Provides global navigation, legal links, resources and trust entry points.
 *
 * Stability: Active
 * Owner: SGE Web Platform
 * Contact: contact@skygenesisenterprise.com
 */
"use client";

import * as React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { type Locale } from "@/lib/locale";
import {
  Menu,
  X,
  ArrowRight,
  Users,
  Key,
  Layers,
  Code,
  BookOpen,
  FileText,
  Zap,
  Building2,
  Smartphone,
  Globe,
  Server,
  Database,
  Settings,
  LifeBuoy,
  Network,
  DatabaseSearch,
  Briefcase,
  Landmark,
  ShoppingCart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { HeaderAuthButton } from "./HeaderAuthButton";

interface HeaderProps {
  locale?: Locale;
}

interface MenuItem {
  titleKey: string;
  descKey?: string;
  href: string;
  icon: React.ReactNode;
}

interface MenuSection {
  titleKey: string;
  items: MenuItem[];
}

interface MegaMenuData {
  sections: MenuSection[];
  featured?: {
    titleKey: string;
    descKey: string;
    href: string;
    badgeKey?: string;
  };
}

type MegaMenuProps = {
  label: string;
  data: MegaMenuData;
  getLocaleHref: (href: string) => string;
  t: (key: string) => string;
  compact?: boolean;
  panelInsetClass?: string;
  descCompact?: boolean;
};

interface TopLevelLink {
  label: string;
  href: string;
  description?: string;
}

function MegaMenu({
  label,
  data,
  getLocaleHref,
  t,
  compact = false,
  panelInsetClass,
  descCompact = false,
}: MegaMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const panelWidth = compact ? "w-[720px]" : "w-[860px]";
  const sectionGrid = "grid-cols-2";
  const panelInset = panelInsetClass ?? (compact ? "pt-3" : "pt-4");
  const panelChrome = compact
    ? "rounded-[1.75rem] shadow-xl"
    : "rounded-[2rem] shadow-2xl";
  const bodyPadding = compact ? "p-5" : "p-6";
  const bodyGap = compact ? "gap-5" : "gap-6";
  const sectionCard = compact
    ? "rounded-[1.25rem] p-3.5"
    : "rounded-[1.5rem] p-4";
  const itemListLayout = "space-y-2";
  const itemPadding = compact ? "p-2.5" : "p-3";
  const iconSize = compact ? "h-9 w-9 rounded-xl" : "h-10 w-10 rounded-2xl";
  const featuredLayout = compact ? "grid grid-cols-[1fr_220px]" : "grid grid-cols-[1fr_260px]";
  const featuredPadding = compact ? "p-5" : "p-6";
  const featuredCard = compact ? "rounded-[1.5rem] p-[1.125rem]" : "rounded-[1.75rem] p-5";
  const featuredShell = compact
    ? "border-l border-border/60 bg-muted/20"
    : "border-l border-border/60 bg-muted/25";
  const hasFeatured = Boolean(data.featured);

  return (
    <li
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onFocusCapture={() => setIsOpen(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setIsOpen(false);
        }
      }}
      onKeyDownCapture={(event) => {
        if (event.key === "Escape") {
          setIsOpen(false);
          if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
          }
        }
      }}
    >
      <button
        type="button"
        className={cn(
          "flex items-center rounded-full font-medium transition-all duration-300",
          compact ? "px-3 py-1.5 text-[13px]" : "px-4 py-2 text-sm",
          isOpen
            ? "bg-background/80 text-foreground shadow-[inset_0_0_0_1px_rgba(148,163,184,0.16)]"
            : "text-foreground/70 hover:bg-background/70 hover:text-foreground",
        )}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {label}
      </button>
      <div
        className={cn(
          "absolute left-1/2 top-full -translate-x-1/2 transition-all duration-200 ease-out",
          panelInset,
          isOpen
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-1 opacity-0 pointer-events-none",
        )}
      >
        <div
          className={cn(
            panelWidth,
            panelChrome,
            "overflow-hidden border border-border/60 bg-background/92 backdrop-blur-xl",
          )}
        >
          <div className="h-px bg-linear-to-r from-transparent via-primary/35 to-transparent" />
          <div className={hasFeatured ? featuredLayout : "grid"}>
            <div className={cn("relative", bodyPadding)}>
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(57,76,140,0.08),transparent_28%)]" />
              <div className={cn("grid", sectionGrid, bodyGap)}>
                {data.sections.map((section) => (
                  <div
                    key={section.titleKey}
                    className={cn(
                      "relative border border-border/50 bg-background/55",
                      sectionCard,
                    )}
                  >
                    <h3 className="mb-4 text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                      {t(section.titleKey)}
                    </h3>
                    <ul className={itemListLayout}>
                      {section.items.map((item) => (
                        <li key={item.titleKey}>
                          <Link
                            href={getLocaleHref(item.href)}
                            className={cn(
                              "group/item flex items-start gap-3 rounded-3xl border border-transparent transition-all duration-200 hover:border-border/60 hover:bg-muted/60 focus:bg-muted/60 focus:outline-none",
                              itemPadding,
                            )}
                          >
                            <span
                              className={cn(
                                "mt-0.5 inline-flex shrink-0 items-center justify-center border border-border/70 bg-card text-muted-foreground transition-colors group-hover/item:border-primary/20 group-hover/item:text-primary",
                                iconSize,
                              )}
                            >
                              {item.icon}
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block text-sm font-medium text-foreground transition-colors group-hover/item:text-foreground">
                                {t(item.titleKey)}
                              </span>
                              {item.descKey ? (
                                <span className={cn("block text-xs text-muted-foreground", descCompact ? "mt-0.5 leading-tight" : "mt-1 leading-relaxed")}>
                                  {t(item.descKey)}
                                </span>
                              ) : null}
                            </span>
                            <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-all duration-200 group-hover/item:translate-x-0.5 group-hover/item:opacity-100" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {data.featured ? (
              <aside className={cn("relative", featuredShell, featuredPadding)}>
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(57,76,140,0.12),transparent_45%)]" />
                <Link
                  href={getLocaleHref(data.featured.href)}
                  className={cn(
                    "group/featured relative flex h-full flex-col justify-between overflow-hidden border border-border/60 bg-card/95 ring-1 ring-border/40 transition-all hover:-translate-y-0.5 hover:bg-background focus:outline-none focus:ring-2 focus:ring-ring/30",
                    featuredCard,
                  )}
                >
                  <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/35 to-transparent" />
                  <span>
                    {data.featured.badgeKey ? (
                      <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        {t(data.featured.badgeKey)}
                      </span>
                    ) : null}
                    <span className="mt-6 block text-base font-semibold tracking-tight text-foreground">
                      {t(data.featured.titleKey)}
                    </span>
                    <span className={cn("block text-sm text-muted-foreground", descCompact ? "mt-1.5 leading-tight" : "mt-3 leading-7")}>
                      {t(data.featured.descKey)}
                    </span>
                  </span>
                  <span className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-foreground">
                    {t("learnMore")}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/featured:translate-x-0.5" />
                  </span>
                </Link>
              </aside>
            ) : null}
          </div>
        </div>
      </div>
    </li>
  );
}

function getPlatformMenuData(): MegaMenuData {
  return {
    sections: [
      {
        titleKey: "platformCoreSection",
        items: [
          {
            titleKey: "developerPlatform",
            descKey: "developerPlatformDesc",
            href: "/platform/developer",
            icon: <Code className="h-5 w-5" />,
          },
          {
            titleKey: "cloudPlatform",
            descKey: "cloudPlatformDesc",
            href: "/platform/cloud",
            icon: <Building2 className="h-5 w-5" />,
          },
          {
            titleKey: "telecomPlatform",
            descKey: "telecomPlatformDesc",
            href: "/platform/telecom",
            icon: <Network className="h-5 w-5" />,
          },
        ],
      },
      {
        titleKey: "platformBusinessSection",
        items: [
          {
            titleKey: "financePlatform",
            descKey: "financePlatformDesc",
            href: "/platform/finance",
            icon: <Landmark className="h-5 w-5" />,
          },
          {
            titleKey: "intelligencePlatform",
            descKey: "intelligencePlatformDesc",
            href: "/platform/intelligence",
            icon: <DatabaseSearch className="h-5 w-5" />,
          },
          {
            titleKey: "mediaPlatform",
            descKey: "mediaPlatformDesc",
            href: "/platform/media",
            icon: <Globe className="h-5 w-5" />,
          },
        ],
      },
    ],
    featured: {
      badgeKey: "platformFeaturedBadge",
      titleKey: "platformFeaturedTitle",
      descKey: "platformFeaturedDesc",
      href: "/platform",
    },
  };
}

function getDevelopersMenuData(): MegaMenuData {
  return {
    sections: [
      {
        titleKey: "resources",
        items: [
          {
            titleKey: "documentation",
            descKey: "documentationDesc",
            href: "/developers",
            icon: <BookOpen className="h-5 w-5" />,
          },
          {
            titleKey: "quickstarts",
            descKey: "quickstartsDesc",
            href: "/developers/quickstarts",
            icon: <Zap className="h-5 w-5" />,
          },
          {
            titleKey: "apiReference",
            descKey: "apiReferenceDesc",
            href: "/developers/api",
            icon: <Code className="h-5 w-5" />,
          },
          {
            titleKey: "sdksLibraries",
            descKey: "sdksLibrariesDesc",
            href: "/developers/sdks",
            icon: <Layers className="h-5 w-5" />,
          },
        ],
      },
      {
        titleKey: "tools",
        items: [
          {
            titleKey: "cli",
            descKey: "cliDesc",
            href: "/developers/cli",
            icon: <FileText className="h-5 w-5" />,
          },
          {
            titleKey: "postman",
            descKey: "postmanDesc",
            href: "/developers/postman",
            icon: <Database className="h-5 w-5" />,
          },
          {
            titleKey: "extensions",
            descKey: "extensionsDesc",
            href: "/developers/extensions",
            icon: <Settings className="h-5 w-5" />,
          },
        ],
      },
    ],
    featured: {
      badgeKey: "developersFeaturedBadge",
      titleKey: "developersFeaturedTitle",
      descKey: "developersFeaturedDesc",
      href: "/developers",
    },
  };
}

function getSolutionsMenuData(): MegaMenuData {
  return {
    sections: [
      {
        titleKey: "useCases",
        items: [
          {
            titleKey: "b2cIdentity",
            descKey: "b2cIdentityDesc",
            href: "/solutions/b2c",
            icon: <Smartphone className="h-5 w-5" />,
          },
          {
            titleKey: "b2bSaas",
            descKey: "b2bSaasDesc",
            href: "/solutions/b2b",
            icon: <Building2 className="h-5 w-5" />,
          },
          {
            titleKey: "machineToMachine",
            descKey: "machineToMachineDesc",
            href: "/solutions/infrastructure",
            icon: <Server className="h-5 w-5" />,
          },
          {
            titleKey: "passwordless",
            descKey: "passwordlessDesc",
            href: "/solutions/workplace",
            icon: <Briefcase className="h-5 w-5" />,
          },
        ],
      },
      {
        titleKey: "byIndustry",
        items: [
          {
            titleKey: "financialServices",
            descKey: "financialServicesDesc",
            href: "/solutions/financial",
            icon: <Landmark className="h-5 w-5" />,
          },
          {
            titleKey: "healthcare",
            descKey: "healthcareDesc",
            href: "/solutions/healthcare",
            icon: <LifeBuoy className="h-5 w-5" />,
          },
          {
            titleKey: "retailEcommerce",
            descKey: "retailEcommerceDesc",
            href: "/solutions/retail",
            icon: <ShoppingCart className="h-5 w-5" />,
          },
          {
            titleKey: "publicSector",
            descKey: "publicSectorDesc",
            href: "/solutions/government",
            icon: <Building2 className="h-5 w-5" />,
          },
        ],
      },
    ],
    featured: {
      badgeKey: "solutionsFeaturedBadge",
      titleKey: "solutionsFeaturedTitle",
      descKey: "solutionsFeaturedDesc",
      href: "/solutions",
    },
  };
}

function getEnterpriseMenuData(): MegaMenuData {
  return {
    sections: [
      {
        titleKey: "companyOverviewSection",
        items: [
          {
            titleKey: "companyOverview",
            descKey: "companyOverviewDesc",
            href: "/company",
            icon: <Building2 className="h-5 w-5" />,
          },
          {
            titleKey: "about",
            descKey: "aboutDesc",
            href: "/company/about",
            icon: <Globe className="h-5 w-5" />,
          },
          {
            titleKey: "story",
            descKey: "storyDesc",
            href: "/company/story",
            icon: <BookOpen className="h-5 w-5" />,
          },
          {
            titleKey: "values",
            descKey: "valuesDesc",
            href: "/company/values",
            icon: <Key className="h-5 w-5" />,
          },
        ],
      },
      {
        titleKey: "companyConnectSection",
        items: [
          {
            titleKey: "leadership",
            descKey: "leadershipDesc",
            href: "/company/leadership",
            icon: <Briefcase className="h-5 w-5" />,
          },
          {
            titleKey: "careers",
            descKey: "careersDesc",
            href: "/company/careers",
            icon: <Users className="h-5 w-5" />,
          },
          {
            titleKey: "contact",
            descKey: "contactDesc",
            href: "/company/contact",
            icon: <LifeBuoy className="h-5 w-5" />,
          },
          {
            titleKey: "press",
            descKey: "pressDesc",
            href: "/company/press",
            icon: <FileText className="h-5 w-5" />,
          },
        ],
      },
    ],
    featured: {
      badgeKey: "enterpriseFeaturedBadge",
      titleKey: "enterpriseFeaturedTitle",
      descKey: "enterpriseFeaturedDesc",
      href: "/company",
    },
  };
}

function getPartnersMenuData(): MegaMenuData {
  return {
    sections: [
      {
        titleKey: "partnersSolution",
        items: [
          {
            titleKey: "technologyPartners",
            descKey: "technologyPartnersDesc",
            href: "/partners/technology",
            icon: <Code className="h-5 w-5" />,
          },
          {
            titleKey: "servicePartners",
            descKey: "servicePartnersDesc",
            href: "/partners/service",
            icon: <Users className="h-5 w-5" />,
          },
          {
            titleKey: "distributionPartners",
            descKey: "distributionPartnersDesc",
            href: "/partners/distribution",
            icon: <Building2 className="h-5 w-5" />,
          },
        ],
      },
      {
        titleKey: "partnerProgram",
        items: [
          {
            titleKey: "program",
            descKey: "programDesc",
            href: "/partners/program",
            icon: <FileText className="h-5 w-5" />,
          },
          {
            titleKey: "becomePartner",
            descKey: "becomePartnerDesc",
            href: "/partners/become",
            icon: <Zap className="h-5 w-5" />,
          },
          {
            titleKey: "partnerResources",
            descKey: "partnerResourcesDesc",
            href: "/partners/resources",
            icon: <BookOpen className="h-5 w-5" />,
          },
        ],
      },
    ],
    featured: {
      badgeKey: "partnersFeaturedBadge",
      titleKey: "partnersFeaturedTitle",
      descKey: "partnersFeaturedDesc",
      href: "/partners/program",
    },
  };
}

export function Header({ locale: initialLocale }: HeaderProps) {
  const locale = initialLocale || "fr";
  const t = useTranslations("Header");
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  React.useEffect(() => {
    const originalOverflow = document.body.style.overflow;

    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = originalOverflow;
    }

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isMobileMenuOpen]);

  const platformMenuData = getPlatformMenuData();
  const developersMenuData = getDevelopersMenuData();
  const solutionsMenuData = getSolutionsMenuData();
  const enterpriseMenuData = getEnterpriseMenuData();
  const partnersMenuData = getPartnersMenuData();
  const sharedCompanyDevelopersInset = isScrolled ? "pt-3" : "pt-4";

  const getLocaleHref = (href: string) => {
    if (href === "/") return `/${locale}`;
    return `/${locale}${href}`;
  };

  const topLevelLinks: TopLevelLink[] = [
    {
      label: t("plateforme"),
      href: getLocaleHref("/office"),
    },
    {
      label: t("product"),
      href: getLocaleHref("/platform"),
      description: t("platformFeaturedDesc"),
    },
    {
      label: t("solutions"),
      href: getLocaleHref("/solutions"),
      description: t("solutionsFeaturedDesc"),
    },
    {
      label: t("developers"),
      href: getLocaleHref("/developers"),
      description: t("developersFeaturedDesc"),
    },
    {
      label: t("partners"),
      href: getLocaleHref("/partners/program"),
      description: t("partnersFeaturedDesc"),
    },
    {
      label: t("enterprise"),
      href: getLocaleHref("/company"),
      description: t("enterpriseFeaturedDesc"),
    },
    {
      label: t("blog"),
      href: getLocaleHref("/blog"),
    },
  ];

  return (
    <>
      <header
        className={cn(
          "fixed z-50 transition-all duration-500",
          isScrolled || isMobileMenuOpen ? "left-4 right-4 top-15" : "left-0 right-0 top-11",
        )}
      >
        <nav
          className={cn(
            "mx-auto transition-all duration-500",
            isScrolled || isMobileMenuOpen
              ? "max-w-330 rounded-[1.75rem] border border-border/60 bg-background/82 shadow-2xl backdrop-blur-xl"
              : "max-w-350 bg-transparent",
          )}
        >
          <div
            className={cn(
              "flex items-center justify-between gap-6 px-6 transition-all duration-500 lg:px-8",
              isScrolled ? "h-16" : "h-20",
            )}
          >
            <Link href={getLocaleHref("/")} className="group flex items-center" onClick={() => setIsMobileMenuOpen(false)}>
              <span
                className={cn(
                  "whitespace-nowrap font-semibold tracking-tight text-foreground transition-all duration-500",
                  isScrolled ? "text-base" : "text-lg",
                )}
              >
                {t("brandName")}
              </span>
            </Link>

            <nav className="hidden min-w-0 flex-1 justify-center xl:flex">
              <ul className={cn("flex items-center", isScrolled ? "gap-0.5" : "gap-1")}>
              <li>
                <Link
                  href={getLocaleHref("/office")}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full font-medium text-foreground/70 transition-all duration-300 hover:bg-background/70 hover:text-foreground",
                    isScrolled ? "px-3 py-1.5 text-[13px]" : "px-4 py-2 text-sm",
                  )}
                >
                  {t("plateforme")}
                </Link>
              </li>
              <MegaMenu
                label={t("product")}
                data={platformMenuData}
                getLocaleHref={getLocaleHref}
                t={t}
                compact={isScrolled}
              />
              <MegaMenu
                label={t("solutions")}
                data={solutionsMenuData}
                getLocaleHref={getLocaleHref}
                t={t}
                compact={isScrolled}
              />
              <MegaMenu
                label={t("developers")}
                data={developersMenuData}
                getLocaleHref={getLocaleHref}
                t={t}
                compact={isScrolled}
                panelInsetClass={sharedCompanyDevelopersInset}
              />
              <MegaMenu
                label={t("partners")}
                data={partnersMenuData}
                getLocaleHref={getLocaleHref}
                t={t}
                compact={isScrolled}
              />
              <MegaMenu
                label={t("enterprise")}
                data={enterpriseMenuData}
                getLocaleHref={getLocaleHref}
                t={t}
                compact={isScrolled}
                panelInsetClass={sharedCompanyDevelopersInset}
                descCompact
              />

              <li>
                <Link
                  href={getLocaleHref("/blog")}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full font-medium text-foreground/70 transition-all duration-300 hover:bg-background/70 hover:text-foreground",
                    isScrolled ? "px-3 py-1.5 text-[13px]" : "px-4 py-2 text-sm",
                  )}
                >
                  {t("blog")}
                </Link>
              </li>
              </ul>
            </nav>

            <div className="hidden shrink-0 items-center gap-3 xl:flex">
              <HeaderAuthButton
                loginText={t("login")}
                accountText={t("account")}
                signUpText={t("signUp")}
                signUpHref={getLocaleHref("/under-attack-online")}
                compact={isScrolled}
              />
            </div>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((current) => !current)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border/60 bg-background/80 text-foreground transition hover:bg-muted/60 xl:hidden"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </header>

      <div
        className={cn(
          "fixed inset-0 z-40 bg-background transition-all duration-500 xl:hidden",
          isMobileMenuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <div className="mx-auto flex h-full max-w-350 flex-col px-8 pb-8 pt-28">
          <div className="flex-1 space-y-3">
            {topLevelLinks.map((link, index) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "block rounded-[1.75rem] border border-border/60 px-6 py-5 transition-all duration-500",
                  isMobileMenuOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
                )}
                style={{ transitionDelay: isMobileMenuOpen ? `${index * 60}ms` : "0ms" }}
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                    {link.label}
                  </span>
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </div>
                {link.description ? (
                  <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">{link.description}</p>
                ) : null}
              </Link>
            ))}
          </div>

          <div
            className={cn(
              "mt-8 grid gap-4 border-t border-border/60 pt-8 transition-all duration-500 sm:grid-cols-2",
              isMobileMenuOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
            )}
            style={{ transitionDelay: isMobileMenuOpen ? "320ms" : "0ms" }}
          >
            <Button asChild variant="outline" className="h-14 rounded-full text-base">
              <Link href="https://sso.skygenesisenterprise.com/login" onClick={() => setIsMobileMenuOpen(false)}>
                {t("login")}
              </Link>
            </Button>
            <Button asChild className="h-14 rounded-full text-base">
              <Link href={getLocaleHref("/under-attack-online")} onClick={() => setIsMobileMenuOpen(false)}>
                {t("signUp")}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
