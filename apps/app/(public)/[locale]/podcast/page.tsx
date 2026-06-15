import type { Metadata } from "next";
import { getMessages } from "next-intl/server";
import { PodcastPage, type PodcastPageContent } from "@/components/public/showcase/showcase-pages";

interface PodcastPageParams {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PodcastPageParams): Promise<Metadata> {
  const { locale } = await params;
  const messages = await getMessages({ locale });
  const page = (messages as { Blog?: { podcast?: PodcastPageContent } }).Blog?.podcast;

  if (!page) {
    throw new Error("Missing Blog.podcast messages");
  }

  return {
    title: page.metadata.title,
    description: page.metadata.description,
  };
}

export default async function PublicPodcastPage({ params }: PodcastPageParams) {
  const { locale } = await params;
  const messages = await getMessages({ locale });
  const page = (messages as { Blog?: { podcast?: PodcastPageContent } }).Blog?.podcast;

  if (!page) {
    throw new Error("Missing Blog.podcast messages");
  }

  return <PodcastPage locale={locale} page={page} />;
}
