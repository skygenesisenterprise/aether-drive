import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ConstitutionPage } from "@/components/public/constitution/constitution-page";

interface ConstitutionRouteParams {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: ConstitutionRouteParams): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Public.constitution.page.metadata" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function PublicConstitutionPage({ params }: ConstitutionRouteParams) {
  const { locale } = await params;

  return <ConstitutionPage locale={locale} />;
}
