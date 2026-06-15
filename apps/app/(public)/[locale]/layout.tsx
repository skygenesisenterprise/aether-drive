import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { LocaleProvider } from "@/context/locale-context";
import { Locale } from "@/lib/locale";
import { BackToTopButton } from "@/components/common/back-to-top-button";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    return null;
  }

  setRequestLocale(locale);
  const messages = await getMessages({ locale });
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <LocaleProvider initialLocale={locale as Locale}>
        <div className="min-h-screen bg-transparent text-foreground">
          <div className="relative isolate flex min-h-screen flex-col">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-[radial-gradient(circle_at_top,rgba(57,76,140,0.12),transparent_62%)]" />
            <div className="relative flex min-h-screen flex-col">
              {children}
            </div>
            <BackToTopButton />
          </div>
        </div>
      </LocaleProvider>
    </NextIntlClientProvider>
  );
}
