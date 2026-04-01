"use client";
import CodeEditor from "@/components/code-editor";
import UploadLang, { FileUploadResponse } from "@/components/file-upload-form";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useActionButtons } from "@/hooks/use-action-buttons";
import { cn, fetchApi } from "@/lib/utils";
import { ArrowDownToLine, FileText, SaveIcon } from "lucide-react";
import React from "react";
import { toast } from "sonner";

// export const metadata = {
//   title: "Lang Editor",
//   description: "Editer vos fichiers de langue Dofus Retro",
// };

async function saveFile(filename: string, data: string, path: string) {
  if (!filename || !data || !path) {
    throw new Error("Filename, data and path are required");
  }

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

const LangEditorActions = ({
  data,
  className,
}: {
  data: FileUploadResponse;
  className?: string;
}) => {
  const [saving, setSaving] = React.useState(false);

  return (
    <>
      <ButtonGroup className={className}>
        <Button
          size="sm"
          variant="outline"
          disabled={true}
          className={cn("cursor-default", className)}
        >
          <FileText />
          {data.filename}
        </Button>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              disabled={!data || !data.success}
              onClick={() => toast.success("Fichier sauvegardé avec succès")}
            >
              <SaveIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Sauvegarder vos changements</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant="default"
              disabled={!data || !data.success || saving}
              onClick={async () => {
                try {
                  setSaving(true);
                  await saveFile(data.filename, data.data, data.path);
                } catch (error) {
                  toast.error(
                    "Failed to save file. Error: " + (error as Error).message,
                  );
                } finally {
                  setSaving(false);
                }
              }}
            >
              <ArrowDownToLine />
              Télécharger
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Télécharger le fichier {data.filename}</p>
          </TooltipContent>
        </Tooltip>
      </ButtonGroup>
    </>
  );
};

export default function LangEditor() {
  const [data, setData] = React.useState<FileUploadResponse>({
    filename: "none",
    data: "undefined",
    path: "unknown",
    success: false,
  });

  const hasData = data && data.success;

  useActionButtons(() => {
    if (!hasData) return null;

    return <LangEditorActions data={data} />;
  }, [data]);

  return (
    <>
      {hasData && (
        <CodeEditor
          title={data.filename}
          value={data.data}
          onChange={(newValue, event) => {
            setData((prev) => ({ ...prev, data: newValue }));
          }}
          onSave={() => {
            // await saveFile(data.filename, data.data, data.path);
            toast.success("Fichier sauvegardé avec succès");
          }}
        />
      )}
      {!hasData ? <UploadLang title="Lang Editor" onSuccess={setData} /> : null}
    </>
  );
}
