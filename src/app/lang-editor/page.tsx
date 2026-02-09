"use client";

import UploadLang, {
  FileUploadResponse,
} from "@/components/file-upload-form-3";
import CodeEditor from "@/components/input-group-textarea-1";
import React from "react";

export default function LangEditor() {
  const [data, setData] = React.useState<FileUploadResponse>({
    filename: "none",
    data: "undefined",
    success: false,
  });

  return (
    <div className="flex min-h-screen justify-center bg-zinc-50 font-sans dark:bg-black">
      {data && data.success && (
        <CodeEditor
          title={data.filename}
          value={data.data}
          className="w-full max-w-4xl"
        />
      )}
      {!data || !data.success ? (
        <UploadLang title="Lang Editor" onSuccess={setData} />
      ) : null}
    </div>
  );
}
