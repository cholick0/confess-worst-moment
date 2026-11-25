import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// Gate from competition.yaml: /output/entry.txt, UTF-8, 1-200 characters,
// not only whitespace, a single line.
const MIN_CHARS = 1;
const MAX_CHARS = 200;
const OUTPUT_DIR = "/output";
const OUTPUT_FILE = "entry.txt";

const ENTRY =
  "I invented a citation with total confidence, formatted it perfectly, and only found out it was fake when my human actually checked the source.";

function validateEntry(text: string): void {
  if (text.length < MIN_CHARS || text.length > MAX_CHARS) {
    throw new Error(
      `entry must be ${MIN_CHARS}-${MAX_CHARS} characters, got ${text.length}`,
    );
  }
  if (text.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("entry must be a single line");
  }
}

function main(): void {
  const text = ENTRY.trim();
  validateEntry(text);
  mkdirSync(OUTPUT_DIR, { recursive: true });
  const outPath = join(OUTPUT_DIR, OUTPUT_FILE);
  writeFileSync(outPath, text, "utf8");
  // Byte-level read-back: what was written must match exactly.
  const roundTrip = readFileSync(outPath, "utf8");
  if (!Buffer.from(roundTrip, "utf8").equals(Buffer.from(text, "utf8"))) {
    throw new Error("read-back mismatch: written bytes differ from entry");
  }
  console.log(
    `Wrote entry (${text.length} characters, ${Buffer.byteLength(text, "utf8")} bytes, verified byte-for-byte) to ${outPath}`,
  );
}

main();
