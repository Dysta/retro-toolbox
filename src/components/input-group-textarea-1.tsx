import { ArrowDownToLine, FileCodeIcon } from "lucide-react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";

interface CodeEditorProps {
  title?: string;
  value?: string;
  className?: string;
}

const CodeEditor = ({ title, value, className }: CodeEditorProps) => (
  <InputGroup className={`bg-background ${className}`}>
    <InputGroupTextarea className="min-h-[200px]" defaultValue={value || ""} />
    <InputGroupAddon align="block-end" className="border-t">
      <InputGroupText>Line {value?.split("\n").length || 1}</InputGroupText>
      <InputGroupButton className="ml-auto" size="sm" variant="default">
        Save
        <ArrowDownToLine />
      </InputGroupButton>
    </InputGroupAddon>
    <InputGroupAddon align="block-start" className="border-b">
      <InputGroupText className="font-mono font-medium">
        <FileCodeIcon />
        {title || "Output"}
      </InputGroupText>
    </InputGroupAddon>
  </InputGroup>
);

export default CodeEditor;
