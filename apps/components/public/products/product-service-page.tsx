import * as React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Layers3,
  Network,
  ShieldCheck,
} from "lucide-react";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/locale";
import type {
  ProductCta,
  ProductService,
  ProductStatus,
} from "@/lib/products/product-services";

interface ProductServicePageProps {
  locale: string;
  product: ProductService;
}

interface ProductTextCard {
  title: string;
  description: string;
}

interface ProductSectionProps {
  eyebrow: string;
  title: string;
  description?: string;
  muted?: boolean;
  children: React.ReactNode;
}

function localizeHref(locale: string, href: string) {
  if (href.startsWith("http")) {
    return href;
  }

  return `/${locale}${href.startsWith("/") ? href : `/${href}`}`;
}

function ProductSection({
  eyebrow,
  title,
  description,
  muted = false,
  children,
}: ProductSectionProps) {
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

function ProductStatusBadge({ status }: { status: ProductStatus }) {
  const tStatus = useTranslations("Public.home.page.status");
  const toneByStatus: Record<ProductStatus, string> = {
    Available: "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    "Private preview": "border-primary/25 bg-primary/10 text-primary",
    "In development": "border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300",
    Experimental: "border-sky-500/25 bg-sky-500/10 text-sky-700 dark:text-sky-300",
    Planned: "border-border bg-muted text-muted-foreground",
    Research: "border-violet-500/25 bg-violet-500/10 text-violet-700 dark:text-violet-300",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium",
        toneByStatus[status]
      )}
    >
      {tStatus(status)}
    </span>
  );
}

function ProductCTA({
  cta,
  locale,
}: {
  cta: ProductCta;
  locale: string;
}) {
  const isPrimary = cta.variant !== "secondary";

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
      <Link href={localizeHref(locale, cta.href)}>
        {cta.label}
        {isPrimary ? <ArrowRight className="h-4 w-4" /> : null}
      </Link>
    </Button>
  );
}

