import type { Metadata } from "next";
import { getMessages, getTranslations } from "next-intl/server";
import { ResourcePage } from "@/components/public/resources/resource-page";
import {
  createResourcePage,
  getResourceMetadata,
  type ResourcePageMessages,
  type ResourcePageSlug,
} from "@/lib/resources/resource-pages";

export interface ResourcesPageParams {
  params: Promise<{ locale: string }>;
}

async function getResourceMessages(locale: string): Promise<ResourcePageMessages> {
  const messages = await getMessages({ locale });
  const resourcesPage = (messages as {
    Public?: { home?: { resourcesPage?: ResourcePageMessages } };
  }).Public?.home?.resourcesPage;

  if (!resourcesPage) {
    throw new Error("Missing Public.home.resourcesPage messages");
  }

  return resourcesPage;
}

export async function generateResourceMetadata(
  params: ResourcesPageParams["params"],
  slug: ResourcePageSlug
): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Public.home.resourcesPage.metadata" });
  const messages = await getResourceMessages(locale);
  const metadata = getResourceMetadata(messages, slug);

  return {
    title: t("titleTemplate", { title: metadata.title }),
    description: metadata.description,
  };
}

export async function renderResourcePage(
  params: ResourcesPageParams["params"],
  slug: ResourcePageSlug
) {
  const { locale } = await params;
  const messages = await getResourceMessages(locale);

  return <ResourcePage locale={locale} page={createResourcePage(messages, slug)} />;
}
