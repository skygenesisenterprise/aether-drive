import * as React from "react";
import { Footer } from "@/components/public/Footer";
import { Header } from "@/components/public/Header";
import type { Locale } from "@/lib/locale";

interface CompanyPageShellProps {
  locale: string;
  children: React.ReactNode;
}

export function CompanyPageShell({ locale, children }: CompanyPageShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header locale={locale as Locale} />
      <main className="flex-1">{children}</main>
      <Footer locale={locale as Locale} />
    </div>
  );
}
