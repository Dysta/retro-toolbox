"use client";

import CodeEditor from "@/components/code-editor";
import UploadLang, { FileUploadResponse } from "@/components/file-upload-form";
import { fetchApi } from "@/lib/utils";
import React from "react";

// export const metadata = {
//   title: "Lang Editor",
//   description: "Editer vos fichiers de langue Dofus Retro",
// };

async function saveFile(filename: string, data: string, path: string) {
  const dataFile = new Blob([data], { type: "text/plain" });

  const formData = new FormData();
  formData.append("file", dataFile, filename);
  formData.append("filename", filename);
  formData.append("path", path);

  const res = await fetchApi("/api/lang-editor", {
    method: "PATCH",
    body: formData,
  });
  if (!res.ok) {
    throw new Error("Failed to save file");
  }

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default function LangEditor() {
  const [data, setData] = React.useState<FileUploadResponse>({
    filename: "none",
    data: "undefined",
    path: "unknown",
    success: false,
  });

  return (
    <>
      {data && data.success && (
        <CodeEditor
          title={data.filename}
          value={data.data}
          onChange={(newValue, event) =>
            setData((prev) => ({ ...prev, data: newValue }))
          }
          onSave={async () => {
            await saveFile(data.filename, data.data, data.path);
          }}
          // className="w-full max-w-5xl"
        />
        // <Editor
        //   defaultLanguage="javascript"
        //   defaultValue={data.data}
        //   onMount={handleEditorDidMount}
        // />
      )}
      {!data || !data.success ? (
        <UploadLang title="Lang Editor" onSuccess={setData} />
      ) : null}
    </>
  );
}