function ProductHero({ locale, product }: ProductServicePageProps) {
  const t = useTranslations("Public.home.productPage");
  const tProducts = useTranslations("Public.home.page.products.services");
  const ctaLabels = tProducts.raw(`${product.slug}.ctas`) as [string, string];
  const experienceSteps = tProducts.raw(`${product.slug}.experienceSteps`) as ProductTextCard[];

  return (
    <section className="border-b border-border bg-background py-24 sm:py-28 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <div className="max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-primary">
            {t("brand")}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <h1 className="text-5xl font-semibold tracking-tight text-foreground sm:text-6xl">
              {tProducts(`${product.slug}.title`)}
            </h1>
            <ProductStatusBadge status={product.status} />
          </div>
          <p className="mt-6 max-w-2xl text-xl leading-8 text-muted-foreground">
            {tProducts(`${product.slug}.positioning`)}
          </p>
          <p className="mt-5 max-w-3xl text-base leading-7 text-muted-foreground">
            {tProducts(`${product.slug}.description`)}
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            {product.ctas.map((cta, index) => (
              <ProductCTA
                key={cta.href}
                cta={{ ...cta, label: ctaLabels[index] }}
                locale={locale}
              />
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-border bg-muted/50 p-5 sm:p-6">
          <div className="rounded-md border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
                <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
                <span className="h-2.5 w-2.5 rounded-full bg-primary/30" />
              </div>
              <span className="text-xs font-medium text-muted-foreground">
                {t("preview.conceptPreview")}
              </span>
            </div>
            <div className="grid gap-4 p-4 sm:grid-cols-[0.8fr_1.2fr]">
              <div className="space-y-2">
                {experienceSteps.map((step) => (
                  <div
                    key={step.title}
                    className="rounded-md border border-border bg-muted/50 px-3 py-2"
                  >
                    <p className="text-xs font-medium text-foreground">
                      {step.title}
                    </p>
                  </div>
                ))}
              </div>
              <div className="rounded-md border border-border bg-background p-4">
                <div className="mb-4 h-2 w-24 rounded-full bg-primary/20" />
                <div className="space-y-3">
                  <div className="h-3 w-full rounded-full bg-muted/70" />
                  <div className="h-3 w-4/5 rounded-full bg-muted/70" />
                  <div className="h-3 w-2/3 rounded-full bg-muted/70" />
                </div>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="h-20 rounded-md border border-border bg-muted/50" />
                  <div className="h-20 rounded-md border border-border bg-muted/50" />
                </div>
              </div>
            </div>
          </div>
          <p className="mt-4 text-xs leading-5 text-muted-foreground">
            {t("preview.disclaimer")}
          </p>
        </div>
      </div>
    </section>
  );
}

function ProductProblemPromise({ product }: { product: ProductService }) {
  const t = useTranslations("Public.home.productPage");
  const tProducts = useTranslations("Public.home.page.products.services");

  return (
    <ProductSection
      eyebrow={t("problem.eyebrow")}
      title={tProducts(`${product.slug}.problem.title`)}
      description={tProducts(`${product.slug}.problem.current`)}
    >
      <div className="grid gap-5 md:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="text-base font-semibold text-foreground">
            {t("problem.userNeed")}
          </h3>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            {tProducts(`${product.slug}.problem.userNeed`)}
          </p>
        </div>
        <div className="rounded-lg border border-primary/20 bg-primary/10 p-6">
          <h3 className="text-base font-semibold text-foreground">
            {t("problem.productPromise")}
          </h3>
          <p className="mt-3 text-sm leading-7 text-foreground/80">
            {tProducts(`${product.slug}.problem.promise`)}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="text-base font-semibold text-foreground">
            {t("problem.organizationalValue")}
          </h3>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            {tProducts(`${product.slug}.problem.value`)}
          </p>
        </div>
      </div>
    </ProductSection>
  );
}

function ProductExperience({ product }: { product: ProductService }) {
  const t = useTranslations("Public.home.productPage");
  const tProducts = useTranslations("Public.home.page.products.services");
  const experienceSteps = tProducts.raw(`${product.slug}.experienceSteps`) as ProductTextCard[];

  return (
    <ProductSection
      eyebrow={t("experience.eyebrow")}
      title={t("experience.title")}
      description={t("experience.description")}
      muted
    >
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-lg border border-border bg-card p-6">
          <p className="text-sm font-medium text-foreground">
            {t("experience.previewScope")}
          </p>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            {t("experience.previewDescription")}
          </p>
        </div>
        <div className="grid gap-3">
          {experienceSteps.map((step, index) => (
            <div key={step.title} className="flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-primary/20 bg-primary/10 text-sm font-semibold text-primary">
                {index + 1}
              </div>
              <div className="flex-1 rounded-lg border border-border bg-card p-4">
                <h3 className="text-sm font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ProductSection>
  );
}

function ProductWhyNow({ product }: { product: ProductService }) {
  const t = useTranslations("Public.home.productPage");
  const tProducts = useTranslations("Public.home.page.products.services");
  const productTitle = tProducts(`${product.slug}.title`);

  const items = [
    {
      title: t("whyNow.items.clarity.title"),
      description: t("whyNow.items.clarity.description"),
      icon: CheckCircle2,
    },
    {
      title: t("whyNow.items.adoption.title", { product: productTitle }),
      description: t("whyNow.items.adoption.description", { product: productTitle }),
      icon: Building2,
    },
    {
      title: t("whyNow.items.foundation.title"),
      description: t("whyNow.items.foundation.description"),
      icon: ShieldCheck,
    },
  ];

  return (
    <ProductSection
      eyebrow={t("whyNow.eyebrow")}
      title={t("whyNow.title")}
      description={t("whyNow.description")}
      muted
    >
      <div className="grid gap-5 md:grid-cols-3">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <div key={item.title} className="rounded-lg border border-border bg-card p-6">
              <Icon className="mb-5 h-5 w-5 text-primary" aria-hidden="true" />
              <h3 className="text-base font-semibold text-foreground">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.description}</p>
            </div>
          );
        })}
      </div>
    </ProductSection>
  );
}

function ProductFeatures({ product }: { product: ProductService }) {
  const t = useTranslations("Public.home.productPage");
  const tProducts = useTranslations("Public.home.page.products.services");
  const features = tProducts.raw(`${product.slug}.features`) as ProductTextCard[];

  return (
    <ProductSection
      eyebrow={t("features.eyebrow")}
      title={t("features.title")}
      description={t("features.description")}
    >
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {product.features.map((feature, index) => {
          const Icon = feature.icon;
          const featureText = features[index];

          return (
            <div
              key={featureText.title}
              className="rounded-lg border border-border bg-card p-6"
            >
              {Icon ? (
                <Icon className="mb-5 h-5 w-5 text-primary" aria-hidden="true" />
              ) : null}
              <h3 className="text-base font-semibold text-foreground">
                {featureText.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                {featureText.description}
              </p>
            </div>
          );
        })}
      </div>
    </ProductSection>
  );
}

function ProductEcosystemConnections({
  locale,
  product,
}: ProductServicePageProps) {
  const t = useTranslations("Public.home.productPage");
  const tProducts = useTranslations("Public.home.page.products.services");
  const productTitle = tProducts(`${product.slug}.title`);

  const items = [
    {
      title: t("ecosystemConnections.items.products.title"),
      description: t("ecosystemConnections.items.products.description", { product: productTitle }),
      href: localizeHref(locale, "/products"),
      icon: Building2,
    },
    {
      title: t("ecosystemConnections.items.platform.title"),
      description: t("ecosystemConnections.items.platform.description"),
      href: localizeHref(locale, "/platform"),
      icon: Layers3,
    },
    {
      title: t("ecosystemConnections.items.solutions.title"),
      description: t("ecosystemConnections.items.solutions.description"),
      href: localizeHref(locale, "/solutions/workplace"),
      icon: Network,
    },
  ];

  return (
    <ProductSection
      eyebrow={t("ecosystemConnections.eyebrow")}
      title={t("ecosystemConnections.title")}
      description={t("ecosystemConnections.description")}
    >
      <div className="grid gap-5 md:grid-cols-3">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.title}
              href={item.href}
              className="rounded-lg border border-border bg-card p-6 transition-colors hover:border-primary/20"
            >
              <Icon className="mb-5 h-5 w-5 text-primary" aria-hidden="true" />
              <h3 className="text-base font-semibold text-foreground">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.description}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary">
                {t("common.explore")}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </span>
            </Link>
          );
        })}
      </div>
    </ProductSection>
  );
}

