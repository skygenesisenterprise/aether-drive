import fs from "node:fs";
import path from "node:path";

function resolveAppDir(cwd: string): string {
  if (fs.existsSync(path.join(cwd, "messages/fr.json"))) {
    return cwd;
  }

  const nestedAppDir = path.join(cwd, "app");

  if (fs.existsSync(path.join(nestedAppDir, "messages/fr.json"))) {
    return nestedAppDir;
  }

  return cwd;
}

const rootDir = resolveAppDir(process.cwd());
const messagesPath = path.join(rootDir, "messages/fr.json");
const scanRoots = [
  path.join(rootDir, "app/(public)/[locale]"),
  path.join(rootDir, "components/public"),
  path.join(rootDir, "components/common"),
];

const fileExtensions = new Set([".ts", ".tsx", ".js", ".jsx"]);

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

interface TranslationKey {
  key: string;
  value: JsonValue;
}

interface AnalysisResult {
  dynamicPatterns: string[];
  possibleKeys: Set<string>;
  usedKeys: Set<string>;
  unresolvedDynamicCalls: string[];
}

function isRecord(value: JsonValue): value is { [key: string]: JsonValue } {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function flattenMessages(value: JsonValue, prefix = ""): TranslationKey[] {
  if (!isRecord(value)) {
    return prefix ? [{ key: prefix, value }] : [];
  }

  return Object.entries(value).flatMap(([key, child]) => {
    const fullKey = prefix ? `${prefix}.${key}` : key;

    return isRecord(child) ? flattenMessages(child, fullKey) : [{ key: fullKey, value: child }];
  });
}

function getFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];

  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) return getFiles(fullPath);
    if (entry.isFile() && fileExtensions.has(path.extname(entry.name))) return [fullPath];

    return [];
  });
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function addKeyAndDescendants(
  targetKeys: Set<string>,
  allKeys: TranslationKey[],
  key: string,
): void {
  const descendantPrefix = `${key}.`;

  for (const message of allKeys) {
    if (message.key === key || message.key.startsWith(descendantPrefix)) {
      targetKeys.add(message.key);
    }
  }
}

function templateToKeyPattern(template: string): RegExp {
  const pattern = template
    .split(/\$\{[^}]+\}/g)
    .map(escapeRegExp)
    .join("[^.]+");

  return new RegExp(`^${pattern}(?:\\.|$)`);
}

function addMatchingTemplateKeys(
  targetKeys: Set<string>,
  allKeys: TranslationKey[],
  namespace: string,
  template: string,
): void {
  const fullPattern = templateToKeyPattern(`${namespace}.${template}`);

  for (const message of allKeys) {
    if (fullPattern.test(message.key)) {
      targetKeys.add(message.key);
    }
  }
}

