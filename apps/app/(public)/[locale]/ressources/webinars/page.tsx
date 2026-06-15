import type { Metadata } from "next";
import {
  generateResourceMetadata,
  renderResourcePage,
  type ResourcesPageParams,
} from "../../resources/page-helpers";

export async function generateMetadata({ params }: ResourcesPageParams): Promise<Metadata> {
  return generateResourceMetadata(params, "webinars");
}

export default async function LegacyWebinarsPage({ params }: ResourcesPageParams) {
  return renderResourcePage(params, "webinars");
}
