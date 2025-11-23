import { useEffect, useRef, useState } from "react";
import { useEditorContext } from "@/contexts/EditorContext";
import { useCollaborationContext } from "@/contexts/CollaborationContext";
import { useUserContext } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { toast } from "sonner";
import CodeLine from "./CodeLine";

export default function CodeEditor() {
  const { 
    code, 
    setCode, 
    language,
    lineNumber, 
    setLineNumber, 
    columnNumber, 
    setColumnNumber 
  } = useEditorContext();
  const { updateUserPosition } = useCollaborationContext();
  const editorRef = useRef<HTMLDivElement>(null);
  const [lines, setLines] = useState<string[]>([]);
  const [output, setOutput] = useState<string>("");
  const [isRunning, setIsRunning] = useState(false);

  // Split code into lines whenever code changes
  useEffect(() => {
    const newLines = code.split("\n");
    setLines(newLines);
  }, [code]);

  // Update cursor position and notify collaborators
  const handleCursorChange = (lineIdx: number, colIdx: number) => {
    setLineNumber(lineIdx + 1);
    setColumnNumber(colIdx + 1);
    updateUserPosition(lineIdx + 1, colIdx + 1);
  };

  // Handle key press in editor
  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation();
    
    if (e.key === "Tab") {
      e.preventDefault();
      // Insert 4 spaces at cursor position
      const newCode = insertAtCursor(code, "    ");
      setCode(newCode);
    } else if (e.key === "Enter") {
      e.preventDefault();
      // Add new line at cursor position
      const newCode = insertAtCursor(code, "\n");
      setCode(newCode);
      setLineNumber(lineNumber + 1);
      setColumnNumber(1);
    } else if (e.key === "Backspace") {
      e.preventDefault();
      // Handle backspace - delete character before cursor or join lines
      if (columnNumber > 1) {
        // Delete character before cursor
        const lines = code.split("\n");
        const currentLine = lines[lineNumber - 1];
        const newLine = currentLine.substring(0, columnNumber - 2) + currentLine.substring(columnNumber - 1);
        lines[lineNumber - 1] = newLine;
        setCode(lines.join("\n"));
        setColumnNumber(columnNumber - 1);
      } else if (lineNumber > 1) {
        // Join with previous line
        const lines = code.split("\n");
        const previousLine = lines[lineNumber - 2];
        const currentLine = lines[lineNumber - 1];
        const newPreviousLine = previousLine + currentLine;
        
        lines.splice(lineNumber - 2, 2, newPreviousLine);
        setCode(lines.join("\n"));
        setLineNumber(lineNumber - 1);
        setColumnNumber(previousLine.length + 1);
      }
    } else if (e.key.length === 1) {
      // Insert character at cursor position
      const newCode = insertAtCursor(code, e.key);
      setCode(newCode);
      setColumnNumber(columnNumber + 1);
    } else if (e.key === "ArrowLeft") {
      if (columnNumber > 1) {
        setColumnNumber(columnNumber - 1);
      } else if (lineNumber > 1) {
        setLineNumber(lineNumber - 1);
        const previousLine = code.split("\n")[lineNumber - 2];
        setColumnNumber(previousLine.length + 1);
      }
    } else if (e.key === "ArrowRight") {
      const currentLine = code.split("\n")[lineNumber - 1];
      if (columnNumber <= currentLine.length) {
        setColumnNumber(columnNumber + 1);
      } else if (lineNumber < lines.length) {
        setLineNumber(lineNumber + 1);
        setColumnNumber(1);
      }
    } else if (e.key === "ArrowUp" && lineNumber > 1) {
      setLineNumber(lineNumber - 1);
      const targetLine = code.split("\n")[lineNumber - 2];
      setColumnNumber(Math.min(columnNumber, targetLine.length + 1));
    } else if (e.key === "ArrowDown" && lineNumber < lines.length) {
      setLineNumber(lineNumber + 1);
      const targetLine = code.split("\n")[lineNumber];
      setColumnNumber(Math.min(columnNumber, targetLine.length + 1));
    }
    
    // Update collaborator position
    updateUserPosition(lineNumber, columnNumber);
  };

  // Insert text at cursor position
  const insertAtCursor = (text: string, insertion: string): string => {
    const lines = text.split("\n");
    
    if (insertion === "\n") {
      const currentLine = lines[lineNumber - 1];
      const before = currentLine.substring(0, columnNumber - 1);
      const after = currentLine.substring(columnNumber - 1);
      lines[lineNumber - 1] = before;
      lines.splice(lineNumber, 0, after);
    } else {
      const currentLine = lines[lineNumber - 1];
      const before = currentLine.substring(0, columnNumber - 1);
      const after = currentLine.substring(columnNumber - 1);
      lines[lineNumber - 1] = before + insertion + after;
    }
    
    return lines.join("\n");
  };

  // Simulate output for boilerplate and sum code
  const simulateOutput = (code: string, language: string): string => {
    // Java
    if (language === "java") {
      if (code.includes("System.out.println(2 + 3)")) return "5";
      if (code.includes("System.out.println(\"Hello, CodeSphere!\")")) return "Hello, CodeSphere!";
      if (code.includes("System.out.println")) {
        const match = code.match(/System\.out\.println\((['"]?)(.*?)\1\)/);
        if (match) return match[2];
      }
      return "(Simulated) Java code executed.";
    }
    // Python
    if (language === "python") {
      if (code.includes("print(2 + 3)")) return "5";
      if (code.includes("print(\"Hello, CodeSphere!\")")) return "Hello, CodeSphere!";
      if (code.includes("print")) {
        const match = code.match(/print\((['"]?)(.*?)\1\)/);
        if (match) return match[2];
      }
      return "(Simulated) Python code executed.";
    }
    // C++
    if (language === "cpp") {
      if (code.includes("cout << 2 + 3")) return "5";
      if (code.includes("cout << \"Hello, CodeSphere!\"")) return "Hello, CodeSphere!";
      if (code.includes("cout")) {
        const match = code.match(/cout\s*<<\s*(["']?)(.*?)\1/);
        if (match) return match[2];
      }
      return "(Simulated) C++ code executed.";
    }
    // JavaScript
    if (language === "javascript") {
      if (code.includes("console.log(2 + 3)")) return "5";
      if (code.includes("console.log(\"Hello, CodeSphere!\")")) return "Hello, CodeSphere!";
      if (code.includes("console.log")) {
        const match = code.match(/console\.log\((['"]?)(.*?)\1\)/);
        if (match) return match[2];
      }
      return "(Simulated) JavaScript code executed.";
    }
    return "(Simulated) No output.";
  };

  // Real code execution using backend API (disabled for demo)
  const runCode = async () => {
    setIsRunning(true);
    setOutput("");
    // Simulate output for demo
    setTimeout(() => {
      setOutput(simulateOutput(code, language));
      setIsRunning(false);
    }, 400);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center bg-editor-activeLineBackground p-2 border-b border-border mb-1">
        <div className="text-sm text-muted-foreground">
          Line {lineNumber}, Column {columnNumber}
        </div>
        <Button onClick={runCode} disabled={isRunning} size="sm" className="bg-codeSphere-blue-primary hover:bg-codeSphere-blue-dark">
          <Play className="w-4 h-4 mr-2" /> Run
        </Button>
      </div>
      
      <div 
        className="flex-grow overflow-auto bg-editor-background font-mono text-sm p-2"
        ref={editorRef}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        style={{ outline: "none" }}
      >
        {lines.map((line, i) => (
          <CodeLine 
            key={i} 
            lineNum={i + 1} 
            content={line} 
            isActive={i + 1 === lineNumber} 
            onCursorChange={(colIdx) => handleCursorChange(i, colIdx)}
          />
        ))}
      </div>
      
      {output && (
        <div className="bg-black text-green-400 p-2 font-mono text-sm h-32 overflow-auto border-t border-border">
          <div className="mb-1 text-muted-foreground">Output:</div>
          <pre className="whitespace-pre-wrap">{output}</pre>
        </div>
      )}
    </div>
  );
}
