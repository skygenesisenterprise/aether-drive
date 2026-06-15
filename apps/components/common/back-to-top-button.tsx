"use client";

import * as React from "react";
import { ArrowUp } from "lucide-react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

const VISIBILITY_SCROLL_PX = 600;
const EXTRA_OFFSET_PX = 16;

export function BackToTopButton() {
  const t = useTranslations("Common");
  const [visible, setVisible] = React.useState(false);
  const [bottomOffset, setBottomOffset] = React.useState(EXTRA_OFFSET_PX);

  React.useEffect(() => {
    let frameId = 0;

    const updateState = () => {
      frameId = 0;

      const viewportThreshold = window.innerHeight * 0.7;
      const shouldShow = window.scrollY > Math.max(VISIBILITY_SCROLL_PX, viewportThreshold);
      setVisible(shouldShow);

      const consentBanner = document.querySelector<HTMLElement>('[data-consent-banner="true"]');
      const nextOffset =
        consentBanner && consentBanner.offsetParent !== null
          ? consentBanner.getBoundingClientRect().height + EXTRA_OFFSET_PX
          : EXTRA_OFFSET_PX;

      setBottomOffset((current) => (current === nextOffset ? current : nextOffset));
    };

    const scheduleUpdate = () => {
      if (frameId !== 0) {
        return;
      }

      frameId = window.requestAnimationFrame(updateState);
    };

    const observer = new MutationObserver(scheduleUpdate);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });

    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate, { passive: true });
    scheduleUpdate();

    return () => {
      if (frameId !== 0) {
        window.cancelAnimationFrame(frameId);
      }

      observer.disconnect();
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, []);

  const handleClick = React.useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <button
      type="button"
      aria-label={t("backToTop.ariaLabel")}
      onClick={handleClick}
      className={cn(
        "fixed right-4 z-40 inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/92 px-3 py-2 text-sm font-medium text-foreground shadow-sm backdrop-blur transition-all duration-200 hover:bg-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20 sm:right-6 sm:px-4",
        "supports-backdrop-filter:bg-background/86",
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0",
      )}
      style={{ bottom: `${bottomOffset}px` }}
    >
      <ArrowUp className="h-4 w-4 shrink-0" aria-hidden="true" />
      <span className="hidden sm:inline">{t("backToTop.label")}</span>
    </button>
  );
}
