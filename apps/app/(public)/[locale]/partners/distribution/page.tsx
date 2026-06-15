import type { Metadata } from "next";
import {
  generatePartnersMetadata,
  type PartnersPageParams,
  renderPartnersPage,
} from "../page-helpers";

export async function generateMetadata({ params }: PartnersPageParams): Promise<Metadata> {
  return generatePartnersMetadata(params, "distribution");
}

export default async function PartnersDistributionPage({ params }: PartnersPageParams) {
  return renderPartnersPage(params, "distribution");
}
