import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CompanyEyebrow } from "./company-eyebrow";

interface CompanyHeroAction {
  label: string;
  href: string;
  variant?: "default" | "outline";
}

interface CompanyHeroProps {
  eyebrow: string;
  title: string;
  description: string;
  actions?: CompanyHeroAction[];
  visual?: React.ReactNode;
  centered?: boolean;
}

function WorldMapBackdrop() {
  return (
    <svg viewBox="0 0 1600 620" className="h-full w-full" fill="none" aria-hidden={true}>
      <defs>
        <linearGradient id="company-map-fill" x1="0%" x2="100%" y1="0%" y2="0%">
          <stop offset="0%" stopColor="rgba(24,24,27,0.2)" />
          <stop offset="100%" stopColor="rgba(24,24,27,0.08)" />
        </linearGradient>
        <radialGradient id="company-map-glow" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="rgba(59,130,246,0.12)" />
          <stop offset="100%" stopColor="rgba(59,130,246,0)" />
        </radialGradient>
      </defs>

      <rect width="1600" height="620" fill="url(#company-map-glow)" opacity="0.75" />

      <g opacity="0.9">
        <path
          d="M95 203C140 173 204 154 285 155C335 156 384 165 432 187C452 196 476 193 498 184C549 164 608 155 683 157C727 158 764 170 798 190C816 201 841 202 864 196C914 183 956 187 991 212C1020 233 1048 238 1086 231C1148 220 1212 223 1281 244C1328 258 1370 280 1415 312C1448 335 1487 354 1528 366L1528 432C1483 433 1445 425 1408 409C1361 390 1313 378 1258 376C1199 373 1146 388 1093 413C1060 428 1024 432 988 425C950 418 916 421 880 435C842 450 803 456 748 455C692 454 647 442 605 417C557 388 507 378 448 384C382 391 323 382 267 353C226 331 181 314 128 304L95 302V203Z"
          fill="url(#company-map-fill)"
        />
        <path
          d="M215 236C248 223 280 221 316 227C356 233 384 251 417 273C441 289 469 293 497 288C522 283 548 286 574 298C607 314 640 316 674 309C708 302 740 299 773 307C811 317 847 320 885 309C935 295 979 293 1019 313C1048 328 1080 334 1118 331C1168 327 1214 338 1260 364C1217 351 1176 350 1136 360C1098 370 1063 386 1026 402C991 417 955 420 918 412C875 402 838 403 799 416C741 436 686 437 632 411C579 386 529 375 471 382C418 388 368 380 320 354C282 333 249 307 216 277L215 236Z"
          fill="rgba(39,39,42,0.08)"
        />
      </g>

      <g opacity="0.3" stroke="rgba(24,24,27,0.2)" strokeWidth="1.25">
        <path d="M240 284C376 231 517 230 640 271C731 301 821 307 930 274C1061 235 1188 255 1340 337" />
        <path d="M264 348C403 403 516 415 646 390C772 365 885 328 1008 347C1113 363 1221 394 1317 432" />
      </g>

      <g fill="rgba(24,24,27,0.45)">
        {[
          [252, 286],
          [388, 244],
          [612, 285],
          [796, 302],
          [1008, 272],
          [1218, 320],
          [1324, 374],
        ].map(([cx, cy]) => (
          <g key={`${cx}-${cy}`}>
            <circle cx={cx} cy={cy} r="5.5" />
            <circle cx={cx} cy={cy} r="18" fill="rgba(59,130,246,0.08)" />
          </g>
        ))}
      </g>
    </svg>
  );
}

export function CompanyHero({ eyebrow, title, description, actions }: CompanyHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-border/80 bg-linear-to-b from-background to-muted">
      <div aria-hidden={true} className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-44 bg-[radial-gradient(circle_at_top,rgba(148,163,184,0.18),transparent_65%)]" />
        <div className="absolute inset-x-[-10%] top-[16%] h-[56%] opacity-95 sm:top-[18%] lg:inset-x-[-4%] lg:top-[19%] lg:h-[62%]">
          <WorldMapBackdrop />
        </div>
        <div className="absolute inset-0 bg-linear-to-b from-background/76 via-background/34 to-background/82" />
      </div>

      <div className="relative mx-auto flex min-h-[88vh] max-w-360 items-center px-6 py-20 sm:py-24 lg:px-12 lg:py-28">
        <div className="max-w-4xl">
          <CompanyEyebrow>{eyebrow}</CompanyEyebrow>
          <h1 className="mt-7 max-w-5xl text-[clamp(3.4rem,7vw,7rem)] font-semibold leading-[0.92] tracking-[-0.06em] text-foreground">
            {title}
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground sm:text-xl">{description}</p>
          {actions?.length ? (
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              {actions.map((action, index) => (
                <Button
                  key={`${action.href}-${action.label}`}
                  asChild
                  size="lg"
                  variant={action.variant ?? (index === 0 ? "default" : "outline")}
                  className={
                    index === 0
                      ? "h-14 rounded-full bg-foreground px-8 text-sm font-medium text-background hover:bg-foreground/90"
                      : "h-14 rounded-full border-border bg-background/85 px-8 text-sm font-medium text-foreground"
                  }
                >
                  <Link href={action.href}>
                    {action.label}
                    {index === 0 ? <ArrowRight className="h-4 w-4" aria-hidden={true} /> : null}
                  </Link>
                </Button>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
