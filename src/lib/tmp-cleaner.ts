import fs from "fs";
import path from "path";

const MAX_AGE_MS = 3 * 60 * 60 * 1000; // 3h
const INTERVAL_MS = 1 * 60 * 1000; // 10min
let isCleaning = false;

export function startTmpCleaner() {
  setInterval(tmpCleanerTask, INTERVAL_MS);
  console.log("tmp cleaner started");
}

export async function tmpCleanerTask() {
  if (isCleaning) return;
  isCleaning = true;

  try {
    const now = Date.now();
    const entries = await fs.promises.readdir("/tmp");

    for (const folder in entries) {
      const fullPath = path.join("/tmp", folder);
      if (!fullPath.startsWith("/tmp/lang-editor")) continue;

      console.debug(`attempt to clean ${fullPath}`);

      const stats = await fs.promises.stat(fullPath);
      if (!stats.isDirectory()) continue; // should always be true but in case

      const age = now - stats.mtimeMs;
      if (age < MAX_AGE_MS) continue;

      await fs.promises.rm(fullPath, { recursive: true, force: true });

      console.debug(`successfully cleaned folder ${fullPath}`);
    }
  } finally {
    isCleaning = false;
  }
}
