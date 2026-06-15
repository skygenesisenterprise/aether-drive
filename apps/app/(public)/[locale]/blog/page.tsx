import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ArrowRight, BookOpen, FileText, Layers3, Rss } from "lucide-react";
import { Footer } from "@/components/public/Footer";
import { Header } from "@/components/public/Header";
import {
  ArticleCard,
  BlogCategoryCard,
  BlogCollectionCard,
  BlogFinalCta,
  BlogSection,
  FeaturedArticleCard,
  SectionEyebrow,
} from "@/components/public/blog/editorial";
import {
  editorialCategories,
  editorialCollections,
  getAllEditorialArticles,
  getArticlesByCategory,
  getFeaturedEditorialArticle,
} from "@/lib/blog/data";
import { defaultLocale, isValidLocale, type Locale } from "@/lib/locale";
import { Button } from "@/components/ui/button";

interface BlogPageProps {
  params: Promise<{ locale?: string }>;
}

function localizeHref(locale: string, href: string) {
  return `/${locale}${href.startsWith("/") ? href : `/${href}`}`;
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { locale: paramLocale } = await params;
  const locale: Locale = paramLocale && isValidLocale(paramLocale) ? paramLocale : defaultLocale;
  const t = await getTranslations({ locale, namespace: "Blog" });

  return {
    title: t("metadata.title"),
    description: t("metadata.description"),
  };
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { locale: paramLocale } = await params;
  const locale: Locale = paramLocale && isValidLocale(paramLocale) ? paramLocale : defaultLocale;
  const t = await getTranslations({ locale, namespace: "Blog" });

  const articles = getAllEditorialArticles();
  const featuredArticle = getFeaturedEditorialArticle();
  const latestArticles = articles.filter((article) => article.slug !== featuredArticle.slug).slice(0, 6);
  const spotlightArticles = articles.filter((article) => article.slug !== featuredArticle.slug).slice(0, 3);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header locale={locale} />

      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border/70">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(57,76,140,0.18),transparent_34%),radial-gradient(circle_at_85%_15%,rgba(57,76,140,0.12),transparent_24%)]" />
            <div
              className="absolute inset-0 opacity-35"
              style={{
                backgroundImage:
                  "linear-gradient(to right, color-mix(in oklch, var(--border) 65%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklch, var(--border) 65%, transparent) 1px, transparent 1px)",
                backgroundSize: "72px 72px",
              }}
            />
          </div>
          <div className="relative mx-auto max-w-[1400px] px-6 py-20 lg:px-12 lg:py-28">
            <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
              <div className="max-w-4xl">
                <SectionEyebrow>{t("hero.eyebrow")}</SectionEyebrow>
                <h1 className="mt-6 text-[clamp(3rem,5vw,5.2rem)] font-semibold leading-[0.96] tracking-[-0.04em] text-foreground">
                  {t("hero.title")}
                </h1>
                <p className="mt-6 max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">{t("hero.description")}</p>
                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                  <Button asChild size="lg" className="h-14 rounded-full px-8 text-sm font-medium shadow-lg shadow-primary/10">
                    <Link href={localizeHref(locale, `/blog/${featuredArticle.slug}`)}>
                      {t("hero.primaryCta")}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="h-14 rounded-full px-8 text-sm font-medium">
                    <Link href={localizeHref(locale, "/developers")}>{t("hero.secondaryCta")}</Link>
                  </Button>
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-border/70 bg-card/90 p-6 shadow-sm backdrop-blur">
                <span className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
                  {t("hero.sideBadge")}
                </span>
                <div className="mt-6 space-y-5">
                  <div className="flex items-center justify-between gap-4 border-b border-border/60 pb-4">
                    <span className="text-sm text-muted-foreground">{t("hero.stats.articles")}</span>
                    <span className="text-lg font-semibold text-foreground">{articles.length}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 border-b border-border/60 pb-4">
                    <span className="text-sm text-muted-foreground">{t("hero.stats.categories")}</span>
                    <span className="text-lg font-semibold text-foreground">{editorialCategories.length}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-muted-foreground">{t("hero.stats.collections")}</span>
                    <span className="text-lg font-semibold text-foreground">{editorialCollections.length}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              {[t("hero.signals.0"), t("hero.signals.1"), t("hero.signals.2")].map((signal) => (
                <span
                  key={signal}
                  className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground backdrop-blur"
                >
                  <span className="h-2 w-2 rounded-full bg-primary/80" />
                  {signal}
                </span>
              ))}
            </div>
          </div>
        </section>

        <BlogSection
          eyebrow={t("featured.eyebrow")}
          title={t("featured.title")}
          description={t("featured.description")}
        >
          <FeaturedArticleCard article={featuredArticle} locale={locale} />
        </BlogSection>

        <BlogSection
          eyebrow={t("categories.eyebrow")}
          title={t("categories.title")}
          description={t("categories.description")}
          action={
            <Button asChild variant="outline" className="rounded-full">
              <Link href={localizeHref(locale, "/blog/category")}>{t("categories.action")}</Link>
            </Button>
          }
        >
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {editorialCategories.map((category) => (
              <BlogCategoryCard
                key={category.slug}
                category={category}
                articleCount={getArticlesByCategory(category.slug).length}
                locale={locale}
              />
            ))}
          </div>
        </BlogSection>

        <BlogSection
          eyebrow={t("latest.eyebrow")}
          title={t("latest.title")}
          description={t("latest.description")}
        >
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {latestArticles.map((article) => (
              <ArticleCard key={article.slug} article={article} locale={locale} />
            ))}
          </div>
        </BlogSection>

        <BlogSection
          eyebrow={t("collections.eyebrow")}
          title={t("collections.title")}
          description={t("collections.description")}
        >
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
            <div className="grid gap-6 sm:grid-cols-2">
              {editorialCollections.map((collection) => (
                <BlogCollectionCard
                  key={collection.slug}
                  collection={collection}
                  articleCount={collection.articleSlugs.length}
                />
              ))}
            </div>
            <div className="rounded-[2rem] border border-border/70 bg-card/90 p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-border/70 bg-background text-primary">
                  <BookOpen className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t("spotlight.eyebrow")}</p>
                  <h3 className="text-xl font-semibold text-foreground">{t("spotlight.title")}</h3>
                </div>
              </div>
              <div className="mt-6 space-y-5">
                {spotlightArticles.map((article) => (
                  <Link
                    key={article.slug}
                    href={localizeHref(locale, `/blog/${article.slug}`)}
                    className="group block rounded-[1.5rem] border border-border/60 bg-background/80 p-5 transition hover:border-primary/20"
                  >
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">{article.category}</p>
                    <h4 className="mt-3 text-lg font-semibold text-foreground">{article.title}</h4>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">{article.excerpt}</p>
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-foreground">
                      {t("spotlight.read")}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </BlogSection>

        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
            <div className="grid gap-6 lg:grid-cols-3">
              <Link
                href={localizeHref(locale, "/developers")}
                className="group rounded-[1.75rem] border border-border/70 bg-card/90 p-6 shadow-sm transition hover:-translate-y-1 hover:border-primary/25"
              >
                <Layers3 className="h-5 w-5 text-primary" />
                <h3 className="mt-5 text-xl font-semibold text-foreground">{t("resources.docs.title")}</h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{t("resources.docs.description")}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-foreground">
                  {t("resources.docs.action")}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>

              <Link
                href={localizeHref(locale, "/platform")}
                className="group rounded-[1.75rem] border border-border/70 bg-card/90 p-6 shadow-sm transition hover:-translate-y-1 hover:border-primary/25"
              >
                <FileText className="h-5 w-5 text-primary" />
                <h3 className="mt-5 text-xl font-semibold text-foreground">{t("resources.platform.title")}</h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{t("resources.platform.description")}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-foreground">
                  {t("resources.platform.action")}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>

              <a
                href="https://docs.skygenesisenterprise.com"
                target="_blank"
                rel="noreferrer"
                className="group rounded-[1.75rem] border border-border/70 bg-card/90 p-6 shadow-sm transition hover:-translate-y-1 hover:border-primary/25"
              >
                <Rss className="h-5 w-5 text-primary" />
                <h3 className="mt-5 text-xl font-semibold text-foreground">{t("resources.feed.title")}</h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{t("resources.feed.description")}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-foreground">
                  {t("resources.feed.action")}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </a>
            </div>
          </div>
        </section>

        <BlogFinalCta
          locale={locale}
          title={t("cta.eyebrow")}
          description={t("cta.title")}
          primaryLabel={t("cta.primary")}
          primaryHref="/developers"
          secondaryLabel={t("cta.secondary")}
          secondaryHref="/platform"
        />
      </main>

      <Footer locale={locale} />
    </div>
  );
}
