import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Footer } from "@/components/public/Footer";
import { Header } from "@/components/public/Header";
import { BlogCategoryCard, BlogFinalCta, BlogSection, SectionEyebrow } from "@/components/public/blog/editorial";
import { editorialCategories, getArticlesByCategory } from "@/lib/blog/data";
import { defaultLocale, isValidLocale, type Locale } from "@/lib/locale";

interface BlogCategoriesPageProps {
  params: Promise<{ locale?: string }>;
}

export async function generateMetadata({ params }: BlogCategoriesPageProps): Promise<Metadata> {
  const { locale: paramLocale } = await params;
  const locale: Locale = paramLocale && isValidLocale(paramLocale) ? paramLocale : defaultLocale;
  const t = await getTranslations({ locale, namespace: "Blog" });

  return {
    title: t("categoryIndex.metadataTitle"),
    description: t("categoryIndex.metadataDescription"),
  };
}

export default async function BlogCategoriesPage({ params }: BlogCategoriesPageProps) {
  const { locale: paramLocale } = await params;
  const locale: Locale = paramLocale && isValidLocale(paramLocale) ? paramLocale : defaultLocale;
  const t = await getTranslations({ locale, namespace: "Blog" });

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header locale={locale} />

      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border/70">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(57,76,140,0.14),transparent_34%)]" />
          <div className="relative mx-auto max-w-[1400px] px-6 py-16 lg:px-12 lg:py-24">
            <div className="max-w-4xl">
              <SectionEyebrow>{t("categoryIndex.eyebrow")}</SectionEyebrow>
              <h1 className="mt-6 text-[clamp(2.8rem,4vw,4.6rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-foreground">
                {t("categoryIndex.title")}
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">{t("categoryIndex.description")}</p>
            </div>
          </div>
        </section>

        <BlogSection
          eyebrow={t("categoryIndex.sectionEyebrow")}
          title={t("categoryIndex.sectionTitle")}
          description={t("categoryIndex.sectionDescription")}
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
