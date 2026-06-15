import type { Metadata } from "next";
import {
  generateSecurityResourceMetadata,
  type SecurityPageParams,
  renderSecurityResourcePage,
} from "../page-helpers";

export async function generateMetadata({ params }: SecurityPageParams): Promise<Metadata> {
  return generateSecurityResourceMetadata(params, "privacy");
}

export default async function SecurityPrivacyPage({ params }: SecurityPageParams) {
  return renderSecurityResourcePage(params, "privacy");
}
