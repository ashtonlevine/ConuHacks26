"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Send } from "lucide-react";
import { cn } from "@/lib/utils";

type Message = { id: string; role: "user" | "assistant"; content: string };

function getMockResponse(query: string): string {
  const q = query.toLowerCase();
  if (/\bafford\b|(\$|dollar)\s*\d+|\d+\s*(\$|dollar)/.test(q) || /trip|concert|event|ticket/i.test(q))
    return "Based on your current balance and upcoming tuition and rent, I’d suggest checking your “After essentials” amount in your budget. For bigger purchases, we can set a small savings goal and see how it affects your semester plan.";
  if (/\bbudget|spending|spend\b/.test(q))
    return "Your budget is built around your semester—tuition, rent, and income. You can adjust categories and see how changes affect your runway. Want to open the Budget section to tweak it?";
  if (/\bsave|saving|cut|reduce\b/.test(q))
    return "Try the “Smart cost-cutting” insights: we look at your spending and suggest student-friendly swaps (e.g. meal prep vs. dining out, or using nearby deals). I can also run a “what if” on cutting a category by 10–20%.";
  if (/\btuition|rent|bill\b/.test(q))
    return "I use your tuition and rent due dates to plan your cash flow. If something’s wrong, update the dates or amounts in your profile—your “Upcoming” and runway will update automatically.";
  if (/\bdeal|deals|food|eat|restaurant\b/.test(q))
    return "Check the Deals section for student discounts near campus. You can filter by distance and we’ll flag sponsored offers. I can also help you decide if a deal fits your weekly food budget.";
  return "I’m your StuSavvy AI assistant. I can help with “Can I afford this?”, budget tweaks, savings goals, and making sense of your semester finances. Ask a specific question to get a tailored answer.";
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

  const handleSend = () => {
    const text = input.trim();
    if (!text || isThinking) return;

    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: text };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setIsThinking(true);

    setTimeout(() => {
      const reply = getMockResponse(text);
      setMessages((m) => [
        ...m,
        { id: crypto.randomUUID(), role: "assistant", content: reply },
      ]);
      setIsThinking(false);
    }, 600);
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
