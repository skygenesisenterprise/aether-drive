/**
 * Sky Genesis Enterprise
 *
 * Scope: Official Website
 * Component: MegaMenuItem
 * Layer: Public UI
 * Purpose: Provides a mega menu item with a dropdown.
 *
 * Stability: Active
 * Owner: SGE Web Platform
 * Contact: contact@skygenesisenterprise.com
 */
"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface MegaMenuItemProps {
  label: string;
  children: React.ReactNode;
  className?: string;
  dropdownClassName?: string;
  align?: "left" | "center" | "right";
}

export function MegaMenuItem({
  label,
  children,
  className,
  dropdownClassName,
  align = "center",
}: MegaMenuItemProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLLIElement>(null);
  const closeTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearCloseTimer = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const handleOpen = () => {
    clearCloseTimer();
    setIsOpen(true);
  };

  const handleClose = () => {
    closeTimerRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  React.useEffect(() => {
    return () => clearCloseTimer();
  }, []);

  const alignClasses = {
    left: "left-0",
    center: "left-1/2 -translate-x-1/2",
    right: "right-0",
  };

  return (
    <li
      ref={containerRef}
      className={cn("relative group", className)}
      onMouseEnter={handleOpen}
      onMouseLeave={handleClose}
    >
      <button
        type="button"
        aria-expanded={isOpen}
        className={cn(
          "flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors duration-200",
          isOpen
            ? "text-foreground"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        {label}
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {/* Invisible buffer zone to prevent menu from closing when moving mouse down */}
      <div
        className={cn(
          "absolute top-full h-4 w-full",
          alignClasses[align],
          !isOpen && "pointer-events-none"
        )}
      />

      {/* Dropdown */}
      <div
        className={cn(
          "absolute top-full pt-4",
          alignClasses[align],
          "transition-all duration-200 ease-out",
          isOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-2 pointer-events-none",
          dropdownClassName
        )}
      >
        <div className="bg-background border border-border rounded-xl shadow-xl overflow-hidden">
          {children}
        </div>
      </div>
    </li>
  );
}
