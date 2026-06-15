import type { Metadata } from "next";
import { getMessages } from "next-intl/server";
import { AcademyPage, type AcademyPageContent } from "@/components/public/showcase/showcase-pages";

interface AcademyPageParams {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: AcademyPageParams): Promise<Metadata> {
  const { locale } = await params;
  const messages = await getMessages({ locale });
  const page = (messages as { Blog?: { academy?: AcademyPageContent } }).Blog?.academy;

  if (!page) {
    throw new Error("Missing Blog.academy messages");
  }

  return {
    title: page.metadata.title,
    description: page.metadata.description,
  };
}

export default async function PublicAcademyPage({ params }: AcademyPageParams) {
  const { locale } = await params;
  const messages = await getMessages({ locale });
  const page = (messages as { Blog?: { academy?: AcademyPageContent } }).Blog?.academy;

  if (!page) {
    throw new Error("Missing Blog.academy messages");
  }

  return <AcademyPage locale={locale} page={page} />;
}
