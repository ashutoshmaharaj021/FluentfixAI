import { useEffect, useState } from "react";
import {
  Sparkles,
  FileText,
  History,
  Settings,
  Wand2,
  Loader2,
  Copy,
  Check,
  Trash2,
} from "lucide-react";
import api from "../services/api";
import jsPDF from "jspdf";

function Workspace() {
  const [text, setText] = useState("");
  const [mode, setMode] = useState("all");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saveStatus, setSaveStatus] = useState("Saved");
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("fluentfix-history");
    return saved ? JSON.parse(saved) : [];
  });
  const [currentDocId, setCurrentDocId] = useState(null);
  const [documentCount, setDocumentCount] = useState(() => {
    const saved = localStorage.getItem("fluentfix-document-count");
    return saved ? parseInt(saved, 10) : 1;
  });
  const [editingDocId, setEditingDocId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");

  const handleCorrection = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setError("");

    try {
      const response = await api.post("/corrections/", { text, mode });
      setResult(response.data);

      const updatedHistory = history.map((doc) =>
        doc.id === currentDocId
          ? {
              ...doc,
              original: response.data.original,
              corrected: response.data.corrected,
              result: response.data,
              timestamp: new Date().toLocaleString(),
            }
          : doc,
      );

      setHistory(updatedHistory);
      localStorage.setItem("fluentfix-history", JSON.stringify(updatedHistory));
    } catch (err) {
      console.error(err);
      setError("Failed to connect to the backend.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!result?.corrected) return;

    try {
      await navigator.clipboard.writeText(result.corrected);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  const handleExportTxt = () => {
    if (!result) return;

    const content = `FluentFix AI Correction\n\nOriginal:\n${result.original}\n\nSpelling:\n${result.spelling}\n\nGrammar:\n${result.grammar}\n\nFluency:\n${result.fluency}\n\nFinal Corrected Text:\n${result.corrected}\n\nConfidence:\n${Math.round(
      result.confidence * 100
    )}%\n`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "fluentfix-correction.txt";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
    if (!result) return;

    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("FluentFix AI Correction Report", 20, 20);

    doc.setFontSize(12);
    let y = 35;

    const addSection = (title, content) => {
      doc.setFont(undefined, "bold");
      doc.text(title, 20, y);
      y += 8;

      doc.setFont(undefined, "normal");
      const lines = doc.splitTextToSize(content || "", 170);
      doc.text(lines, 20, y);
      y += lines.length * 7 + 6;
    };

    addSection("Original", result.original);
    addSection("Spelling", result.spelling);
    addSection("Grammar", result.grammar);
    addSection("Fluency", result.fluency);
    addSection("Final Corrected Text", result.corrected);
    addSection("Confidence", `${Math.round(result.confidence * 100)}%`);

    doc.save("fluentfix-correction.pdf");
  };

  const handleNewDocument = () => {
    const newId = Date.now();
    const title =
      documentCount === 1 ? "Untitled Document" : `Untitled ${documentCount}`;

    const newDocument = {
      id: newId,
      title,
      original: "",
      corrected: "",
      result: null,
      timestamp: new Date().toLocaleString(),
    };

    const updatedHistory = [newDocument, ...history];
    setHistory(updatedHistory);
    localStorage.setItem("fluentfix-history", JSON.stringify(updatedHistory));
    setText("");
    setResult(null);
    setError("");
    setCopied(false);
    setCurrentDocId(newId);
    localStorage.setItem("fluentfix-current-doc", String(newId));

    const newCount = documentCount + 1;
    setDocumentCount(newCount);
    localStorage.setItem("fluentfix-document-count", newCount.toString());
  };

  const handleRenameDocument = (docId) => {
    const newTitle = editingTitle.trim();
    if (!newTitle) {
      setEditingDocId(null);
      setEditingTitle("");
      return;
    }

    const updatedHistory = history.map((doc) =>
      doc.id === docId ? { ...doc, title: newTitle } : doc,
    );

    setHistory(updatedHistory);
    localStorage.setItem("fluentfix-history", JSON.stringify(updatedHistory));
    setEditingDocId(null);
    setEditingTitle("");
  };

  const handleDeleteDocument = (docId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this document?",
    );
    if (!confirmDelete) return;

    const updatedHistory = history.filter((doc) => doc.id !== docId);
    setHistory(updatedHistory);
    localStorage.setItem("fluentfix-history", JSON.stringify(updatedHistory));

    if (currentDocId === docId) {
      if (updatedHistory.length > 0) {
        const nextDoc = updatedHistory[0];
        setCurrentDocId(nextDoc.id);
        setText(nextDoc.original || "");
        setResult(nextDoc.result || null);
      } else {
        setCurrentDocId(null);
        setText("");
        setResult(null);
      }
    }
  };

  useEffect(() => {
    if (!currentDocId) return;

    setSaveStatus("Saving...");

    const timer = setTimeout(() => {
      const updatedHistory = history.map((doc) =>
        doc.id === currentDocId
          ? { ...doc, original: text, timestamp: new Date().toLocaleString() }
          : doc,
      );

      setHistory(updatedHistory);
      localStorage.setItem("fluentfix-history", JSON.stringify(updatedHistory));
      setSaveStatus("Saved");
    }, 600);

    return () => clearTimeout(timer);
  }, [text, currentDocId]);

  useEffect(() => {
    if (history.length === 0) {
      const firstDoc = {
        id: Date.now(),
        title: "Untitled Document",
        original: "",
        corrected: "",
        result: null,
        timestamp: new Date().toLocaleString(),
      };

      setHistory([firstDoc]);
      setCurrentDocId(firstDoc.id);
      localStorage.setItem("fluentfix-history", JSON.stringify([firstDoc]));
      localStorage.setItem("fluentfix-current-doc", String(firstDoc.id));
      return;
    }

    const savedCurrentDocId = Number(localStorage.getItem("fluentfix-current-doc"));
    const activeDoc = history.find((doc) => doc.id === savedCurrentDocId) || history[0];

    setCurrentDocId(activeDoc.id);
    setText(activeDoc.original || "");
    setResult(activeDoc.result || null);
  }, []);

  useEffect(() => {
    if (currentDocId) {
      localStorage.setItem("fluentfix-current-doc", String(currentDocId));
    }
  }, [currentDocId]);

  return (
    <div className="min-h-screen bg-[#060B16] text-white flex">
      <aside className="w-64 border-r border-white/10 bg-[#0B1220] p-6 hidden md:flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-cyan-500 flex items-center justify-center">
              <Sparkles size={18} />
            </div>
            <h1 className="text-xl font-bold">
              FluentFix <span className="text-cyan-400">AI</span>
            </h1>
          </div>

          <button
            onClick={handleNewDocument}
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-semibold rounded-xl py-3 mb-8 transition"
          >
            + New Document
          </button>

          <div className="space-y-3 text-slate-300">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
              <FileText size={18} />
              <span>Current Draft</span>
            </div>

            <div className="mt-6">
              <div className="flex items-center gap-2 mb-3 text-slate-400">
                <History size={16} />
                <span className="text-sm font-medium">Documents</span>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {history.length === 0 ? (
                  <p className="text-xs text-slate-500">No documents yet</p>
                ) : (
                  history.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        if (editingDocId !== null) return;
                        setCurrentDocId(item.id);
                        localStorage.setItem("fluentfix-current-doc", String(item.id));
                        setText(item.original || "");
                        setResult(item.result || null);
                      }}
                      className={`w-full text-left p-3 rounded-lg border transition cursor-pointer ${
                        currentDocId === item.id
                          ? "border-cyan-500 bg-cyan-500/10"
                          : "border-white/10 hover:bg-white/5"
                      }`}
                    >
                      {editingDocId === item.id ? (
                        <input
                          value={editingTitle}
                          onChange={(e) => setEditingTitle(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          onDoubleClick={(e) => e.stopPropagation()}
                          onBlur={() => handleRenameDocument(item.id)}
                          onKeyDown={(e) => {
                            e.stopPropagation();
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleRenameDocument(item.id);
                            }
                            if (e.key === "Escape") {
                              setEditingDocId(null);
                              setEditingTitle("");
                            }
                          }}
                          autoFocus
                          className="w-full bg-transparent text-sm text-slate-200 outline-none border-b border-cyan-500"
                        />
                      ) : (
                        <div className="flex items-start justify-between gap-2 group">
                          <div
                            className="flex-1 cursor-text"
                            onDoubleClick={(e) => {
                              e.stopPropagation();
                              setEditingDocId(item.id);
                              setEditingTitle(item.title);
                            }}
                          >
                            <p className="text-sm text-slate-200 truncate">{item.title}</p>
                            <p className="text-xs text-slate-500 mt-1">{item.timestamp}</p>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteDocument(item.id);
                            }}
                            className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/20 transition"
                          >
                            <Trash2 size={16} className="text-red-400" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}

                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 cursor-pointer">
                  <Settings size={18} />
                  <span>Settings</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-500">FluentFix AI Workspace</p>
      </aside>

      <main className="flex-1 flex flex-col">
        <div className="h-16 border-b border-white/10 flex items-center justify-between px-8 bg-[#060B16]">
          <div>
            <h2 className="text-lg font-semibold">AI Writing Workspace</h2>

            <div className="flex items-center gap-3 mt-1">
              <p className="text-xs text-slate-400">Improve grammar, spelling, and fluency</p>

              <div className="flex items-center gap-1 text-xs">
                {saveStatus === "Saving..." ? (
                  <>
                    <Loader2 size={12} className="animate-spin text-cyan-400" />
                    <span className="text-cyan-400">Saving...</span>
                  </>
                ) : (
                  <>
                    <Check size={12} className="text-green-400" />
                    <span className="text-green-400">Saved</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={handleExportPDF}
            disabled={!result}
            className="bg-white/5 border border-white/10 px-4 py-2 rounded-lg hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            Export
          </button>
        </div>

        <div className="flex-1 p-8 overflow-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-[#0B1220] border border-white/10 rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-2">Input Text</h3>
              <p className="text-sm text-slate-400 mb-4">Paste or type your text here.</p>

              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Start writing here..."
                className="w-full h-[420px] bg-transparent border border-white/10 rounded-xl p-4 text-slate-200 placeholder:text-slate-500 outline-none resize-none"
              />

              <div className="mt-4 flex justify-between text-sm text-slate-400">
                <span>{text.length} characters</span>
                <button
                  onClick={() => {
                    setText("");
                    setResult(null);
                    setError("");
                  }}
                  className="text-cyan-400 hover:text-cyan-300"
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="bg-[#0B1220] border border-white/10 rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-2">Corrected Output</h3>
              <p className="text-sm text-slate-400 mb-4">AI suggestions will appear here.</p>

              <div className="h-[420px] border border-white/10 rounded-xl p-4 overflow-auto">
                {loading ? (
                  <div className="flex items-center justify-center h-full text-slate-400">
                    <div className="text-center">
                      <Loader2 size={40} className="animate-spin mx-auto mb-4 text-cyan-400" />
                      <p className="text-lg font-medium">AI is analyzing your text...</p>
                      <p className="text-sm mt-2">Checking spelling, grammar, and fluency</p>
                    </div>
                  </div>
                ) : result ? (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-cyan-400 font-semibold mb-1">Original</h4>
                      <p>{result.original}</p>
                    </div>

                    <div>
                      <h4 className="text-cyan-400 font-semibold mb-1">Spelling</h4>
                      <p>{result.spelling}</p>
                    </div>

                    <div>
                      <h4 className="text-cyan-400 font-semibold mb-1">Grammar</h4>
                      <p>{result.grammar}</p>
                    </div>

                    <div>
                      <h4 className="text-cyan-400 font-semibold mb-1">Fluency</h4>
                      <p>{result.fluency}</p>
                    </div>

                    <div className="pt-3 border-t border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-cyan-400 font-semibold">Final Corrected Text</h4>
                        <button
                          onClick={handleCopy}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition text-sm"
                        >
                          {copied ? (
                            <>
                              <Check size={16} className="text-green-400" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy size={16} />
                              Copy
                            </>
                          )}
                        </button>
                      </div>

                      <p className="text-white leading-7">{result.corrected}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-500">
                    Your corrected text will appear here after clicking “Correct AI”.
                  </div>
                )}

                {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
              </div>

              <div className="mt-4 flex items-center gap-3 text-sm">
                <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                  Confidence: {result ? `${Math.round(result.confidence * 100)}%` : "—"}
                </div>
                <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">{mode === "all" ? "All" : mode}</div>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-[#0B1220] border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4">Correction Mode</h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button
                onClick={() => setMode("spelling")}
                className={`border rounded-xl py-4 transition ${
                  mode === "spelling"
                    ? "border-cyan-400 bg-cyan-500/20 text-cyan-300"
                    : "border-white/10 hover:bg-white/5"
                }`}
              >
                Spelling
              </button>

              <button
                onClick={() => setMode("grammar")}
                className={`border rounded-xl py-4 transition ${
                  mode === "grammar"
                    ? "border-cyan-400 bg-cyan-500/20 text-cyan-300"
                    : "border-white/10 hover:bg-white/5"
                }`}
              >
                Grammar
              </button>

              <button
                onClick={() => setMode("fluency")}
                className={`border rounded-xl py-4 transition ${
                  mode === "fluency"
                    ? "border-cyan-400 bg-cyan-500/20 text-cyan-300"
                    : "border-white/10 hover:bg-white/5"
                }`}
              >
                Fluency
              </button>

              <button
                onClick={handleCorrection}
                disabled={loading}
                className={`rounded-xl py-4 flex items-center justify-center gap-2 transition ${
                  mode === "all"
                    ? "bg-cyan-400 text-black"
                    : "bg-cyan-500 hover:bg-cyan-400 text-black"
                } disabled:opacity-60 disabled:cursor-not-allowed`}
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Correcting...
                  </>
                ) : (
                  <>
                    <Wand2 size={18} />
                    Correct AI
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Workspace;
