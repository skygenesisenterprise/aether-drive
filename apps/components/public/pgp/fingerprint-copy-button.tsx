"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FingerprintCopyButtonProps {
  value: string;
}

export function FingerprintCopyButton({ value }: FingerprintCopyButtonProps) {
  const t = useTranslations("Public.pgp.common");
  const [copied, setCopied] = React.useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <Button type="button" variant="outline" size="sm" className="rounded-full px-4" onClick={handleCopy}>
      {copied ? <Check className="h-4 w-4" aria-hidden={true} /> : <Copy className="h-4 w-4" aria-hidden={true} />}
      {copied ? t("copied") : t("copy")}
    </Button>
  );
}
