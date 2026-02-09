import { extractScriptsFromSWF } from "@/lib/ffdec";
import { createTempDir, validateSWF } from "@/lib/files";
import fs from "fs";
import path from "path";

export async function GET(req: Request) {
  return new Response("Lang Editor API is running", { status: 200 });
}

export interface LangEditorResponse {
  filename?: string;
  data?: string;
  path?: string;
}

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file || !(file instanceof File)) {
    return new Response("No file uploaded", { status: 400 });
  }

  if (!validateSWF(file)) {
    return new Response("Invalid file type or size", { status: 400 });
  }

  const workdir = createTempDir("lang-editor");
  const filePath = path.join(workdir, file.name);
  const outputPath = path.join(workdir, "output");
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.promises.writeFile(filePath, buffer);

  const script = await extractScriptsFromSWF(filePath);

  const responseData: LangEditorResponse = {
    filename: file.name,
    data: script,
    path: outputPath,
  };

  return new Response(JSON.stringify(responseData), {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}