function ProductUseCases({ product }: { product: ProductService }) {
  const t = useTranslations("Public.home.productPage");
  const tProducts = useTranslations("Public.home.page.products.services");
  const useCases = tProducts.raw(`${product.slug}.useCases`) as ProductTextCard[];

  return (
    <ProductSection
      eyebrow={t("useCases.eyebrow")}
      title={t("useCases.title")}
      description={t("useCases.description")}
      muted
    >
      <div className="grid gap-5 md:grid-cols-3">
        {useCases.map((useCase) => (
          <div
            key={useCase.title}
            className="rounded-lg border border-border bg-card p-6"
          >
            <h3 className="text-base font-semibold text-foreground">
              {useCase.title}
            </h3>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              {useCase.description}
            </p>
          </div>
        ))}
      </div>
    </ProductSection>
  );
}

function ProductRecommendedNextStep({
  locale,
  product,
}: ProductServicePageProps) {
  const t = useTranslations("Public.home.productPage");
  const tProducts = useTranslations("Public.home.page.products.services");
  const productTitle = tProducts(`${product.slug}.title`);

  const items = [
    {
      title: t("recommendedNextStep.items.explore.title"),
      description: t("recommendedNextStep.items.explore.description", { product: productTitle }),
      href: localizeHref(locale, "/products"),
      label: t("recommendedNextStep.items.explore.label"),
    },
    {
      title: t("recommendedNextStep.items.evaluate.title"),
      description: t("recommendedNextStep.items.evaluate.description"),
      href: localizeHref(locale, "/solutions/workplace"),
      label: t("recommendedNextStep.items.evaluate.label"),
    },
    {
      title: t("recommendedNextStep.items.contact.title"),
      description: t("recommendedNextStep.items.contact.description"),
      href: localizeHref(locale, "/company/contact"),
      label: t("recommendedNextStep.items.contact.label"),
    },
  ];

  return (
    <ProductSection
      eyebrow={t("recommendedNextStep.eyebrow")}
      title={t("recommendedNextStep.title")}
      description={t("recommendedNextStep.description")}
      muted
    >
      <div className="grid gap-5 md:grid-cols-3">
        {items.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className="rounded-lg border border-border bg-card p-6 transition-colors hover:border-primary/20"
          >
            <h3 className="text-base font-semibold text-foreground">{item.title}</h3>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.description}</p>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary">
              {item.label}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </span>
          </Link>
        ))}
      </div>
    </ProductSection>
  );
}

