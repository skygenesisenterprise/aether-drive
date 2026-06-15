import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { CompanyContactPage } from "@/components/public/company/company-pages";

interface CompanyPageParams {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: CompanyPageParams): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Public.company.contact.metadata" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function PublicCompanyContactPage({ params }: CompanyPageParams) {
  const { locale } = await params;

  return <CompanyContactPage locale={locale} />;
}
