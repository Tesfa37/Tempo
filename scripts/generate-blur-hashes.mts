import { getPlaiceholder } from "plaiceholder";
import { readFileSync, writeFileSync, readdirSync, statSync } from "fs";
import { join, relative } from "path";

const results: Record<string, string> = {};

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory()
      ? walk(full)
      : /\.(jpg|jpeg|png|webp)$/i.test(name)
      ? [full]
      : [];
  });
}

for (const imgPath of walk("public/images")) {
  const buffer = readFileSync(imgPath);
  const { base64 } = await getPlaiceholder(buffer);
  const webPath = "/" + relative("public", imgPath).replace(/\\/g, "/");
  results[webPath] = base64;
  console.log(`ok ${webPath}`);
}

writeFileSync(
  "src/data/imagery-blur-hashes.json",
  JSON.stringify(results, null, 2)
);
console.log(`\nGenerated ${Object.keys(results).length} blur hashes.`);
