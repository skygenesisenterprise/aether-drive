import { DocsBreadcrumbs } from "@/components/docs/docs-breadcrumbs";
import { CopyMarkdownButton } from "@/components/docs/copy-markdown-button";
import { DocsHomePage } from "@/components/docs/docs-home-page";
import type { DocsNavPage } from "@/components/docs/docs-nav";
import { DocsPagination } from "@/components/docs/docs-pagination";
import { DocsToc } from "@/components/docs/docs-toc";
import { getMDXComponents } from "@/components/docs/mdx-components";
import { getLLMText, getPageImage, source } from "@/lib/source";
import type { TableOfContents } from "fumadocs-core/toc";
import { createRelativeLink } from "fumadocs-ui/mdx";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface DocsPageProps {
  params: Promise<{
    slug?: string[];
  }>;
}

export default async function Page(props: DocsPageProps) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  const isHomePage = !params.slug || params.slug.length === 0;

  if (!page) {
    notFound();
  }

  if (isHomePage) {
    const pages: DocsNavPage[] = source.getPages().map((navPage) => ({
      title: navPage.data.title,
      description: navPage.data.description,
      url: navPage.url,
      slugs: navPage.slugs,
    }));

    return <DocsHomePage pages={pages} />;
  }

  const MDX = page.data.body;
  const markdown = await getLLMText(page);
  const allPages = source.getPages().map((navPage) => ({
    title: navPage.data.title,
    description: navPage.data.description,
    url: navPage.url,
    slugs: navPage.slugs,
  }));
  const currentIndex = allPages.findIndex((navPage) => navPage.url === page.url);
  const previous = currentIndex > 0 ? allPages[currentIndex - 1] : undefined;
  const next = currentIndex >= 0 ? allPages[currentIndex + 1] : undefined;
  const breadcrumbs = buildBreadcrumbs(page.slugs, page.data.title);
  const toc = "toc" in page.data ? (page.data.toc as TableOfContents) : [];

  return (
    <div className="grid min-w-0 grid-cols-1 xl:grid-cols-[minmax(0,1fr)_282px]">
      <article className="min-w-0 px-4 py-10 sm:px-8 lg:px-8 xl:px-8">
        <div className="mx-auto max-w-[665px]">
          <DocsBreadcrumbs items={breadcrumbs} />
          <div className="mb-8 flex items-start justify-between gap-4 border-b border-[#ededed] pb-8 dark:border-border">
            <div className="min-w-0">
              <h1 className="text-3xl font-semibold text-[#191b1a] sm:text-4xl dark:text-foreground">
                {page.data.title}
              </h1>
              {page.data.description ? (
                <p className="mt-3 text-base leading-7 text-[#5f6662] dark:text-muted-foreground">
                  {page.data.description}
                </p>
              ) : null}
            </div>
            <CopyMarkdownButton markdown={markdown} />
          </div>
          <div className="max-w-none space-y-5 text-base leading-7 text-[#252927] dark:text-foreground [&_a]:font-medium [&_a]:text-[#147342] [&_a]:underline [&_a]:decoration-[#b7d8c5] [&_a]:underline-offset-4 hover:[&_a]:decoration-[#147342] dark:[&_a]:text-foreground dark:[&_a]:decoration-border dark:hover:[&_a]:decoration-foreground [&_blockquote]:border-l-2 [&_blockquote]:border-[#d6d8d1] [&_blockquote]:pl-4 [&_blockquote]:text-[#5f6662] dark:[&_blockquote]:border-border dark:[&_blockquote]:text-muted-foreground [&_code]:rounded [&_code]:border [&_code]:border-[#e5e5df] [&_code]:bg-[#f6f7f4] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-sm dark:[&_code]:border-border dark:[&_code]:bg-muted [&_h2]:mt-10 [&_h2]:scroll-m-20 [&_h2]:border-t [&_h2]:border-[#ededed] [&_h2]:pt-8 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-[#191b1a] dark:[&_h2]:border-border dark:[&_h2]:text-foreground [&_h3]:mt-8 [&_h3]:scroll-m-20 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-[#191b1a] dark:[&_h3]:text-foreground [&_li]:ml-5 [&_ol]:list-decimal [&_p]:text-[#3f4542] dark:[&_p]:text-muted-foreground [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:border [&_pre]:border-[#1d211f] [&_pre]:bg-[#0f1211] [&_pre]:p-4 [&_pre]:text-zinc-100 [&_pre_code]:border-0 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_ul]:list-disc">
            <MDX
              components={getMDXComponents({
                a: createRelativeLink(source, page),
              })}
            />
          </div>
          <DocsPagination previous={previous} next={next} />
        </div>
      </article>
      <aside className="hidden px-8 py-12 xl:block">
        <div className="sticky top-12">
          <DocsToc toc={toc} />
        </div>
      </aside>
    </div>
  );
}

export function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(
  props: DocsPageProps,
): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);

  if (!page) {
    notFound();
  }

  return {
    title: `${page.data.title} | Documentation`,
    description: page.data.description,
    openGraph: {
      images: getPageImage(page).url,
    },
  };
}

function buildBreadcrumbs(slugs: string[], title: string) {
  if (slugs.length === 0) {
    return [];
  }

  return slugs.map((slug, index) => {
    const isLast = index === slugs.length - 1;
    const label = isLast ? title : formatSlug(slug);

    return {
      title: label,
      href: isLast ? undefined : `/docs/${slugs.slice(0, index + 1).join("/")}`,
    };
  });
}

function formatSlug(slug: string) {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
