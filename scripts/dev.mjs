import { spawn } from "node:child_process";

const args = process.argv.slice(2);
const docsOnly = args.includes("--docs");
const passthroughArgs = args.filter((arg) => arg !== "--docs");

const command = process.platform === "win32" ? "pnpm.cmd" : "pnpm";
const commandArgs = docsOnly
  ? ["--filter", "@company-website/app", "dev:docs", ...passthroughArgs]
  : [
      "concurrently",
      "pnpm --filter @company-website/app dev",
      "pnpm --filter server dev",
      ...passthroughArgs,
    ];

if (docsOnly) {
  console.log("Starting docs dev server at http://localhost:3000/docs");
}

const child = spawn(command, commandArgs, {
  stdio: "inherit",
  env: {
    ...process.env,
    ...(docsOnly ? { DOCS_DEV: "true" } : {}),
  },
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});
