import * as React from "react";
import { cn } from "@/lib/utils";

export function DocsLogo(props: React.ComponentPropsWithoutRef<"div">) {
  const { className, ...rest } = props;

  return (
    <div
      {...rest}
      className={cn(
        "flex size-7 items-center justify-center rounded-md bg-[#151716] text-[10px] font-semibold text-white shadow-xs ring-1 ring-black/5 dark:bg-foreground dark:text-background",
        className,
      )}
    >
      SGE
    </div>
  );
}
