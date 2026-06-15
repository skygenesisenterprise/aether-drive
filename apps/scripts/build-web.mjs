import { access, cp, mkdtemp, rename, rm } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { spawn } from "node:child_process";

const appRoot = process.cwd();
const routesRoot = path.join(appRoot, "app");

const excludedEntries = [
  { root: routesRoot, name: "(docs)" },
  { root: routesRoot, name: "(health)" },
  { root: routesRoot, name: "(platform)" },
  { root: appRoot, name: "proxy.ts" },
];

function runNextBuild() {
  return new Promise((resolve, reject) => {
    const child = spawn("pnpm", ["next", "build"], {
      cwd: appRoot,
      stdio: "inherit",
      env: {
        ...process.env,
        NODE_ENV: "production",
        BUILD_WEB_STATIC: "true",
      },
    });

    child.on("exit", (code, signal) => {
      if (signal) {
        reject(new Error(`next build interrupted by signal ${signal}`));
        return;
      }

      if (code !== 0) {
        reject(new Error(`next build failed with exit code ${code}`));
        return;
      }

      resolve();
    });

    child.on("error", reject);
  });
}

async function moveEntry(from, to) {
  try {
    await rename(from, to);
  } catch (error) {
    if (!(error instanceof Error) || !("code" in error) || error.code !== "EXDEV") {
      throw error;
    }

    await cp(from, to, { recursive: true });
    await rm(from, { recursive: true, force: true });
  }
}

const movedEntries = [];
const stagingRoot = await mkdtemp(path.join(appRoot, ".build-web-staging-"));

try {
  for (const entry of excludedEntries) {
    const sourcePath = path.join(entry.root, entry.name);
    const targetPath = path.join(stagingRoot, entry.name);

    try {
      await access(sourcePath);
    } catch {
      continue;
    }

    await moveEntry(sourcePath, targetPath);
    movedEntries.push({ sourcePath, targetPath });
  }

  await runNextBuild();
} finally {
  for (const { sourcePath, targetPath } of movedEntries.reverse()) {
    await moveEntry(targetPath, sourcePath);
  }

  await rm(stagingRoot, { recursive: true, force: true });
}
