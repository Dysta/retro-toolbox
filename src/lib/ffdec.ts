import { execFile } from "child_process";
import fs from "fs";
import path from "path";
import util from "util";

const execFileAsync = util.promisify(execFile);

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
