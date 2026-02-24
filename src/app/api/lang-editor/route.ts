import { extractScriptsFromSWF, importScriptsToSWF } from "@/lib/ffdec";
import { createTempDir, validateSWF } from "@/lib/files";
import { secureRoute } from "@/lib/rate-limit";
import { startTmpCleaner } from "@/lib/tmp-cleaner";
import fs from "fs";
import path from "path";

if (!(global as any).__tmpCleanerStarted) {
  startTmpCleaner();
  (global as any).__tmpCleanerStarted = true;
}

export interface LangEditorResponse {
  filename: string;
  data: string;
  path: string;
}

export interface LangEditorUpdateRequest {
  filename: string;
  data: Blob;
  path: string;
}

export async function GET(req: Request) {
  return new Response("Lang Editor API is running", { status: 200 });
}

export async function POST(req: Request) {
  return await secureRoute(req, async () => {
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

    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.promises.writeFile(filePath, buffer);

    const script = await extractScriptsFromSWF(filePath);

    const responseData: LangEditorResponse = {
      filename: file.name,
      data: script,
      path: workdir,
    };

    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    });
  });
}

export async function PATCH(req: Request) {
  return await secureRoute(req, async () => {
    const formData = await req.formData();

    const file = formData.get("file") as File;
    const filename = formData.get("filename") as string;
    const path = formData.get("path") as string;

    if (!file || !(file instanceof File) || !filename || !path) {
      return new Response("Missing required fields", { status: 400 });
    }

    const data = await file.text();

    console.log("Received PATCH request with data:", { filename, path });
    const outputFile = await importScriptsToSWF(filename, path, data);
    const fileBuffer = await fs.promises.readFile(outputFile);

    return new Response(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/x-shockwave-flash",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  });
}
