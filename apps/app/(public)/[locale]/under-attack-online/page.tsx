import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { UnderAttackOnlinePage } from "@/components/public/under-attack-online/under-attack-online";

interface UnderAttackOnlineParams {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: UnderAttackOnlineParams): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Public.underAttackOnline.metadata" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function PublicHomePage({ params }: UnderAttackOnlineParams) {
  const { locale } = await params;

  return <UnderAttackOnlinePage locale={locale} />;
}