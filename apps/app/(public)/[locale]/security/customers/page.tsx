import type { Metadata } from "next";
import {
  generateSecurityResourceMetadata,
  type SecurityPageParams,
  renderSecurityResourcePage,
} from "../page-helpers";

export async function generateMetadata({ params }: SecurityPageParams): Promise<Metadata> {
  return generateSecurityResourceMetadata(params, "customers");
}

export default async function CustomerSecurityPage({ params }: SecurityPageParams) {
  return renderSecurityResourcePage(params, "customers");
}
