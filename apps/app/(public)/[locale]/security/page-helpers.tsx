import type { Metadata } from "next";
import { getMessages, getTranslations } from "next-intl/server";
import { SecurityResourcePage } from "@/components/public/security/security-resource-page";
import {
  createSecurityOverview,
  createSecurityResource,
  type SecurityPageMessages,
  type SecurityPageSlug,
} from "@/lib/security/security-resources";

export interface SecurityPageParams {
  params: Promise<{ locale: string }>;
}

function createSecurityMetadata(title: string, description: string): Metadata {
  return {
    title,
    description,
  };
}

async function getSecurityMessages(locale: string): Promise<SecurityPageMessages> {
  const messages = await getMessages({ locale });
  const securityPage = (messages as {
    Public?: { home?: { page?: { securityPage?: SecurityPageMessages } } };
  }).Public?.home?.page?.securityPage;

  if (!securityPage) {
    throw new Error("Missing Public.home.page.securityPage messages");
  }

  return securityPage;
}

export async function generateSecurityHomeMetadata(
  params: SecurityPageParams["params"]
): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Public.home.page.securityPage.metadata" });
  const messages = await getSecurityMessages(locale);
  const page = createSecurityOverview(messages);

  return createSecurityMetadata(t("title"), page.description);
}

export async function generateSecurityResourceMetadata(
  params: SecurityPageParams["params"],
  slug: SecurityPageSlug
): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Public.home.page.securityPage.metadata" });
  const messages = await getSecurityMessages(locale);
  const page = createSecurityResource(messages, slug);

  return createSecurityMetadata(t("titleTemplate", { title: page.title }), page.description);
}

export async function renderSecurityHomePage(params: SecurityPageParams["params"]) {
  const { locale } = await params;
  const messages = await getSecurityMessages(locale);

  return <SecurityResourcePage locale={locale} page={createSecurityOverview(messages)} />;
}

export async function renderSecurityResourcePage(
  params: SecurityPageParams["params"],
  slug: SecurityPageSlug
) {
  const { locale } = await params;
  const messages = await getSecurityMessages(locale);

  return <SecurityResourcePage locale={locale} page={createSecurityResource(messages, slug)} />;
}
