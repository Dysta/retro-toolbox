"use client";
import CodeEditor from "@/components/code-editor";
import UploadLang, { FileUploadResponse } from "@/components/file-upload-form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useActionButtons } from "@/hooks/use-action-buttons";
import { fetchApi } from "@/lib/utils";
import { ArrowDownToLine, FileText, RefreshCcw, SaveIcon } from "lucide-react";
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

const AlertDialogDelete = ({
  children,
  onConfirm,
  onCancel,
}: {
  children: React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent size="default">
        <AlertDialogTitle>Importer un nouveau fichier ?</AlertDialogTitle>
        <AlertDialogDescription>
          Toutes les données du fichier seront perdues. Cette action est
          irréversible.
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline" onClick={onCancel}>
            Annuler
          </AlertDialogCancel>
          <AlertDialogAction variant="secondary" onClick={onConfirm}>
            Importer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const LangEditorActions = ({
  data,
  setData,
  className,
}: {
  data: FileUploadResponse;
  setData: React.Dispatch<React.SetStateAction<FileUploadResponse>>;
  className?: string;
}) => {
  const [saving, setSaving] = React.useState(false);

  return (
    <>
      <ButtonGroup>
        <Button
          size="sm"
          variant="outline"
          // disabled={true}
          className="cursor-default"
        >
          <FileText />
          {data.filename}
        </Button>
        <Tooltip>
          <TooltipTrigger asChild>
            <AlertDialogDelete
              onConfirm={() => setData({} as FileUploadResponse)}
              onCancel={() => {}}
            >
              <Button
                size="sm"
                variant="secondary"
                disabled={saving || !data || !data.success}
              >
                <RefreshCcw />
              </Button>
            </AlertDialogDelete>
          </TooltipTrigger>
          <TooltipContent>
            <p>Importer un nouveau fichier</p>
          </TooltipContent>
        </Tooltip>
      </ButtonGroup>

      <Separator
        orientation="vertical"
        className="hidden data-[orientation=vertical]:h-4 md:block"
      />
      <ButtonGroup>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              disabled={saving || !data || !data.success}
              onClick={() => {
                setSaving(true);
                toast.promise<{ title: string }>(
                  () =>
                    new Promise((resolve) =>
                      setTimeout(() => resolve({ title: data.filename }), 1500),
                    ).finally(() => setSaving(false)),
                  {
                    loading: "Sauvegarde...",
                    success: (data) => `${data.title} a été sauvegardé`,
                    error: "Error",
                  },
                );
              }}
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
              onClick={() => {
                setSaving(true);
                toast.promise(
                  saveFile(data.filename, data.data, data.path)
                    .then(() => ({
                      title: data.filename,
                    }))
                    .finally(() => setSaving(false)),
                  {
                    loading: "Préparation du fichier en cours...",
                    success: (data) => `${data.title} est prêt`,
                    error: "Erreur",
                  },
                );
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
  const resetData = () =>
    setData({
      filename: "none",
      data: "undefined",
      path: "unknown",
      success: false,
    });

  const hasData = data && data.success;

  useActionButtons(() => {
    if (!hasData) return null;

    return <LangEditorActions data={data} setData={resetData} />;
  }, [hasData, data]);

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
            setData((prev) => ({ ...prev, data: prev.data }));
            toast.success("Fichier sauvegardé avec succès");
          }}
        />
      )}

      {!hasData && <UploadLang title="Lang Editor" onSuccess={setData} />}
    </>
  );
}
