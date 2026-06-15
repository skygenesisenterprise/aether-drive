import * as React from "react";

interface CompanyLayerDiagramProps {
  layers: Array<{
    label: string;
    title: string;
    description: string;
  }>;
}

export function CompanyLayerDiagram({ layers }: CompanyLayerDiagramProps) {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-zinc-200 bg-white p-5 shadow-[0_32px_100px_-52px_rgba(15,23,42,0.28)]">
      <div
        aria-hidden={true}
        className="absolute inset-x-0 top-0 h-28 bg-[radial-gradient(circle_at_top_left,rgba(148,163,184,0.18),transparent_58%),linear-gradient(180deg,rgba(244,244,245,0.96),rgba(255,255,255,0))]"
      />
      <div className="relative space-y-4">
        {layers.map((layer, index) => (
          <div
            key={layer.label}
            className="rounded-[1.5rem] border border-zinc-200 bg-zinc-50/80 p-5"
            style={{ marginLeft: `${index * 16}px` }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500">{layer.label}</div>
                <div className="mt-2 text-lg font-semibold tracking-[-0.03em] text-zinc-950">{layer.title}</div>
              </div>
              <span className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                SGE
              </span>
            </div>
            <p className="mt-4 max-w-xl text-sm leading-7 text-zinc-600">{layer.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
