import { ArrowDownToLine, FileCodeIcon } from "lucide-react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import React from "react";

interface CodeEditorProps {
  title: string;
  value: string;
  onChange: (newValue: string) => void;
  onSave: () => Promise<void>;
  className?: string;
}

const CodeEditor = ({
  title,
  value,
  onChange,
  onSave,
  className,
}: CodeEditorProps) => {
  const [isSaving, setIsSaving] = React.useState(false);
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        onSave();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onSave]);

  return (
    <InputGroup className={`bg-background ${className}`}>
      <InputGroupTextarea
        className="min-h-[72dvh] overflow-auto"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
        }}
      />
      <InputGroupAddon align="block-end" className="border-t">
        <InputGroupText>Line {value.split("\n").length || -1}</InputGroupText>
        <InputGroupButton
          className="ml-auto"
          size="sm"
          variant="default"
          disabled={isSaving}
          onClick={async () => {
            if (isSaving) return;
            try {
              setIsSaving(true);
              await onSave();
            } finally {
              setIsSaving(false);
            }
          }}
        >
          Télécharger
          <ArrowDownToLine />
        </InputGroupButton>
      </InputGroupAddon>
      <InputGroupAddon align="block-start" className="border-b">
        <InputGroupText className="font-mono font-medium">
          <FileCodeIcon />
          {title || "Output"}
        </InputGroupText>
        {/* <InputGroupButton className="ml-auto" size="icon-xs">
          <RefreshCwIcon />
        </InputGroupButton> */}
      </InputGroupAddon>
    </InputGroup>
  );
};

export default CodeEditor;
