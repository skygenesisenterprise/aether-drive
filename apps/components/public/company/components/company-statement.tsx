import * as React from "react";
import { cn } from "@/lib/utils";

interface CompanyStatementProps {
  title: string;
  description?: string;
  align?: "left" | "center";
}

export function CompanyStatement({ title, description, align = "center" }: CompanyStatementProps) {
  return (
    <div className={cn("mx-auto max-w-4xl", align === "center" ? "text-center" : "text-left")}>
      <h3 className="text-3xl font-semibold tracking-[-0.04em] text-zinc-950 sm:text-4xl lg:text-5xl">{title}</h3>
      {description ? (
        <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-zinc-600">{description}</p>
      ) : null}
    </div>
  );
}
