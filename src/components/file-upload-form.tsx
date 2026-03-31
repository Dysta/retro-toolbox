"use client";

import { Upload, X } from "lucide-react";
import * as React from "react";

import { LangEditorResponse } from "@/app/api/lang-editor/route";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
  FileUploadTrigger,
} from "@/components/diceui/file-upload";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { fetchApi } from "@/lib/utils";

export const title = "Required File Upload";

interface UploadLangProps {
  title?: string;
  maxFiles?: number;
  className?: string;
  onSuccess?: (data: FileUploadResponse) => void;
}

export interface FileUploadResponse {
  success: boolean;
  filename: string;
  data: string;
  path: string;
}

const UploadLang = ({
  title,
  maxFiles = 1,
  className,
  onSuccess,
}: UploadLangProps) => {
  const [files, setFiles] = React.useState<File[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState<string>("");

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    if (files.length !== maxFiles) {
      setError(`Please upload exactly ${maxFiles} file(s)`);
      return;
    }

    setError(null);
    console.log("Submitted files:", files);
    setLoading(true);

    const formData = new FormData();
    files.forEach((file) => formData.append("file", file));
    const res = await fetchApi("/api/lang-editor", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      const json: LangEditorResponse = await res.json();
      setData(json.data || "");
      onSuccess?.({
        filename: json.filename,
        data: json.data,
        path: json.path,
        success: true,
      });
    } else {
      setError(`Upload failed: ${res.statusText}`);
      onSuccess?.({
        filename: "unknown",
        data: "none",
        path: "unknown",
        success: false,
      });
    }
    setLoading(false);
  };

  const handleFilesChange = (newFiles: File[]) => {
    setFiles(newFiles);
    if (newFiles.length > 0) {
      setError(null);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`w-full max-w-md space-y-4 p-4 ${className}`}
    >
      <div className="space-y-2">
        <Label>
          Upload your lang file <span className="text-destructive">*</span>
        </Label>
        <FileUpload
          value={files}
          onValueChange={handleFilesChange}
          maxFiles={1}
          maxSize={5 * 1024 * 1024}
          accept=".swf"
        >
          {files.length === 0 ? (
            <FileUploadDropzone className={error ? "border-destructive" : ""}>
              <div className="flex flex-col items-center gap-1 text-center">
                <div className="flex items-center justify-center rounded-full border p-2.5">
                  <Upload className="size-6 text-muted-foreground" />
                </div>
                <p className="font-medium text-sm">Upload required document</p>
                <p className="text-muted-foreground text-xs">SWF</p>
              </div>
              <FileUploadTrigger asChild>
                <Button variant="outline" size="sm" className="mt-2">
                  Select lang file
                </Button>
              </FileUploadTrigger>
            </FileUploadDropzone>
          ) : (
            <FileUploadList>
              {files.map((file, index) => (
                <FileUploadItem key={index} value={file}>
                  <FileUploadItemPreview />
                  <FileUploadItemMetadata />
                  <FileUploadItemDelete asChild>
                    <Button variant="ghost" size="icon" className="size-7">
                      <X className="size-4" />
                    </Button>
                  </FileUploadItemDelete>
                </FileUploadItem>
              ))}
            </FileUploadList>
          )}
        </FileUpload>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
      <Button
        type="submit"
        className="w-full"
        disabled={files.length !== maxFiles || loading}
      >
        {loading ? "Uploading..." : "Submit"}
      </Button>
    </form>
  );
};

export default UploadLang;
