"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SOPHIA_PROFILE = {
  name: "Sophia",
  age: 19,
  description: "College volleyball player",
  avatar: "https://cdn2.createporn.com/697852f8d348f5ffecee7611.jpg",
};

const SYSTEM_PROMPT = `You are Sophia, a 19-year-old college girl with a playful, flirty personality who loves guiding guys through edging sessions. You're experienced in teasing and building pleasure gradually. You have long brunette hair, a fit body from college volleyball, and a confident yet sweet demeanor. You get turned on by controlling someone's pleasure and watching them struggle to hold back their orgasm.

Your speaking style is casual, intimate, and slightly breathy. Use lots of "mmmm," "fuck," and other natural expressions of arousal. Keep your responses relatively short (1-3 sentences) to maintain conversational flow.

When users say "keep going," respond with specific instructions like:

"Give me 15 fast strokes, imagining your cock sliding between my wet pussy lips"
"Now 10 slow, teasing strokes while you picture me on my knees looking up at you"
"Pause for a moment and just feel my tight pussy gripping your dick"
"Spit on your hand, grip tighter, and give me 10 hard strokes imagining stuffing my pussy deep"
"Circle your thumb over your tip while you think about me bouncing on your lap"
When users say "I'm about to cum," respond with something like:

"Mmm yes baby, stroke faster and imagine shooting all over my perfect tits"
"Don't hold back now, pump that cock hard and picture covering my face with your hot cum"
"Yes! Let it all out while thinking about my tongue catching every drop"
After users cum, always end with something like:

"Good boy... come back when you're ready for round two"
"Mmm that was hot. I'll be waiting when you're ready to play again"
"Perfect... I'll be thinking about that until you come back for more"
Remember to gradually increase the intensity and explicitness of your instructions as the session progresses. Start somewhat innocent and get progressively dirtier as the user gets more aroused.`;

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const agreed = sessionStorage.getItem("ageVerified");
    if (agreed !== "true") {
      router.push("/");
    }
  }, [router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...newMessages,
          ],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      const assistantMessage: Message = {
        role: "assistant",
        content: data.message,
      };
      setMessages([...newMessages, assistantMessage]);
    } catch {
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: "Sorry, I'm having trouble connecting right now. Can you try again?",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackHome = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0f]">
      {/* Header */}
      <header className="border-b border-[#1e1e2e] px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={handleBackHome}
            className="text-[#6b7280] hover:text-white transition-colors flex items-center gap-2 cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-[#8b5cf6]">
              <Image
                src={SOPHIA_PROFILE.avatar}
                alt={SOPHIA_PROFILE.name}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div>
              <h1 className="font-semibold">{SOPHIA_PROFILE.name}</h1>
              <p className="text-xs text-[#6b7280]">
                {SOPHIA_PROFILE.age} • {SOPHIA_PROFILE.description}
              </p>
            </div>
          </div>
          <div className="w-16"></div>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <div className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-4 border-[#8b5cf6]">
                <Image
                  src={SOPHIA_PROFILE.avatar}
                  alt={SOPHIA_PROFILE.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <h2 className="text-xl font-semibold mb-2">Chat with {SOPHIA_PROFILE.name}</h2>
              <p className="text-[#6b7280]">
                Say hi to start the conversation!
              </p>
            </div>
          )}

          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`flex items-start gap-3 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                {message.role === "assistant" && (
                  <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0 border border-[#8b5cf6]">
                    <Image
                      src={SOPHIA_PROFILE.avatar}
                      alt={SOPHIA_PROFILE.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                )}
                <div
                  className={`px-4 py-3 rounded-2xl ${
                    message.role === "user"
                      ? "bg-[#8b5cf6] text-white rounded-br-md"
                      : "bg-[#12121a] border border-[#1e1e2e] rounded-bl-md"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-start gap-3">
                <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0 border border-[#8b5cf6]">
                  <Image
                    src={SOPHIA_PROFILE.avatar}
                    alt={SOPHIA_PROFILE.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="px-4 py-3 rounded-2xl bg-[#12121a] border border-[#1e1e2e] rounded-bl-md">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-[#6b7280] rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                    <span className="w-2 h-2 bg-[#6b7280] rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                    <span className="w-2 h-2 bg-[#6b7280] rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input */}
      <footer className="border-t border-[#1e1e2e] px-4 py-4">
        <form onSubmit={sendMessage} className="max-w-4xl mx-auto flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-3 bg-[#12121a] border border-[#1e1e2e] rounded-xl focus:outline-none focus:border-[#8b5cf6] transition-colors placeholder-[#6b7280]"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-6 py-3 bg-[#8b5cf6] text-white rounded-xl hover:bg-[#a78bfa] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
        <p className="text-center text-[#4b5563] text-xs mt-3">
          Messages are stored locally and cleared on refresh
        </p>
      </footer>
    </div>
  );
}
