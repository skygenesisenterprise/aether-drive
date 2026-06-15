import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { Footer } from "@/components/public/Footer";
import { Header } from "@/components/public/Header";
import { ArticleCard, BlogFinalCta, BlogSection, SectionEyebrow } from "@/components/public/blog/editorial";
import { editorialCategories, getArticlesByCategory, getEditorialCategory } from "@/lib/blog/data";
import { defaultLocale, isValidLocale, type Locale } from "@/lib/locale";

interface BlogCategoryPageProps {
  params: Promise<{ locale?: string; name: string }>;
}

function localizeHref(locale: string, href: string) {
  return `/${locale}${href.startsWith("/") ? href : `/${href}`}`;
}

export function generateStaticParams() {
  return editorialCategories.map((category) => ({ name: category.slug }));
}

export async function generateMetadata({ params }: BlogCategoryPageProps): Promise<Metadata> {
  const { locale: paramLocale, name } = await params;
  const locale: Locale = paramLocale && isValidLocale(paramLocale) ? paramLocale : defaultLocale;
  const t = await getTranslations({ locale, namespace: "Blog" });
  const category = getEditorialCategory(name);

  if (!category) {
    return {
      title: t("category.fallbackTitle"),
    };
  }

  return {
    title: `${category.label} | ${t("metadata.title")}`,
    description: category.description,
  };
}

export default async function BlogCategoryPage({ params }: BlogCategoryPageProps) {
  const { locale: paramLocale, name } = await params;
  const locale: Locale = paramLocale && isValidLocale(paramLocale) ? paramLocale : defaultLocale;
  const t = await getTranslations({ locale, namespace: "Blog" });
  const category = getEditorialCategory(name);

  if (!category) {
    notFound();
  }

  const articles = getArticlesByCategory(name);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header locale={locale} />

      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border/70">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(57,76,140,0.14),transparent_34%)]" />
          <div className="relative mx-auto max-w-[1400px] px-6 py-16 lg:px-12 lg:py-24">
            <Link
              href={localizeHref(locale, "/blog")}
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              {t("category.backToBlog")}
            </Link>

            <div className="mt-8 max-w-4xl">
              <SectionEyebrow>{t("category.eyebrow")}</SectionEyebrow>
              <h1 className="mt-6 text-[clamp(2.8rem,4vw,4.6rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-foreground">
                {category.label}
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">{category.description}</p>
            </div>
          </div>
        </section>

        <BlogSection
          eyebrow={t("category.sectionEyebrow")}
          title={t("category.sectionTitle")}
          description={t("category.sectionDescription", { category: category.label, count: articles.length })}
        >
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} locale={locale} />
            ))}
          </div>
        </BlogSection>

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
