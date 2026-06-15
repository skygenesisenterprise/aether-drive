import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PlatformOverviewPage, type PlatformOverviewCopy } from "@/components/public/platform/platform-page";

interface PlatformRouteParams {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PlatformRouteParams): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Public.platform.overview.metadata" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function PublicPlatformPage({ params }: PlatformRouteParams) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Public.platform" });
  const copy = t.raw("overview") as PlatformOverviewCopy;

  return <PlatformOverviewPage locale={locale} copy={copy} />;
}
