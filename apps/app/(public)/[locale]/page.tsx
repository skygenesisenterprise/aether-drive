import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { HomePage } from "@/components/public/home/home-page";

interface HomePageParams {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: HomePageParams): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Public.home.page.metadata" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function PublicHomePage({ params }: HomePageParams) {
  const { locale } = await params;

  return <HomePage locale={locale} />;
}
