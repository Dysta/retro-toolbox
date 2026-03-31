import Editor from "@monaco-editor/react";

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
  function onMount(editor, monaco) {
    editorRef.current = editor;
  }

  return (
    <Editor
      defaultLanguage="javascript"
      defaultValue={value}
      onMount={onMount}
      onChange={onChange}
      className={className}
    />
  );
};

export default CodeEditor;
