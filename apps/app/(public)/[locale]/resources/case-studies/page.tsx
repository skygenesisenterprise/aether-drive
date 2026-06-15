import type { Metadata } from "next";
import {
  generateResourceMetadata,
  renderResourcePage,
  type ResourcesPageParams,
} from "../page-helpers";

export async function generateMetadata({ params }: ResourcesPageParams): Promise<Metadata> {
  return generateResourceMetadata(params, "caseStudies");
}

export default async function CaseStudiesPage({ params }: ResourcesPageParams) {
  return renderResourcePage(params, "caseStudies");
}
