/**
 * Sky Genesis Enterprise
 *
 * Scope: Official Website
 * Component: HeaderAuthButton
 * Layer: Public UI
 * Purpose: Provides authentication buttons in the header.
 *
 * Stability: Active
 * Owner: SGE Web Platform
 * Contact: contact@skygenesisenterprise.com
 */
"use client";

import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeaderAuthButtonProps {
  loginText: string;
  accountText: string;
  signUpText: string;
  signUpHref: string;
  compact?: boolean;
}

export function HeaderAuthButton({
  loginText,
  accountText,
  signUpText,
  signUpHref,
  compact = false,
}: HeaderAuthButtonProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className={cn("flex items-center", compact ? "gap-1.5" : "gap-2")}>
        <div className={cn("animate-pulse rounded bg-muted", compact ? "h-8 w-16" : "h-9 w-20")} />
        <div className={cn("animate-pulse rounded bg-muted", compact ? "h-8 w-20" : "h-9 w-24")} />
      </div>
    );
  }

  return (
    <div className={cn("flex shrink-0 items-center", compact ? "gap-1.5" : "gap-2")}>
      {isAuthenticated ? (
        <Link href="https://account.skygenesisenterprise.com">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "font-medium text-muted-foreground hover:text-foreground",
              compact ? "h-8 px-3 text-xs" : "h-9 px-4",
            )}
          >
            {accountText}
          </Button>
        </Link>
      ) : (
        <Link href="https://sso.skygenesisenterprise.com/login">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "font-medium text-muted-foreground hover:text-foreground",
              compact ? "h-8 px-3 text-xs" : "h-9 px-4",
            )}
          >
            {loginText}
          </Button>
        </Link>
      )}
      <Link href={signUpHref}>
        <Button
          size="sm"
          className={cn(
            "rounded-full bg-slate-950 font-semibold text-white shadow-[0_16px_34px_-24px_rgba(15,23,42,0.9)] hover:bg-slate-800",
            compact ? "h-8 px-3 text-xs" : "h-10 px-5",
          )}
        >
          <span className="whitespace-nowrap">{signUpText}</span>
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden={true} />
        </Button>
      </Link>
    </div>
  );
}
