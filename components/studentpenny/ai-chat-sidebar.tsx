"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Send } from "lucide-react";
import { cn } from "@/lib/utils";

type Message = { id: string; role: "user" | "assistant"; content: string };

async function fetchGeminiReply(
  messages: { role: "user" | "assistant"; content: string }[]
): Promise<{ text: string } | { error: string }> {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: messages.map(({ role, content }) => ({ role, content })),
    }),
  });
  const data = await res.json();
  if (!res.ok) return { error: (data as { error?: string }).error ?? "Request failed." };
  return { text: (data as { text?: string }).text ?? "" };
}

const SUGGESTIONS = [
  "Can I afford a $50 concert ticket?",
  "How can I save more this month?",
  "What if I cut dining out by 20%?",
];

export function AIChatSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isThinking) return;

    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: text };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setIsThinking(true);

    const history = [...messages, userMsg].map(({ role, content }) => ({ role, content }));
    const result = await fetchGeminiReply(history);

    if ("error" in result) {
      setMessages((m: Message[]) => [
        ...m,
        { id: crypto.randomUUID(), role: "assistant", content: `Sorry, something went wrong: ${result.error}` },
      ]);
    } else {
      setMessages((m: Message[]) => [
        ...m,
        { id: crypto.randomUUID(), role: "assistant", content: result.text || "I don’t have an answer for that. Try asking about your budget, savings, or deals." },
      ]);
    }
    setIsThinking(false);
  };

  const handleSuggestion = (s: string) => {
    setInput(s);
  };

  const handleTabClick = () => {
    const next = !isOpen;
    setIsOpen(next);
    setIsPinned(next);
  };

  const handleMouseEnter = () => setIsOpen(true);
  const handleMouseLeave = () => {
    if (!isPinned) setIsOpen(false);
  };

  return (
    <div
      className={cn(
        "fixed z-[100]",
        isOpen ? "right-0 top-0 bottom-0 w-[360px] sm:w-[380px]" : "bottom-4 right-4 h-11 w-11"
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Sidebar panel */}
      <div
        className={cn(
          "absolute left-0 top-0 bottom-0 flex flex-col border-l border-border bg-card shadow-xl transition-all duration-200",
          isOpen ? "right-0 opacity-100" : "w-0 min-w-0 overflow-hidden opacity-0 pointer-events-none"
        )}
      >
        <div className="flex h-full min-h-0 flex-col">
          {/* Header */}
          <div className="flex shrink-0 items-center gap-2 border-b border-border px-4 py-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">AI Assistant</h3>
              <p className="text-xs text-muted-foreground">Ask about your finances</p>
            </div>
          </div>

          {/* Messages */}
          <div
            ref={listRef}
            className="flex-1 overflow-y-auto p-4"
          >
            {messages.length === 0 && !isThinking && (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Ask budget questions, run &quot;what-if&quot; scenarios, or get tips. Examples:
                </p>
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleSuggestion(s)}
                    className="block w-full rounded-lg border border-border bg-muted/50 px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-muted"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
            {messages.map((m) => (
              <div
                key={m.id}
                className={cn(
                  "mb-3 flex",
                  m.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[85%] rounded-xl px-3 py-2 text-sm",
                    m.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  )}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {isThinking && (
              <div className="mb-3 flex justify-start">
                <div className="flex gap-1 rounded-xl bg-muted px-3 py-2">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground" />
                  <span className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground [animation-delay:0.2s]" />
                  <span className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground [animation-delay:0.4s]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="shrink-0 border-t border-border p-3 pr-16">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ask a question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                disabled={isThinking}
                className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
              />
              <Button
                size="icon"
                onClick={handleSend}
                disabled={!input.trim() || isThinking}
                aria-label="Send"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Hover/click tab — bottom-right corner */}
      <button
        type="button"
        onClick={handleTabClick}
        className={cn(
          "flex h-11 w-11 shrink-0 flex-col items-center justify-center gap-0.5 rounded-xl border border-border bg-card shadow-lg transition-colors hover:bg-muted/80",
          isOpen && "absolute bottom-4 right-4 z-10 bg-muted/50"
        )}
        aria-label={isOpen ? "Close AI assistant" : "Open AI assistant"}
      >
        <Sparkles className="h-5 w-5 text-primary" />
        <span className="text-[9px] font-medium text-muted-foreground">AI</span>
      </button>
    </div>
  );
}
