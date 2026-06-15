import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { SolutionsHubPage } from "@/components/public/solutions/solution-pages";

interface SolutionsPageParams {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: SolutionsPageParams): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Public.home.solutionPage.metadata" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function SolutionsPage({ params }: SolutionsPageParams) {
  const { locale } = await params;

  return <SolutionsHubPage locale={locale} />;
}
