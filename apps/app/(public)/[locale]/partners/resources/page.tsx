import type { Metadata } from "next";
import {
  generatePartnersMetadata,
  type PartnersPageParams,
  renderPartnersPage,
} from "../page-helpers";

export async function generateMetadata({ params }: PartnersPageParams): Promise<Metadata> {
  return generatePartnersMetadata(params, "resources");
}

export default async function PartnersResourcesPage({ params }: PartnersPageParams) {
  return renderPartnersPage(params, "resources");
}
