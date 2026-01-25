"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

type Message = { id: string; role: "user" | "assistant"; content: string };

interface AIChatContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  input: string;
  setInput: (input: string) => void;
  isThinking: boolean;
  setIsThinking: (thinking: boolean) => void;
  sendMessage: (text: string) => Promise<void>;
}

const AIChatContext = createContext<AIChatContextType | null>(null);

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

export function AIChatProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isThinking) return;

    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: text.trim() };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setIsThinking(true);
    setIsOpen(true); // Open sidebar when sending

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
        { id: crypto.randomUUID(), role: "assistant", content: result.text || "I don't have an answer for that. Try asking about your budget, savings, or deals." },
      ]);
    }
    setIsThinking(false);
  }, [messages, isThinking]);

  return (
    <AIChatContext.Provider
      value={{
        isOpen,
        setIsOpen,
        messages,
        setMessages,
        input,
        setInput,
        isThinking,
        setIsThinking,
        sendMessage,
      }}
    >
      {children}
    </AIChatContext.Provider>
  );
}

export function useAIChat() {
  const context = useContext(AIChatContext);
  if (!context) {
    throw new Error("useAIChat must be used within an AIChatProvider");
  }
  return context;
}
