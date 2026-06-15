import type { Metadata } from "next";
import {
  generateResourceMetadata,
  renderResourcePage,
  type ResourcesPageParams,
} from "../page-helpers";

export async function generateMetadata({ params }: ResourcesPageParams): Promise<Metadata> {
  return generateResourceMetadata(params, "webinars");
}

export default async function WebinarsPage({ params }: ResourcesPageParams) {
  return renderResourcePage(params, "webinars");
}
