import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { DeveloperResourcePage, type DeveloperPageContent } from "@/components/public/developers/developer-resource-page";

interface DevelopersRouteParams {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: DevelopersRouteParams): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Public.home.page.developerPage" });
  const title = t("resources.quickstarts.title");

  return {
    title: t("metadata.titleTemplate", { title }),
    description: t("resources.quickstarts.description"),
  };
}

export default async function DevelopersQuickstartsPage({ params }: DevelopersRouteParams) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Public.home.page.developerPage" });
  const page = t.raw("resources.quickstarts") as DeveloperPageContent;

  return <DeveloperResourcePage locale={locale} page={page} />;
}
