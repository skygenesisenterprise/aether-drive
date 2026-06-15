import type { Metadata } from "next";
import {
  generateSecurityResourceMetadata,
  type SecurityPageParams,
  renderSecurityResourcePage,
} from "../page-helpers";

export async function generateMetadata({ params }: SecurityPageParams): Promise<Metadata> {
  return generateSecurityResourceMetadata(params, "trust");
}

export default async function SecurityTrustPage({ params }: SecurityPageParams) {
  return renderSecurityResourcePage(params, "trust");
}
