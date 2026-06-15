import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { CompanyLeadershipPage } from "@/components/public/company/company-pages";

interface CompanyPageParams {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: CompanyPageParams): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Public.company.leadership.metadata" });

  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      type: "website",
    },
  };
}

export default async function PublicCompanyLeadershipPage({ params }: CompanyPageParams) {
  const { locale } = await params;

  return <CompanyLeadershipPage locale={locale} />;
}
