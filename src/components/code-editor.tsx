import Editor from "@monaco-editor/react";
import { useTheme } from "next-themes";

import React from "react";

interface CodeEditorProps {
  title: string;
  value: string;
  onChange: (newValue: any, event: any) => void;
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
        if (isSaving) return;

        setIsSaving(true);
        e.preventDefault();
        onSave();
        setIsSaving(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onSave]);

  const editorRef = React.useRef(null);
  function onMount(editor: any, monaco: any) {
    editorRef.current = editor;
  }

  const { theme, resolvedTheme } = useTheme();
  const isDark = theme === "dark" || resolvedTheme === "dark";
  const editorTheme = isDark ? "vs-dark" : "light";

  return (
    <Editor
      defaultLanguage="javascript"
      defaultValue="No script loaded"
      value={value}
      onMount={onMount}
      onChange={onChange}
      className={className}
      theme={editorTheme}
    />
  );
};

export default CodeEditor;