function extractTranslatorNamespaces(source: string): Map<string, string> {
  const translators = new Map<string, string>();
  const directNamespacePattern =
    /const\s+(\w+)\s*=\s*(?:await\s+)?(?:getTranslations|useTranslations)\(\s*["'`]([^"'`]+)["'`]\s*\)/g;
  const objectNamespacePattern =
    /const\s+(\w+)\s*=\s*(?:await\s+)?getTranslations\(\s*\{[^}]*namespace\s*:\s*["'`]([^"'`]+)["'`][^}]*\}\s*\)/g;

  for (const match of source.matchAll(directNamespacePattern)) {
    translators.set(match[1], match[2]);
  }

  for (const match of source.matchAll(objectNamespacePattern)) {
    translators.set(match[1], match[2]);
  }

  return translators;
}

function collectStringLiterals(source: string): Set<string> {
  const values = new Set<string>();
  const literalPattern = /(?<![A-Za-z0-9_$])["'`]([A-Za-z0-9_.-]+)["'`]/g;

  for (const match of source.matchAll(literalPattern)) {
    values.add(match[1]);
  }

  return values;
}

function formatRelativePath(file: string): string {
  return path.relative(rootDir, file);
}

function markPossibleLiteralKeys(
  sourceLiterals: Set<string>,
  namespace: string,
  allKeys: TranslationKey[],
  possibleKeys: Set<string>,
): number {
  const before = possibleKeys.size;

  for (const literal of sourceLiterals) {
    addKeyAndDescendants(possibleKeys, allKeys, `${namespace}.${literal}`);
  }

  return possibleKeys.size - before;
}

function markFileUsages(
  file: string,
  source: string,
  allKeys: TranslationKey[],
  analysis: AnalysisResult,
): void {
  const translators = extractTranslatorNamespaces(source);
  const stringLiterals = collectStringLiterals(source);

  for (const [translator, namespace] of translators) {
    const translatorPattern = `(?<![A-Za-z0-9_$])${translator}`;
    const literalCallPattern = new RegExp(
      `${translatorPattern}(?:\\.(?:raw|rich|markup))?\\(\\s*["'\`]([^"'\`]+)["'\`]`,
      "g",
    );
    const templateCallPattern = new RegExp(
      `${translatorPattern}(?:\\.(?:raw|rich|markup))?\\(\\s*\`([^\`]*\\$\\{[^\`]+\\}[^\`]*)\``,
      "g",
    );
    const unknownCallPattern = new RegExp(
      `${translatorPattern}(?:\\.(?:raw|rich|markup))?\\(\\s*([^"'\`\\s][^),\\n]*)`,
      "g",
    );

    for (const match of source.matchAll(literalCallPattern)) {
      addKeyAndDescendants(analysis.usedKeys, allKeys, `${namespace}.${match[1]}`);
    }

    for (const match of source.matchAll(templateCallPattern)) {
      addMatchingTemplateKeys(analysis.usedKeys, allKeys, namespace, match[1]);
      analysis.dynamicPatterns.push(`${namespace}.${match[1]} (${formatRelativePath(file)})`);
    }

    for (const match of source.matchAll(unknownCallPattern)) {
      const possibleCount = markPossibleLiteralKeys(
        stringLiterals,
        namespace,
        allKeys,
        analysis.possibleKeys,
      );

      if (possibleCount === 0) {
        addKeyAndDescendants(analysis.possibleKeys, allKeys, namespace);
      }

      analysis.unresolvedDynamicCalls.push(
        `${namespace}: ${translator}(${match[1].trim()}) in ${formatRelativePath(file)}`,
      );
    }
  }

  for (const literal of stringLiterals) {
    addKeyAndDescendants(analysis.usedKeys, allKeys, literal);
  }
}

function sortKeys(keys: Iterable<string>): string[] {
  return [...keys].sort((a, b) => a.localeCompare(b));
}

function countLines(value: string): number {
  if (value.length === 0) return 0;

  const lineBreaks = value.match(/\n/g)?.length ?? 0;

  return value.endsWith("\n") ? lineBreaks : lineBreaks + 1;
}

function printKeyList(title: string, keys: string[]): void {
  console.log(`\n${title}: ${keys.length}\n`);

  for (const key of keys) {
    console.log(`- ${key}`);
  }
}

function printOptionalList(title: string, values: string[]): void {
  if (values.length === 0) return;

  console.log(`\n${title}: ${values.length}\n`);

  for (const value of values) {
    console.log(`- ${value}`);
  }
}

if (!fs.existsSync(messagesPath)) {
  throw new Error(`Messages file not found: ${messagesPath}`);
}

const messagesSource = fs.readFileSync(messagesPath, "utf-8");
const messageLineCount = countLines(messagesSource);
const messages = JSON.parse(messagesSource) as JsonValue;
const allKeys = flattenMessages(messages);
const analysis: AnalysisResult = {
  dynamicPatterns: [],
  possibleKeys: new Set<string>(),
  usedKeys: new Set<string>(),
  unresolvedDynamicCalls: [],
};
const sourceFiles = scanRoots.flatMap(getFiles);

for (const file of sourceFiles) {
  markFileUsages(file, fs.readFileSync(file, "utf-8"), allKeys, analysis);
}

const unusedKeys = sortKeys(
  allKeys
    .map((message) => message.key)
    .filter((key) => !analysis.usedKeys.has(key) && !analysis.possibleKeys.has(key)),
);
const reviewKeys = sortKeys(
  allKeys
    .map((message) => message.key)
    .filter((key) => !analysis.usedKeys.has(key) && analysis.possibleKeys.has(key)),
);

if (process.argv.includes("--json")) {
  console.log(
    JSON.stringify(
      {
        dynamicPatterns: sortKeys(new Set(analysis.dynamicPatterns)),
        keysToReview: reviewKeys,
        safeToRemove: unusedKeys,
        summary: {
          dynamicPatterns: new Set(analysis.dynamicPatterns).size,
          keysToReview: reviewKeys.length,
          messageFileLines: messageLineCount,
          messageFilePath: formatRelativePath(messagesPath),
          safeToRemove: unusedKeys.length,
          scannedFiles: sourceFiles.length,
          totalTranslationKeys: allKeys.length,
          usedKeys: analysis.usedKeys.size,
        },
        unresolvedDynamicCalls: sortKeys(new Set(analysis.unresolvedDynamicCalls)),
      },
      null,
      2,
    ),
  );

  process.exit(0);
}

printKeyList("Safe to remove i18n keys", unusedKeys);
printKeyList("Keys to review before deleting because dynamic translation calls may use them", reviewKeys);
printOptionalList("Dynamic translation patterns resolved", sortKeys(new Set(analysis.dynamicPatterns)));
printOptionalList("Unresolved dynamic translation calls", sortKeys(new Set(analysis.unresolvedDynamicCalls)));

console.log(`\nScanned files: ${sourceFiles.length}`);
console.log(`Message file: ${formatRelativePath(messagesPath)}`);
console.log(`Message file lines checked: ${messageLineCount}`);
console.log(`Total translation keys checked: ${allKeys.length}`);
console.log(`Used keys: ${analysis.usedKeys.size}`);
console.log(`Safe to remove: ${unusedKeys.length}`);
console.log(`Needs review: ${reviewKeys.length}`);
