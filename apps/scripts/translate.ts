import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import "dotenv/config";
import * as deepl from "deepl-node";

const CACHE_PROVIDER = "deepl";
const DEFAULT_RETRIES = 6;
const DEFAULT_RETRY_DELAY_MS = 2_000;

type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };

interface CliOptions {
  dryRun: boolean;
  force: boolean;
  from: string;
  mergeExisting: boolean;
  noCache: boolean;
  retries: number;
  retryDelayMs: number;
  source?: string;
  target?: string;
  to: string;
}

interface TranslationCache {
  entries: Record<string, string>;
}

interface Stats {
  cacheHits: number;
  errors: number;
  retries: number;
  skippedExisting: number;
  totalStrings: number;
  translated: number;
  warnings: number;
}

interface TranslateContext {
  cache: TranslationCache;
  cachePath: string;
  options: CliOptions;
  sourceLang: string | null;
  stats: Stats;
  targetLang: string;
  translator: deepl.Translator;
  warnings: string[];
}

function printUsage(): void {
  console.log(`Usage:
  pnpm tsx app/scripts/translate.ts --from fr --to ja
  pnpm i18n:translate -- --from fr --to ja

Options:
  --from <locale>       Source locale, for example fr
  --to <locale>         Target locale, for example ja
  --source <path>       Source JSON path, default messages/{from}.json or app/messages/{from}.json
  --target <path>       Target JSON path, default beside source as {to}.json
  --merge-existing      Reuse existing target values when the key already exists
  --force               Deprecated alias for the default overwrite behavior
  --no-cache            Ignore cached translations and call the model for every string
  --retries <count>     Retry transient DeepL errors, default ${DEFAULT_RETRIES}
  --retry-delay-ms <ms> Initial retry delay, default ${DEFAULT_RETRY_DELAY_MS}
  --dry-run             Do not write the target file

Environment:
  DEEPL_AUTH_KEY or DEEPL_API_KEY must contain your DeepL API key.
`);
}

