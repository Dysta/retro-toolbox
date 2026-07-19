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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
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

type LangField = {
  key: string;
  value: string;
  valueStart: number;
  valueEnd: number;
  quote?: string;
};

type LangEntry = { label?: string; fields: LangField[] };

const getFields = (body: string, bodyStart: number): LangField[] => {
  const fields: LangField[] = [];
  let position = 0;

  while (position < body.length) {
    const key = body.slice(position).match(/^\s*,?\s*([\w$]+)\s*:\s*/);
    if (!key) break;

    const valueStart = bodyStart + position + key[0].length;
    let end = position + key[0].length;
    let depth = 0;
    let quote = "";

    for (; end < body.length; end++) {
      const character = body[end];
      if (quote) {
        if (character === "\\") end++;
        else if (character === quote) quote = "";
      } else if (character === '"' || character === "'") {
        quote = character;
      } else if (character === "[" || character === "(" || character === "{") {
        depth++;
      } else if (character === "]" || character === ")" || character === "}") {
        depth--;
      } else if (character === "," && depth === 0) {
        break;
      }
    }

    const rawValue = body.slice(position + key[0].length, end).trimEnd();
    const valueQuote = /^["']/.test(rawValue) ? rawValue[0] : undefined;
    fields.push({
      key: key[1],
      value: valueQuote
        ? rawValue
          .slice(1, -1)
          .replace(/\\n/g, "\n")
          .replace(/\\([\\"'])/g, "$1")
        : rawValue,
      valueStart,
      valueEnd: valueStart + rawValue.length,
      quote: valueQuote,
    });
    position = end + 1;
  }

  return fields;
};

// The extracted language files use JavaScript object literals, not strict JSON.
const getEntries = (source: string): LangEntry[] =>
  [...source.matchAll(/\{((?:[^{}"']|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')*)\}/g)].map(
    (object) => {
      const body = object[1];
      const objectStart = object.index ?? 0;
      const bodyStart = objectStart + 1;
      const label = source
        .slice(0, objectStart)
        .match(/(?:^|\n)\s*([^=\n]+?)\s*=\s*$/)?.[1]
        .trim();
      return { label, fields: getFields(body, bodyStart) };
    },
  );

const LangFields = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => {
  const entries = getEntries(value);

  const updateField = (entryIndex: number, fieldIndex: number, newValue: string) => {
    const field = getEntries(value)[entryIndex]?.fields[fieldIndex];
    if (!field) return;

    const nextRawValue = field.quote
      ? `${field.quote}${newValue
        .replace(/\\/g, "\\\\")
        .replace(/\n/g, "\\n")
        .replace(new RegExp(field.quote, "g"), `\\${field.quote}`)}${field.quote}`
      : newValue;
    onChange(
      value.slice(0, field.valueStart) + nextRawValue + value.slice(field.valueEnd),
    );
  };

  if (!entries.length) {
    return <p className="text-muted-foreground">Aucune entrée de langue détectée.</p>;
  }

  return (
    <div className="grid grid-cols-3 md:grid-cols-3 gap-4 overflow-auto p-1">
      {entries.map((entry, entryIndex) => (
        <Collapsible>
          <fieldset key={entryIndex} className="grid gap-3 rounded-lg border p-4">
            <CollapsibleTrigger>
              <legend className="px-1 text-sm font-medium">
                {entry.label || `Entrée ${entryIndex + 1}`}
              </legend>
            </CollapsibleTrigger>
            <CollapsibleContent>
              {entry.fields.map((field, fieldIndex) => (
                <label key={field.key} className="grid gap-1.5 text-sm font-medium">
                  {field.key}
                  <Input
                    value={field.value}
                    onChange={(event) => updateField(entryIndex, fieldIndex, event.target.value)}
                  />
                </label>
              ))}
            </CollapsibleContent>
          </fieldset>
        </Collapsible>
      ))}
    </div >
  );
};

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
  resetData,
  view,
  setView,
}: {
  data: FileUploadResponse;
  resetData: () => void;
  view: "simple" | "raw";
  setView: React.Dispatch<React.SetStateAction<"simple" | "raw">>;
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
              onConfirm={resetData}
              onCancel={() => { }}
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
              variant={view === "simple" ? "secondary" : "outline"}
              onClick={() => setView("simple")}
            >
              Simplifié
            </Button>

          </TooltipTrigger>
          <TooltipContent>
            <p>Voir en vue simplifiée</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant={view === "raw" ? "secondary" : "outline"}
              onClick={() => setView("raw")}
            >
              Raw
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Voir dans l'éditeur de code</p>
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
                  new Promise<{ title: string }>((resolve) =>
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

  const [view, setView] = React.useState<"simple" | "raw">("simple");

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

    return (
      <LangEditorActions
        data={data}
        resetData={resetData}
        view={view}
        setView={setView}
      />
    );
  }, [hasData, data, view]);

  return (
    <>
      {hasData && (
        <>
          {view === "simple" ? (
            <LangFields
              value={data.data}
              onChange={(newData) => setData((prev) => ({ ...prev, data: newData }))}
            />
          ) : (
            <CodeEditor
              title={data.filename}
              value={data.data}
              onChange={(newData) =>
                setData((prev) => ({ ...prev, data: newData }))
              }
              onSave={async () => {
                toast.success("Fichier sauvegardé avec succès");
              }}
            />
          )}
        </>
      )}

      {!hasData && <UploadLang title="Lang Editor" onSuccess={setData} />}
    </>
  );
}
