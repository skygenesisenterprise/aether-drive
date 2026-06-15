import * as React from "react";

interface CompanyTimelineProps {
  items: Array<{
    label: string;
    title: string;
    description: string;
  }>;
}

export function CompanyTimeline({ items }: CompanyTimelineProps) {
  return (
    <div className="space-y-5">
      {items.map((item) => (
        <div
          key={item.label}
          className="grid gap-6 rounded-4xl border border-zinc-200/80 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.2)] md:grid-cols-[140px_minmax(0,1fr)]"
        >
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">{item.label}</div>
          <div>
            <h3 className="text-2xl font-semibold tracking-[-0.03em] text-zinc-950">{item.title}</h3>
            <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-600">{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
