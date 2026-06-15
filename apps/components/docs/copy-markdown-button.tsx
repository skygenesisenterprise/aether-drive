"use client";

import { useCopyButton } from "fumadocs-ui/utils/use-copy-button";
import { Check, Copy } from "lucide-react";

export function CopyMarkdownButton({ markdown }: { markdown: string }) {
	const [checked, onClick] = useCopyButton(() => {
		navigator.clipboard.writeText(markdown);
	});

	return (
		<button
			type="button"
			className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-xs transition-colors hover:bg-muted hover:text-foreground"
			onClick={onClick}
		>
			{checked ? (
				<>
					<Check className="size-3.5" />
					Copied!
				</>
			) : (
				<>
					<Copy className="size-3.5" />
					Copy as Markdown
				</>
			)}
		</button>
	);
}
