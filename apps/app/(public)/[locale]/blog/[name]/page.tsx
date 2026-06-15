import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ArrowLeft, ArrowRight, CalendarDays, ChevronRight, Clock3 } from "lucide-react";
import { notFound } from "next/navigation";
import { Footer } from "@/components/public/Footer";
import { Header } from "@/components/public/Header";
import { ArticleCard, BlogFinalCta, SectionEyebrow, formatBlogDate } from "@/components/public/blog/editorial";
import {
  getAllEditorialArticles,
  editorialCategories,
  getAdjacentArticles,
  getEditorialArticle,
  getRelatedArticles,
} from "@/lib/blog/data";
import { defaultLocale, isValidLocale, type Locale } from "@/lib/locale";

interface BlogArticlePageProps {
  params: Promise<{ locale?: string; name: string }>;
}

function localizeHref(locale: string, href: string) {
  return `/${locale}${href.startsWith("/") ? href : `/${href}`}`;
}

export function generateStaticParams() {
  return getAllEditorialArticles().map((article) => ({ name: article.slug }));
}

export async function generateMetadata({ params }: BlogArticlePageProps): Promise<Metadata> {
  const { locale: paramLocale, name } = await params;
  const locale: Locale = paramLocale && isValidLocale(paramLocale) ? paramLocale : defaultLocale;
  const article = getEditorialArticle(name);
  const t = await getTranslations({ locale, namespace: "Blog" });

  if (!article) {
    return {
      title: t("article.notFoundTitle"),
    };
  }

  return {
    title: `${article.title} | ${t("metadata.title")}`,
    description: article.excerpt,
  };
}

