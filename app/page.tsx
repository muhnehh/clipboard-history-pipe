"use client";

import { useState, useEffect } from "react";
import { ClientOnly } from "../lib/client-only";
import { toast, Toaster } from "../lib/use-toast";

interface ClipboardEntry {
  content: string;
  timestamp: number;
  source: string;
  url: string | null;
  suggestion: string | null;
  taskGroup: string;
}

export default function Page() {
  const [history, setHistory] = useState<ClipboardEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [copyCount, setCopyCount] = useState<number>(0);

  const getScreenpipeContext = (): { source: string; url: string | null; relatedSuggestion: string | null } => {
    const apps = ["Notepad", "Chrome", "Word", "VS Code"];
    const urls = ["https://example.com", "https://docs.screenpi.pe", null];
    return {
      source: apps[Math.floor(Math.random() * apps.length)],
      url: urls[Math.floor(Math.random() * urls.length)],
      relatedSuggestion: Math.random() > 0.5 ? "Related text from same page" : null,
    };
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      if (document.hasFocus()) {
        try {
          const content = await navigator.clipboard.readText();
          if (content && !history.some((item) => item.content === content)) {
            const context = getScreenpipeContext();
            const newEntry: ClipboardEntry = {
              content,
              timestamp: Date.now(),
              source: context.source,
              url: context.url,
              suggestion: context.relatedSuggestion,
              taskGroup: context.source,
            };
            setHistory((prev) => [...prev, newEntry].slice(-10));
            setCopyCount((prev) => prev + 1);
          }
        } catch (error) {
          if (error instanceof Error && error.name !== "NotAllowedError") {
            console.error("Failed to read clipboard:", error);
            toast({ description: "Clipboard read failed. Please check permissions." });
          }
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [history]);

  const handleCopy = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast({ description: `Copied: "${content.slice(0, 20)}${content.length > 20 ? "..." : ""}"` });
    } catch (error) {
      console.error("Failed to copy:", error);
      toast({ description: "Failed to copy to clipboard." });
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    setCopyCount(0);
    toast({ description: "Clipboard history cleared." });
  };

  const filteredHistory = history.filter((item) =>
    item.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ClientOnly>
      <div
        style={{
          padding: "40px",
          fontFamily: '"Helvetica Neue", Arial, sans-serif',
          backgroundColor: "#f5f5f7",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2
          style={{
            fontSize: "28px",
            fontWeight: 600,
            color: "#1d1d1f",
            marginBottom: "10px",
          }}
        >
          Clipboard History Pipe
        </h2>
        <p
          style={{
            fontSize: "16px",
            color: "#86868b",
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          Click an entry to copy it back. Powered by Screenpipe context.
        </p>

        <div style={{ fontSize: "14px", color: "#86868b", marginBottom: "20px" }}>
          Total Copies: {copyCount}
        </div>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search clipboard history..."
          style={{
            width: "100%",
            maxWidth: "600px",
            padding: "10px",
            fontSize: "16px",
            borderRadius: "8px",
            border: "1px solid #d2d2d7",
            marginBottom: "20px",
            outline: "none",
            backgroundColor: "#ffffff",
            color: "#1d1d1f",
          }}
        />

        <ul style={{ listStyle: "none", padding: 0, width: "100%", maxWidth: "600px" }}>
          {filteredHistory.length === 0 ? (
            <li style={{ color: "#86868b", textAlign: "center", padding: "15px" }}>
              {searchQuery ? "No matches found." : "No clipboard history yet. Copy some text to get started!"}
            </li>
          ) : (
            filteredHistory.map((item, index) => (
              <li
                key={index}
                onClick={() => handleCopy(item.content)}
                style={{
                  cursor: "pointer",
                  padding: "15px",
                  backgroundColor: "#ffffff",
                  borderRadius: "10px",
                  marginBottom: "10px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span
                      style={{
                        fontSize: "16px",
                        color: "#1d1d1f",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: "70%",
                      }}
                    >
                      {item.content}
                    </span>
                    <small style={{ fontSize: "14px", color: "#86868b" }}>
                      {new Intl.DateTimeFormat("en-US", {
                        hour: "numeric",
                        minute: "numeric",
                        second: "numeric",
                      }).format(new Date(item.timestamp))}
                    </small>
                  </div>
                  <div style={{ marginTop: "5px", fontSize: "12px", color: "#86868b" }}>
                    <span>From: {item.source}</span>
                    {item.url && (
                      <span>
                        {" | "}
                        <a
                          href={item.url}
                          style={{ color: "#007aff", textDecoration: "none" }}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Source URL
                        </a>
                      </span>
                    )}
                    {item.suggestion && (
                      <span>
                        {" | Suggestion: "}
                        <span style={{ color: "#1d1d1f" }}>{item.suggestion}</span>
                      </span>
                    )}
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>

        {history.length > 0 && (
          <button
            onClick={handleClearHistory}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              fontWeight: 500,
              color: "#ffffff",
              backgroundColor: "#007aff",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              marginTop: "20px",
              transition: "background-color 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#005bb5")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#007aff")}
          >
            Clear History
          </button>
        )}

        <footer style={{ marginTop: "40px", fontSize: "14px", color: "#86868b" }}>
          Built with{" "}
          <a href="https://screenpi.pe" style={{ color: "#1d1d1f", textDecoration: "underline" }}>
            Screenpipe
          </a>
        </footer>
        <Toaster /> {/* Render the toasts */}
      </div>
    </ClientOnly>
  );
}