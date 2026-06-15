import * as React from "react";
import { Callout } from "fumadocs-ui/components/callout";
import { ImageZoom } from "fumadocs-ui/components/image-zoom";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import defaultMdxComponents from "fumadocs-ui/mdx";
import { ArrowRight, Terminal } from "lucide-react";
import type { MDXComponents } from "mdx/types";
import Link from "next/link";

export function getMDXComponents(components?: MDXComponents): MDXComponents {
	return {
		...defaultMdxComponents,
		ImageZoom,
		Callout,
		Tab,
		Tabs,
		Steps,
		Card,
		CardGrid,
		APIEndpoint,
		CodeBlock,
		...components,
		p: ({ children }) => (
			<p className="text-[#3f4542] dark:text-muted-foreground">{children}</p>
		),
		li: ({ children, id }) => (
			<li {...{ id }} className="text-[#3f4542] dark:text-muted-foreground">
				{children}
			</li>
		),
	};
}

function Steps({ children }: { children: React.ReactNode }) {
	return <div className="my-6 space-y-4 border-l border-[#d6d8d1] pl-5 dark:border-border">{children}</div>;
}

function Card({
	title,
	description,
	href,
	children,
}: {
	title: string;
	description?: string;
	href?: string;
	children?: React.ReactNode;
}) {
	const content = (
		<div className="group rounded-md border border-[#e5e5df] bg-white p-4 shadow-xs transition-colors hover:border-[#cfd1c9] hover:bg-[#fbfbfa] dark:border-border dark:bg-card dark:hover:border-foreground/20 dark:hover:bg-muted/50">
			<div className="flex items-start justify-between gap-4">
				<div>
					<h3 className="font-medium text-[#252927] dark:text-foreground">{title}</h3>
					{description ? (
						<p className="mt-1 text-sm leading-6 text-[#6d726f] dark:text-muted-foreground">{description}</p>
					) : null}
					{children ? <div className="mt-3 text-sm text-[#6d726f] dark:text-muted-foreground">{children}</div> : null}
				</div>
				{href ? (
					<ArrowRight className="mt-1 size-4 shrink-0 text-[#8a8f8b] transition-transform group-hover:translate-x-0.5 group-hover:text-[#238558] dark:text-muted-foreground dark:group-hover:text-foreground" />
				) : null}
			</div>
		</div>
	);

	if (!href) {
		return content;
	}

	return <Link href={href}>{content}</Link>;
}

function CardGrid({ children }: { children: React.ReactNode }) {
	return <div className="my-6 grid gap-3 sm:grid-cols-2">{children}</div>;
}

function APIEndpoint({
	method,
	path,
	description,
}: {
	method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
	path: string;
	description?: string;
}) {
	return (
		<div className="my-6 rounded-md border border-[#e5e5df] bg-white p-4 dark:border-border dark:bg-card">
			<div className="flex flex-wrap items-center gap-3">
				<span className="rounded border border-[#cfe5d7] bg-[#edf7f1] px-2 py-1 font-mono text-xs font-semibold text-[#147342] dark:border-border dark:bg-muted dark:text-foreground">
					{method}
				</span>
				<code className="font-mono text-sm text-[#252927] dark:text-foreground">{path}</code>
			</div>
			{description ? <p className="mt-3 text-sm text-[#6d726f] dark:text-muted-foreground">{description}</p> : null}
		</div>
	);
}

function CodeBlock({ children }: { children: React.ReactNode }) {
	return (
		<div className="my-6 overflow-hidden rounded-md border border-border bg-zinc-950 text-zinc-100">
			<div className="flex items-center gap-2 border-b border-white/10 px-4 py-2 text-xs text-zinc-400">
				<Terminal className="size-3.5" />
				Code
			</div>
			<pre className="overflow-x-auto p-4 text-sm">{children}</pre>
		</div>
	);
}
