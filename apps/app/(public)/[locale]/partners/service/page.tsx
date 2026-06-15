import type { Metadata } from "next";
import {
  generatePartnersMetadata,
  type PartnersPageParams,
  renderPartnersPage,
} from "../page-helpers";

export async function generateMetadata({ params }: PartnersPageParams): Promise<Metadata> {
  return generatePartnersMetadata(params, "service");
}

export default async function PartnersServicePage({ params }: PartnersPageParams) {
  return renderPartnersPage(params, "service");
}
