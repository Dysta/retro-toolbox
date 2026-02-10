import { execFile } from "child_process";
import fs from "fs";
import path from "path";
import util from "util";

const execFileAsync = util.promisify(execFile);
const MAX_LINE_PER_FILE = 423;

export async function extractScriptsFromSWF(filePath: string): Promise<string> {
  const workDir = path.dirname(filePath);
  const scriptsDir = path.join(workDir, "scripts", "frame_1");

  await execFileAsync("ffdec", ["-export", "script", ".", filePath], {
    cwd: workDir,
  });

  const files = await fs.promises.readdir(scriptsDir);
  const doActionFiles = files
    .filter((f) => f.startsWith("DoAction"))
    .sort((a, b) => {
      // premier fichier DoAction.as
      if (a === "DoAction.as") return -1;
      if (b === "DoAction.as") return 1;

      // ensuite DoAction_XX.as dans l’ordre numérique
      const numA = parseInt(a.match(/DoAction_(\d+)\.as/)?.[1] || "0");
      const numB = parseInt(b.match(/DoAction_(\d+)\.as/)?.[1] || "0");
      return numA - numB;
    });

  let result = "";
  for (const f of doActionFiles) {
    const content = await fs.promises.readFile(
      path.join(scriptsDir, f),
      "utf-8",
    );
    result += content + "\n";
  }

  return result;
}

export async function importScriptsToSWF(
  filename: string,
  originalFilePath: string,
  modifiedScript: string,
): Promise<string> {
  const workDir = path.join(originalFilePath);
  const scriptsDir = path.join(workDir, "scripts", "frame_1");

  const outputFilename = `edited_${filename}`;

  console.log("Importing modified script into SWF with ffdec", {
    filename,
    originalFilePath,
    modifiedScriptLength: modifiedScript.length,
    outputFilename,
  });

  // Split modifiedScript into multiple DoAction_XX.as files
  const lines = modifiedScript.split("\n");
  let fileIndex = 0;
  for (let i = 0; i < lines.length; i += MAX_LINE_PER_FILE) {
    const chunk = lines.slice(i, i + MAX_LINE_PER_FILE).join("\n");
    const fileName =
      fileIndex === 0 ? "DoAction.as" : `DoAction_${fileIndex}.as`;
    await fs.promises.writeFile(
      path.join(scriptsDir, fileName),
      chunk,
      "utf-8",
    );
    fileIndex++;
  }

  // Use ffdec to import the modified scripts into a new SWF
  await execFileAsync(
    "ffdec",
    ["-importScript", filename, outputFilename, workDir],
    {
      cwd: workDir,
    },
  );

  return path.join(workDir, outputFilename);
}
