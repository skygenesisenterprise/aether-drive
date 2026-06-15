import type { Metadata } from "next";
import {
  generateResourceMetadata,
  renderResourcePage,
  type ResourcesPageParams,
} from "../../resources/page-helpers";

export async function generateMetadata({ params }: ResourcesPageParams): Promise<Metadata> {
  return generateResourceMetadata(params, "whitepapers");
}

export default async function LegacyWhitePapersPage({ params }: ResourcesPageParams) {
  return renderResourcePage(params, "whitepapers");
}
