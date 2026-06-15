import type { Metadata } from "next";
import {
  generateSecurityHomeMetadata,
  type SecurityPageParams,
  renderSecurityHomePage,
} from "./page-helpers";

export async function generateMetadata({ params }: SecurityPageParams): Promise<Metadata> {
  return generateSecurityHomeMetadata(params);
}

export default async function SecurityPage({ params }: SecurityPageParams) {
  return renderSecurityHomePage(params);
}
