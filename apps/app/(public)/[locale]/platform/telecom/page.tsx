import type { Metadata } from "next";
import { PlatformPage } from "@/components/public/platform/platform-page";
import { getTranslations } from "next-intl/server";
import { getPlatformConfig } from "@/data/platform";
import type { PlatformPageCopy } from "@/components/public/platform/platform-page";

interface PlatformRouteParams {
  params: Promise<{ locale: string }>;
}

const config = getPlatformConfig("telecom");

export async function generateMetadata({ params }: PlatformRouteParams): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Public.platform.pages.telecom.metadata" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function PublicTelecomPlatformPage({ params }: PlatformRouteParams) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Public.platform.pages" });
  const copy = t.raw("telecom") as PlatformPageCopy;

  return <PlatformPage locale={locale} config={config} copy={copy} />;
}