export default async function BlogArticlePage({ params }: BlogArticlePageProps) {
  const { locale: paramLocale, name } = await params;
  const locale: Locale = paramLocale && isValidLocale(paramLocale) ? paramLocale : defaultLocale;
  const t = await getTranslations({ locale, namespace: "Blog" });
  const article = getEditorialArticle(name);

  if (!article) {
    notFound();
  }

  const category = editorialCategories.find((entry) => entry.slug === article.categorySlug);
  const relatedArticles = getRelatedArticles(article);
  const { previous, next } = getAdjacentArticles(name);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header locale={locale} />

      <main className="flex-1">
        <article>
          <header className="relative overflow-hidden border-b border-border/70">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(57,76,140,0.14),transparent_34%),radial-gradient(circle_at_85%_18%,rgba(57,76,140,0.08),transparent_24%)]" />
            <div className="relative mx-auto max-w-[1400px] px-6 py-16 lg:px-12 lg:py-24">
              <Link
                href={localizeHref(locale, "/blog")}
                className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                {t("article.backToBlog")}
              </Link>

              <div className="mt-8 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <Link href={localizeHref(locale, "/blog")} className="transition-colors hover:text-foreground">
                  {t("article.breadcrumbBlog")}
                </Link>
                <ChevronRight className="h-4 w-4" />
                {category ? (
                  <Link
                    href={localizeHref(locale, `/blog/category/${category.slug}`)}
                    className="transition-colors hover:text-foreground"
                  >
                    {category.label}
                  </Link>
                ) : null}
              </div>

              <div className="mt-8 max-w-4xl">
                <SectionEyebrow>{article.category}</SectionEyebrow>
                <h1 className="mt-6 text-[clamp(2.8rem,4vw,4.8rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-foreground">
                  {article.title}
                </h1>
                <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">{article.excerpt}</p>
                <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{article.author.name}</span>
                  <span>{article.author.role}</span>
                  <span className="inline-flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" />
                    {formatBlogDate(article.publishedAt)}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Clock3 className="h-4 w-4" />
                    {article.readingTime} min
                  </span>
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex rounded-full border border-border/70 bg-background/85 px-3 py-1 text-xs font-medium text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </header>

          <div className="mx-auto grid max-w-[1400px] gap-10 px-6 py-14 lg:grid-cols-[minmax(0,760px)_320px] lg:px-12 lg:py-20">
            <div>
              <div className="rounded-[1.75rem] border border-border/70 bg-card/90 p-6 shadow-sm sm:p-8">
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">{t("article.summary")}</p>
                <ul className="mt-5 space-y-3">
                  {article.summary.map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-7 text-muted-foreground">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/70" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-10 space-y-12">
                {article.sections.map((section) => (
                  <section key={section.id} id={section.id} className="scroll-mt-28">
                    <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">{section.title}</h2>
                    <div className="mt-5 space-y-5 text-[1.05rem] leading-8 text-foreground">
                      {section.paragraphs.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>

                    {section.bullets?.length ? (
                      <ul className="mt-6 space-y-3 rounded-[1.5rem] border border-border/70 bg-muted/[0.25] p-6 text-sm leading-7 text-muted-foreground">
                        {section.bullets.map((item) => (
                          <li key={item} className="flex gap-3">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/70" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}

                    {section.callout ? (
                      <div className="mt-6 rounded-[1.5rem] border border-primary/20 bg-primary/8 p-6 text-sm leading-7 text-foreground">
                        {section.callout}
                      </div>
                    ) : null}

                    {section.codeSample ? (
                      <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-border/70 bg-slate-950 text-slate-100">
                        <div className="flex items-center justify-between border-b border-white/10 px-5 py-3 text-xs uppercase tracking-[0.18em] text-slate-400">
                          <span>{section.codeSample.filename}</span>
                          <span>{section.codeSample.language}</span>
                        </div>
                        <pre className="overflow-x-auto p-5 text-sm leading-7">
                          <code>{section.codeSample.content}</code>
                        </pre>
                      </div>
                    ) : null}
                  </section>
                ))}
              </div>
            </div>

            <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
              <section className="rounded-[1.75rem] border border-border/70 bg-card/90 p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-foreground">{t("article.toc")}</h2>
                <nav className="mt-5 space-y-3">
                  {article.sections.map((section, index) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className="flex items-start gap-3 rounded-2xl border border-transparent px-3 py-2 text-sm text-muted-foreground transition hover:border-border/60 hover:bg-background/80 hover:text-foreground"
                    >
                      <span className="mt-0.5 text-xs font-medium text-primary">{String(index + 1).padStart(2, "0")}</span>
                      <span>{section.title}</span>
                    </a>
                  ))}
                </nav>
              </section>

              <section className="rounded-[1.75rem] border border-border/70 bg-card/90 p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-foreground">{t("article.articleInfo")}</h2>
                <dl className="mt-5 space-y-4 text-sm">
                  <div>
                    <dt className="text-muted-foreground">{t("article.infoAuthor")}</dt>
                    <dd className="mt-1 font-medium text-foreground">{article.author.name}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">{t("article.infoCategory")}</dt>
                    <dd className="mt-1 font-medium text-foreground">{article.category}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">{t("article.infoReadingTime")}</dt>
                    <dd className="mt-1 font-medium text-foreground">{article.readingTime} min</dd>
                  </div>
                </dl>
              </section>
            </aside>
          </div>
        </article>

        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
            <div className="grid gap-6 lg:grid-cols-3">
              {relatedArticles.map((relatedArticle) => (
                <ArticleCard key={relatedArticle.slug} article={relatedArticle} locale={locale} />
              ))}
            </div>
          </div>
        </section>

        <section className="pb-20 sm:pb-24">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
            <div className="grid gap-4 sm:grid-cols-2">
              {previous ? (
                <Link
                  href={localizeHref(locale, `/blog/${previous.slug}`)}
                  className="group rounded-[1.75rem] border border-border/70 bg-card/90 p-6 shadow-sm transition hover:-translate-y-1 hover:border-primary/25"
                >
                  <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">{t("article.previous")}</span>
                  <p className="mt-3 text-lg font-semibold text-foreground">{previous.title}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-foreground">
                    <ArrowLeft className="h-4 w-4" />
                    {t("article.read")}
                  </span>
                </Link>
              ) : <div />}

              {next ? (
                <Link
                  href={localizeHref(locale, `/blog/${next.slug}`)}
                  className="group rounded-[1.75rem] border border-border/70 bg-card/90 p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-primary/25 sm:justify-self-end"
                >
                  <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">{t("article.next")}</span>
                  <p className="mt-3 text-lg font-semibold text-foreground">{next.title}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-foreground">
                    {t("article.read")}
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              ) : null}
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
