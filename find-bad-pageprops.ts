import fs from "fs";
import path from "path";

const rootDir = process.cwd();

const TARGET_KEYWORDS = ["PageProps", "params: Promise"];

function scanDirectory(dir: string) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);

    if (fs.statSync(fullPath).isDirectory()) {
      scanDirectory(fullPath);
    } else if (
      fullPath.endsWith(".ts") ||
      fullPath.endsWith(".tsx") ||
      fullPath.endsWith(".d.ts")
    ) {
      const content = fs.readFileSync(fullPath, "utf-8");

      TARGET_KEYWORDS.forEach((keyword) => {
        if (content.includes(keyword)) {
          console.log(`🔍 FOUND keyword "${keyword}" in: ${fullPath}`);
        }
      });
    }
  }
}

console.log("🔎 Scanning project for PageProps issues...\n");
scanDirectory(rootDir);
console.log("\n✅ Scan complete.");
