import * as React from "react";
import { cn } from "@/lib/utils";
import { CompanyEyebrow } from "./company-eyebrow";

interface CompanySectionProps {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  tone?: "default" | "muted" | "dark";
  muted?: boolean;
  centered?: boolean;
  children?: React.ReactNode;
}

export function CompanySection({
  id,
  eyebrow,
  title,
  description,
  tone = "default",
  muted = false,
  centered = false,
  children,
}: CompanySectionProps) {
  const resolvedTone = muted ? "muted" : tone;
  const dark = resolvedTone === "dark";

  return (
    <section
      id={id}
      className={cn(
        "relative overflow-hidden py-24 sm:py-28 lg:py-32",
        resolvedTone === "muted" && "bg-zinc-50/80",
        dark && "bg-zinc-950 text-white",
      )}
    >
      {dark ? (
        <div
          aria-hidden={true}
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.65) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.65) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />
      ) : null}
      <div className="relative mx-auto max-w-360 px-6 lg:px-12">
        <div className={cn("max-w-4xl", centered && "mx-auto text-center")}>
          {eyebrow ? <CompanyEyebrow inverted={dark}>{eyebrow}</CompanyEyebrow> : null}
          <h2
            className={cn(
              "mt-6 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl lg:text-6xl",
              dark ? "text-white" : "text-zinc-950",
            )}
          >
            {title}
          </h2>
          {description ? (
            <p className={cn("mt-6 text-lg leading-8", dark ? "text-white/68" : "text-zinc-600")}>{description}</p>
          ) : null}
        </div>
        {children ? <div className="mt-14">{children}</div> : null}
      </div>
    </section>
  );
}
