// A short hash of the gap-finder skill's files. record.mjs stores it with the transcript, and
// assets.mjs warns when the skill has changed since the session was recorded.
import { createHash } from "node:crypto";
import * as fs from "node:fs";
import * as path from "node:path";

export function skillHash(root) {
  const hash = createHash("sha256");
  const dir = path.join(root, "skills", "gap-finder");
  for (const file of fs.readdirSync(dir, { recursive: true }).sort()) {
    const full = path.join(dir, file);
    if (fs.statSync(full).isFile()) hash.update(file).update(fs.readFileSync(full));
  }
  return hash.digest("hex").slice(0, 16);
}
