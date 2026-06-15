import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { OfficePage } from "@/components/public/office/office-page";

interface OfficePageParams {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: OfficePageParams): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Public.office.page.metadata" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function PublicOfficePage({ params }: OfficePageParams) {
  const { locale } = await params;

  return <OfficePage locale={locale} />;
}
