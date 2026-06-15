import type { Metadata } from "next";
import {
  generatePartnersMetadata,
  type PartnersPageParams,
  renderPartnersPage,
} from "../page-helpers";

export async function generateMetadata({ params }: PartnersPageParams): Promise<Metadata> {
  return generatePartnersMetadata(params, "technology");
}

export default async function PartnersTechnologyPage({ params }: PartnersPageParams) {
  return renderPartnersPage(params, "technology");
}
