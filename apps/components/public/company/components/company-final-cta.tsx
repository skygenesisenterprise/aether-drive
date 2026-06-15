import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CompanyEyebrow } from "./company-eyebrow";

interface CompanyFinalCtaProps {
  eyebrow: string;
  title: string;
  description: string;
  actions: Array<{
    label: string;
    href: string;
    variant?: "default" | "outline";
  }>;
}

export function CompanyFinalCta({ eyebrow, title, description, actions }: CompanyFinalCtaProps) {
  return (
    <section className="py-24 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-360 px-6 lg:px-12">
        <div className="overflow-hidden rounded-[2rem] border border-zinc-200/80 bg-zinc-50/80 p-8 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.24)] sm:p-10 lg:p-12">
          <CompanyEyebrow>{eyebrow}</CompanyEyebrow>
          <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div className="max-w-3xl">
              <h2 className="text-4xl font-semibold tracking-[-0.04em] text-zinc-950 sm:text-5xl">{title}</h2>
              <p className="mt-6 text-lg leading-8 text-zinc-600">{description}</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
              {actions.map((action, index) => (
                <Button
                  key={`${action.href}-${action.label}`}
                  asChild
                  size="lg"
                  variant={action.variant ?? (index === 0 ? "default" : "outline")}
                  className="h-13 rounded-full px-7 text-sm font-medium"
                >
                  <Link href={action.href}>{action.label}</Link>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