function ProductPlatformIntegration({ product }: { product: ProductService }) {
  const t = useTranslations("Public.home.productPage");
  const tProducts = useTranslations("Public.home.page.products.services");
  const integrations = tProducts.raw(`${product.slug}.integrations`) as string[];

  return (
    <ProductSection
      eyebrow={t("platformIntegration.eyebrow")}
      title={t("platformIntegration.title")}
      description={t("platformIntegration.description")}
    >
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-lg border border-border bg-muted/50 p-6">
          <p className="text-sm font-medium text-foreground">
            {t("platformIntegration.mapTitle")}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="rounded-md border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
              {tProducts(`${product.slug}.title`)}
            </span>
            <span className="h-px w-8 bg-border" />
            <span className="rounded-md border border-border bg-background px-4 py-2 text-sm text-muted-foreground">
              {t("platformIntegration.platformLabel")}
            </span>
          </div>
          <p className="mt-6 text-sm leading-7 text-muted-foreground">
            {t("platformIntegration.mapDescription")}
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {integrations.map((integration) => (
            <div
              key={integration}
              className="flex items-center gap-3 rounded-lg border border-border bg-card p-4"
            >
              <CheckCircle2 className="h-4 w-4 text-primary" aria-hidden="true" />
              <span className="text-sm font-medium text-foreground">
                {integration}
              </span>
            </div>
          ))}
        </div>
      </div>
    </ProductSection>
  );
}

function ProductAvailability({
  locale,
  product,
}: ProductServicePageProps) {
  const t = useTranslations("Public.home.productPage");
  const tStatus = useTranslations("Public.home.page.status");
  const tProducts = useTranslations("Public.home.page.products.services");
  const ctaLabels = tProducts.raw(`${product.slug}.ctas`) as [string, string];
  const labelMap: Record<string, string> = {
    "Current status": t("availability.labels.currentStatus"),
    "Public access": t("availability.labels.publicAccess"),
    "Private preview": t("availability.labels.privatePreview"),
    Documentation: t("availability.labels.documentation"),
    "Workspace integration": t("availability.labels.workspaceIntegration"),
    "API/SDK": t("availability.labels.apiSdk"),
  };
  const valueMap: Record<string, string> = {
    "In progress": t("availability.values.inProgress"),
    "Not open yet": t("availability.values.notOpenYet"),
    Limited: t("availability.values.limited"),
  };

  function localizeAvailabilityValue(value: string) {
    if (value in valueMap) {
      return valueMap[value];
    }

    try {
      return tStatus(value);
    } catch {
      return value;
    }
  }

  return (
    <ProductSection
      eyebrow={t("availability.eyebrow")}
      title={t("availability.title")}
      description={tProducts(`${product.slug}.nextStep`)}
      muted
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_0.7fr]">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {product.availability.map((item) => (
            <div
              key={item.label}
              className="rounded-lg border border-border bg-card p-5"
            >
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                {labelMap[item.label] ?? item.label}
              </p>
              <p className="mt-3 text-sm font-semibold text-foreground">
                {localizeAvailabilityValue(item.value)}
              </p>
            </div>
          ))}
        </div>
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="text-lg font-semibold text-foreground">
            {t("availability.continueWith", { product: tProducts(`${product.slug}.title`) })}
          </h3>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            {t("availability.description")}
          </p>
          <div className="mt-6 flex flex-col gap-3">
            {product.ctas.map((cta, index) => (
              <ProductCTA
                key={cta.href}
                cta={{ ...cta, label: ctaLabels[index] }}
                locale={locale}
              />
            ))}
          </div>
        </div>
      </div>
    </ProductSection>
  );
}

export function ProductServicePage({ locale, product }: ProductServicePageProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header locale={locale as Locale} />
      <main className="flex-1">
        <ProductHero locale={locale} product={product} />
        <ProductProblemPromise product={product} />
        <ProductWhyNow product={product} />
        <ProductExperience product={product} />
        <ProductFeatures product={product} />
        <ProductEcosystemConnections locale={locale} product={product} />
        <ProductUseCases product={product} />
        <ProductPlatformIntegration product={product} />
        <ProductRecommendedNextStep locale={locale} product={product} />
        <ProductAvailability locale={locale} product={product} />
      </main>
      <Footer locale={locale as Locale} />
    </div>
  );
}

export {
  ProductHero,
  ProductProblemPromise,
  ProductWhyNow,
  ProductExperience,
  ProductFeatures,
  ProductEcosystemConnections,
  ProductUseCases,
  ProductPlatformIntegration,
  ProductRecommendedNextStep,
  ProductAvailability,
  ProductStatusBadge,
  ProductCTA,
};
