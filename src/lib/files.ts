import { randomBytes } from "crypto";
import fs from "fs";
import os from "os";
import path from "path";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export function validateSWF(file: File): boolean {
  const validTypes = [
    "application/x-shockwave-flash",
    "application/octet-stream",
  ];
  if (!validTypes.includes(file.type)) {
    return false;
  }
  const validExtensions = ".swf";
  if (!file.name.toLowerCase().endsWith(validExtensions)) {
    return false;
  }

  if (file.size > MAX_FILE_SIZE) {
    return false;
  }

  return true;
}

export function createTempDir(infix: string): string {
  const randomSuffix = randomBytes(8).toString("hex");
  const tmpDir = fs.mkdtempSync(
    path.join(os.tmpdir(), infix + "-" + randomSuffix),
  );

  return tmpDir;
}
