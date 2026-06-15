import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { CompanyAboutPage } from "@/components/public/company/company-pages";

interface CompanyPageParams {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: CompanyPageParams): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Public.company.about.metadata" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function PublicCompanyAboutPage({ params }: CompanyPageParams) {
  const { locale } = await params;

  return <CompanyAboutPage locale={locale} />;
}
