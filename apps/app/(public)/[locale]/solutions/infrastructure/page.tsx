import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { SolutionPage } from "@/components/public/solutions/solution-pages";
import { getSolution } from "@/lib/solutions/solution-content";

interface SolutionPageParams {
  params: Promise<{ locale: string }>;
}

const solution = getSolution("infrastructure");

export async function generateMetadata({ params }: SolutionPageParams): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Public.home.page.solutions.services" });
  const tMeta = await getTranslations({ locale, namespace: "Public.home.solutionPage.metadata" });

  return {
    title: tMeta("detailTitle", { solution: t("infrastructure.title") }),
    description: t("infrastructure.description"),
  };
}

export default async function InfrastructureSolutionsPage({ params }: SolutionPageParams) {
  const { locale } = await params;

  return <SolutionPage locale={locale} solution={solution} />;
}
