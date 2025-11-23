
import React, { createContext, useContext, useState, useEffect } from "react";

type EditorMode = "code" | "whiteboard";

type EditorLanguage = "java" | "python" | "cpp" | "javascript";

type EditorTheme = "dark" | "light";

type WhiteboardTool = "pen" | "rectangle" | "arrow" | "text" | "flowchart" | "eraser" | "select";

type EditorContextType = {
  mode: EditorMode;
  setMode: (mode: EditorMode) => void;
  language: EditorLanguage;
  setLanguage: (language: EditorLanguage) => void;
  code: string;
  setCode: (code: string) => void;
  theme: EditorTheme;
  setTheme: (theme: EditorTheme) => void;
  codeTemplates: Record<EditorLanguage, string>;
  selectedTool: WhiteboardTool;
  setSelectedTool: (tool: WhiteboardTool) => void;
  lineNumber: number;
  setLineNumber: (line: number) => void;
  columnNumber: number;
  setColumnNumber: (column: number) => void;
};

const defaultJavaCode = `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, CodeSphere!");
    }
}`;

const defaultPythonCode = `def main():
    print("Hello, CodeSphere!")

if __name__ == "__main__":
    main()`;

const defaultCppCode = `#include <iostream>

int main() {
    std::cout << "Hello, CodeSphere!" << std::endl;
    return 0;
}`;

const defaultJavaScriptCode = `function main() {
    console.log("Hello, CodeSphere!");
}

main();`;

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export const EditorContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setMode] = useState<EditorMode>("code");
  const [language, setLanguage] = useState<EditorLanguage>("java");
  const [code, setCode] = useState(defaultJavaCode);
  const [theme, setTheme] = useState<EditorTheme>("dark");
  const [selectedTool, setSelectedTool] = useState<WhiteboardTool>("pen");
  const [lineNumber, setLineNumber] = useState(1);
  const [columnNumber, setColumnNumber] = useState(1);

  const codeTemplates: Record<EditorLanguage, string> = {
    java: defaultJavaCode,
    python: defaultPythonCode,
    cpp: defaultCppCode,
    javascript: defaultJavaScriptCode
  };

  // When language changes, load the appropriate template if code is empty
  useEffect(() => {
    const currentCode = code.trim();
    if (currentCode === "" || 
        currentCode === defaultJavaCode || 
        currentCode === defaultPythonCode || 
        currentCode === defaultCppCode || 
        currentCode === defaultJavaScriptCode) {
      setCode(codeTemplates[language]);
    }
  }, [language]);

  return (
    <EditorContext.Provider value={{ 
      mode, 
      setMode, 
      language, 
      setLanguage, 
      code, 
      setCode, 
      theme,
      setTheme,
      codeTemplates,
      selectedTool,
      setSelectedTool,
      lineNumber,
      setLineNumber,
      columnNumber,
      setColumnNumber
    }}>
      {children}
    </EditorContext.Provider>
  );
};

export const useEditorContext = () => {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error("useEditorContext must be used within an EditorContextProvider");
  }
  return context;
};
