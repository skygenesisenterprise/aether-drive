import { LegalDocumentPage } from "@/components/legal/LegalDocumentPage";
import { getLegalDocument } from "@/lib/legal/legal-documents";

export default async function GdprPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <LegalDocumentPage locale={locale} document={getLegalDocument("gdpr")} />
  );
}
