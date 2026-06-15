import type { Metadata } from "next";
import {
  generateResourceMetadata,
  renderResourcePage,
  type ResourcesPageParams,
} from "../../resources/page-helpers";

export async function generateMetadata({ params }: ResourcesPageParams): Promise<Metadata> {
  return generateResourceMetadata(params, "caseStudies");
}

export default async function LegacyCaseStudiesPage({ params }: ResourcesPageParams) {
  return renderResourcePage(params, "caseStudies");
}