function parseArgs(args: string[]): CliOptions {
  const options: Partial<CliOptions> = {
    dryRun: false,
    force: false,
    mergeExisting: false,
    noCache: false,
    retries: DEFAULT_RETRIES,
    retryDelayMs: DEFAULT_RETRY_DELAY_MS,
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    const next = args[index + 1];

    if (arg === "--help" || arg === "-h") {
      printUsage();
      process.exit(0);
    }

    if (arg === "--dry-run") {
      options.dryRun = true;
      continue;
    }

    if (arg === "--force") {
      options.force = true;
      continue;
    }

    if (arg === "--merge-existing") {
      options.mergeExisting = true;
      continue;
    }

    if (arg === "--no-cache") {
      options.noCache = true;
      continue;
    }

    if (arg === "--retries" || arg === "--retry-delay-ms") {
      if (!next || next.startsWith("--")) {
        throw new Error(`Missing value for ${arg}`);
      }

      const value = Number.parseInt(next, 10);

      if (!Number.isInteger(value) || value < 0) {
        throw new Error(`Invalid value for ${arg}: ${next}`);
      }

      if (arg === "--retries") options.retries = value;
      if (arg === "--retry-delay-ms") options.retryDelayMs = value;
      index += 1;
      continue;
    }

    if (arg === "--from" || arg === "--to" || arg === "--source" || arg === "--target") {
      if (!next || next.startsWith("--")) {
        throw new Error(`Missing value for ${arg}`);
      }

      const key = arg.slice(2) as keyof Pick<CliOptions, "from" | "source" | "target" | "to">;
      options[key] = next;
      index += 1;
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  if (!options.from) throw new Error("Missing required option: --from");
  if (!options.to) throw new Error("Missing required option: --to");
  if (options.to === "jp") throw new Error("Use the standard Japanese locale code `ja`, not `jp`.");

  return options as CliOptions;
}

function resolveMessagesDir(rootDir: string): string {
  const rootMessagesDir = path.join(rootDir, "messages");
  const appMessagesDir = path.join(rootDir, "app/messages");

  if (fs.existsSync(rootMessagesDir)) return rootMessagesDir;
  if (fs.existsSync(appMessagesDir)) return appMessagesDir;

  return rootMessagesDir;
}

function resolvePaths(options: CliOptions): { cachePath: string; sourcePath: string; targetPath: string } {
  const rootDir = process.cwd();
  const messagesDir = resolveMessagesDir(rootDir);
  const sourcePath = path.resolve(rootDir, options.source ?? path.join(messagesDir, `${options.from}.json`));
  const targetPath = path.resolve(
    rootDir,
    options.target ?? path.join(path.dirname(sourcePath), `${options.to}.json`),
  );

  return {
    cachePath: path.join(rootDir, "app/.cache/i18n-translate-cache.json"),
    sourcePath,
    targetPath,
  };
}

function readJsonFile(filePath: string, required: boolean): JsonValue | undefined {
  if (!fs.existsSync(filePath)) {
    if (required) throw new Error(`Source file not found: ${filePath}`);
    return undefined;
  }

  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8")) as JsonValue;
  } catch (error) {
    throw new Error(`Invalid JSON in ${filePath}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

function readRequiredJsonFile(filePath: string): JsonValue {
  const value = readJsonFile(filePath, true);

  if (value === undefined) {
    throw new Error(`Source file not found: ${filePath}`);
  }

  return value;
}

function readCache(cachePath: string): TranslationCache {
  const cache = readJsonFile(cachePath, false);

  if (!cache || typeof cache !== "object" || Array.isArray(cache)) {
    return { entries: {} };
  }

  const entries = "entries" in cache && typeof cache.entries === "object" && !Array.isArray(cache.entries)
    ? cache.entries
    : {};

  return { entries: entries as Record<string, string> };
}

function writeJsonFile(filePath: string, value: JsonValue): void {
  try {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf-8");
  } catch (error) {
    throw new Error(`Failed to write ${filePath}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

function writeCache(context: TranslateContext): void {
  if (context.options.dryRun) return;

  writeJsonFile(context.cachePath, context.cache as unknown as JsonValue);
}

function isRecord(value: JsonValue | undefined): value is { [key: string]: JsonValue } {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function getCacheKey(from: string, to: string, sourceText: string): string {
  const hash = crypto.createHash("sha256").update(sourceText).digest("hex");

  return `${CACHE_PROVIDER}:${from}:${to}:${hash}`;
}

function normalizeSourceLanguage(locale: string): string | null {
  const normalized = locale.toLowerCase().replace("_", "-");
  const language = normalized.split("-")[0];

  if (language === "auto") return null;
  if (language === "en") return "EN";
  if (language === "pt") return "PT";
  if (language === "zh") return "ZH";

  return language.toUpperCase();
}

function normalizeTargetLanguage(locale: string): string {
  const normalized = locale.toLowerCase().replace("_", "-");

  const explicitTargets: Record<string, string> = {
    "en": "EN-US",
    "en-gb": "EN-GB",
    "en-us": "EN-US",
    "pt": "PT-PT",
    "pt-br": "PT-BR",
    "pt-pt": "PT-PT",
    "zh": "ZH-HANS",
    "zh-hans": "ZH-HANS",
    "zh-hant": "ZH-HANT",
  };

  return explicitTargets[normalized] ?? normalized.split("-")[0].toUpperCase();
}

function extractPlaceholders(value: string): string[] {
  const matches = value.match(/\{[A-Za-z_][A-Za-z0-9_]*(?:\s*,[^{}]*)?\}/g);

  return matches ? [...new Set(matches)].sort() : [];
}

function extractTags(value: string): string[] {
  const matches = value.match(/<\/?[A-Za-z][A-Za-z0-9:-]*(?:\s+[^<>]*?)?\s*\/?>/g);

  return matches ? [...new Set(matches)].sort() : [];
}

function missingTokens(before: string[], afterValue: string): string[] {
  return before.filter((token) => !afterValue.includes(token));
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function isRetryableDeepLError(error: unknown): boolean {
  const message = getErrorMessage(error);

  return /too many requests|429|high load|temporarily unavailable|timeout|econnreset|etimedout/i.test(message);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function validateTranslation(sourceText: string, translatedText: string, keyPath: string, context: TranslateContext): void {
  const missingPlaceholders = missingTokens(extractPlaceholders(sourceText), translatedText);
  const missingTags = missingTokens(extractTags(sourceText), translatedText);

  if (missingPlaceholders.length > 0) {
    context.stats.warnings += 1;
    context.warnings.push(
      `${keyPath}: missing placeholders after translation: ${missingPlaceholders.join(", ")}`,
    );
  }

  if (missingTags.length > 0) {
    context.stats.warnings += 1;
    context.warnings.push(`${keyPath}: missing HTML/React tags after translation: ${missingTags.join(", ")}`);
  }
}

async function callDeepL(sourceText: string, context: TranslateContext): Promise<string> {
  let attempt = 0;

  while (true) {
    try {
      const result = await context.translator.translateText(
        sourceText,
        context.sourceLang as deepl.SourceLanguageCode | null,
        context.targetLang as deepl.TargetLanguageCode,
        {
          preserveFormatting: true,
          tagHandling: extractTags(sourceText).length > 0 ? "html" : undefined,
        },
      );

      const translatedText = result.text.trim();

      if (!translatedText) {
        throw new Error("DeepL returned an empty translation");
      }

      return translatedText;
    } catch (error) {
      if (attempt >= context.options.retries || !isRetryableDeepLError(error)) {
        throw error;
      }

      attempt += 1;
      context.stats.retries += 1;

      const delay = context.options.retryDelayMs * 2 ** (attempt - 1);
      console.warn(
        `Warning: DeepL transient error, retry ${attempt}/${context.options.retries} in ${delay}ms: ${getErrorMessage(error)}`,
      );

      await sleep(delay);
    }
  }
}

async function translateString(sourceText: string, keyPath: string, context: TranslateContext): Promise<string> {
  const cacheKey = getCacheKey(context.sourceLang ?? "auto", context.targetLang, sourceText);
  const cached = context.options.noCache ? undefined : context.cache.entries[cacheKey];

  if (cached) {
    context.stats.cacheHits += 1;
    validateTranslation(sourceText, cached, keyPath, context);
    return cached;
  }

  try {
    const translatedText = await callDeepL(sourceText, context);
    context.cache.entries[cacheKey] = translatedText;
    context.stats.translated += 1;
    validateTranslation(sourceText, translatedText, keyPath, context);
    writeCache(context);

    return translatedText;
  } catch (error) {
    context.stats.errors += 1;
    throw new Error(`${keyPath}: ${getErrorMessage(error)}`);
  }
}

async function translateValue(
  sourceValue: JsonValue,
  targetValue: JsonValue | undefined,
  keyPath: string,
  context: TranslateContext,
): Promise<JsonValue> {
  if (typeof sourceValue === "string") {
    context.stats.totalStrings += 1;

    if (context.options.mergeExisting && typeof targetValue === "string") {
      context.stats.skippedExisting += 1;
      return targetValue;
    }

    return translateString(sourceValue, keyPath, context);
  }

  if (Array.isArray(sourceValue)) {
    const targetArray = Array.isArray(targetValue) ? targetValue : [];
    const translatedArray: JsonValue[] = [];

    for (let index = 0; index < sourceValue.length; index += 1) {
      translatedArray.push(
        await translateValue(sourceValue[index], targetArray[index], `${keyPath}[${index}]`, context),
      );
    }

    return translatedArray;
  }

  if (isRecord(sourceValue)) {
    const targetRecord = isRecord(targetValue) ? targetValue : {};
    const translatedRecord: { [key: string]: JsonValue } = {};

    for (const [key, value] of Object.entries(sourceValue)) {
      const nextKeyPath = keyPath ? `${keyPath}.${key}` : key;
      translatedRecord[key] = await translateValue(value, targetRecord[key], nextKeyPath, context);
    }

    return translatedRecord;
  }

  return sourceValue;
}

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));
  const apiKey = process.env.DEEPL_AUTH_KEY || process.env.DEEPL_API_KEY;
  const { cachePath, sourcePath, targetPath } = resolvePaths(options);
  const sourceLang = normalizeSourceLanguage(options.from);
  const targetLang = normalizeTargetLanguage(options.to);

  if (!apiKey && !options.dryRun) {
    throw new Error("Missing DEEPL_AUTH_KEY or DEEPL_API_KEY environment variable");
  }

  const sourceJson = readRequiredJsonFile(sourcePath);
  const targetJson = readJsonFile(targetPath, false);
  const context: TranslateContext = {
    cache: readCache(cachePath),
    cachePath,
    options,
    sourceLang,
    stats: {
      cacheHits: 0,
      errors: 0,
      retries: 0,
      skippedExisting: 0,
      totalStrings: 0,
      translated: 0,
      warnings: 0,
    },
    targetLang,
    translator: new deepl.Translator(apiKey || "dry-run"),
    warnings: [],
  };

  console.log(`Source: ${path.relative(process.cwd(), sourcePath)}`);
  console.log(`Target: ${path.relative(process.cwd(), targetPath)}`);
  console.log(`Provider: DeepL`);
  console.log(`Languages: ${sourceLang ?? "auto"} -> ${targetLang}`);
  if (options.dryRun) console.log("Mode: dry-run");

  const translatedJson = options.dryRun
    ? await translateValueForDryRun(sourceJson, targetJson, "", context)
    : await translateValue(sourceJson, targetJson, "", context);

  if (!options.dryRun) {
    writeJsonFile(targetPath, translatedJson);
    writeJsonFile(cachePath, context.cache as unknown as JsonValue);
  }

  for (const warning of context.warnings) {
    console.warn(`Warning: ${warning}`);
  }

  console.log(`Total strings: ${context.stats.totalStrings}`);
  console.log(`Translated: ${context.stats.translated}`);
  console.log(`Skipped existing: ${context.stats.skippedExisting}`);
  console.log(`Cache hits: ${context.stats.cacheHits}`);
  console.log(`Retries: ${context.stats.retries}`);
  console.log(`Warnings: ${context.stats.warnings}`);
  console.log(`Errors: ${context.stats.errors}`);
  console.log(
    options.dryRun
      ? `Dry-run complete. No file written to ${path.relative(process.cwd(), targetPath)}`
      : `Output written to ${path.relative(process.cwd(), targetPath)}`,
  );
}

async function translateValueForDryRun(
  sourceValue: JsonValue,
  targetValue: JsonValue | undefined,
  keyPath: string,
  context: TranslateContext,
): Promise<JsonValue> {
  if (typeof sourceValue === "string") {
    context.stats.totalStrings += 1;

    if (context.options.mergeExisting && typeof targetValue === "string") {
      context.stats.skippedExisting += 1;
      return targetValue;
    }

    context.stats.translated += 1;
    return sourceValue;
  }

  if (Array.isArray(sourceValue)) {
    const targetArray = Array.isArray(targetValue) ? targetValue : [];

    return Promise.all(
      sourceValue.map((value, index) =>
        translateValueForDryRun(value, targetArray[index], `${keyPath}[${index}]`, context),
      ),
    );
  }

  if (isRecord(sourceValue)) {
    const targetRecord = isRecord(targetValue) ? targetValue : {};
    const translatedRecord: { [key: string]: JsonValue } = {};

    for (const [key, value] of Object.entries(sourceValue)) {
      const nextKeyPath = keyPath ? `${keyPath}.${key}` : key;
      translatedRecord[key] = await translateValueForDryRun(value, targetRecord[key], nextKeyPath, context);
    }

    return translatedRecord;
  }

  return sourceValue;
}

main().catch((error) => {
  console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});
