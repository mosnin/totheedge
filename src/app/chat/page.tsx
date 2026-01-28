"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Sophia's unlockable photos
const SOPHIA_PHOTOS = [
  "https://cdn2.createporn.com/6978cd28d348f5ffec6aa280.jpg",
  "https://cdn2.createporn.com/6978c576d348f5ffec60cff5.jpg",
  "https://cdn2.createporn.com/69787534d348f5ffec109497.jpg",
  "https://cdn2.createporn.com/6978acf6d348f5ffec437470.jpg",
];

interface Message {
  role: "user" | "assistant";
  content: string;
  isPhoto?: boolean;
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
  const [showInstructions, setShowInstructions] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const [unlockedPhotoIndex, setUnlockedPhotoIndex] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const agreed = sessionStorage.getItem("ageVerified");
    if (agreed !== "true") {
      router.push("/");
    }
    const seenInstructions = sessionStorage.getItem("seenInstructions");
    if (seenInstructions === "true") {
      setShowInstructions(false);
    }
  }, [router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleDismissInstructions = () => {
    sessionStorage.setItem("seenInstructions", "true");
    setShowInstructions(false);
  };

  const handleShowInstructions = () => {
    setShowInstructions(true);
  };

  const sendMessageWithContent = async (content: string) => {
    if (isLoading) return;

    const userMessage: Message = { role: "user", content };
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

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    await sendMessageWithContent(input.trim());
  };

  const handleQuickAction = async (action: string) => {
    await sendMessageWithContent(action);
  };

  const handleStart = async () => {
    setHasStarted(true);
    await sendMessageWithContent("Start");
  };

  const handleNewChat = () => {
    setMessages([]);
    setHasStarted(false);
    setUnlockedPhotoIndex(0);
  };

  const handleUnlockPhoto = () => {
    if (unlockedPhotoIndex >= SOPHIA_PHOTOS.length) return;

    const photoUrl = SOPHIA_PHOTOS[unlockedPhotoIndex];
    const photoMessage: Message = {
      role: "assistant",
      content: photoUrl,
      isPhoto: true,
    };
    setMessages([...messages, photoMessage]);
    setUnlockedPhotoIndex(unlockedPhotoIndex + 1);
  };

  const handleBackHome = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0f]">
      {/* Instructions Modal */}
      {showInstructions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 animate-fadeIn p-4">
          <div className="bg-[#12121a] border border-[#1e1e2e] rounded-2xl p-6 sm:p-8 max-w-md w-full animate-slideUp">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#8b5cf6]/20 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-[#8b5cf6]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold mb-4">How to Use</h2>
              <div className="text-left space-y-3 mb-6">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#8b5cf6] text-white text-sm flex items-center justify-center flex-shrink-0">1</span>
                  <p className="text-[#a0a0a5]">Click Start to begin your session with Sophia</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#8b5cf6] text-white text-sm flex items-center justify-center flex-shrink-0">2</span>
                  <p className="text-[#a0a0a5]">Click &quot;Keep Going&quot; for more instructions</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#8b5cf6] text-white text-sm flex items-center justify-center flex-shrink-0">3</span>
                  <p className="text-[#a0a0a5]">Click &quot;I&apos;m About to Cum&quot; when ready to finish</p>
                </div>
              </div>
              <button
                onClick={handleDismissInstructions}
                className="w-full px-6 py-3 rounded-xl bg-[#8b5cf6] text-white hover:bg-[#a78bfa] transition-colors cursor-pointer"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="border-b border-[#1e1e2e] px-3 sm:px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={handleBackHome}
            className="text-[#6b7280] hover:text-white transition-colors flex items-center gap-1 sm:gap-2 cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden sm:inline">Back</span>
          </button>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-[#8b5cf6]">
              <Image
                src={SOPHIA_PROFILE.avatar}
                alt={SOPHIA_PROFILE.name}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div>
              <h1 className="font-semibold text-sm sm:text-base">{SOPHIA_PROFILE.name}</h1>
              <p className="text-[10px] sm:text-xs text-[#6b7280]">
                {SOPHIA_PROFILE.age} • {SOPHIA_PROFILE.description}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleShowInstructions}
              className="text-[#6b7280] hover:text-white transition-colors cursor-pointer"
              title="How to Use"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            <button
              onClick={handleNewChat}
              className="text-[#6b7280] hover:text-white transition-colors flex items-center gap-1 sm:gap-2 cursor-pointer"
              title="New Chat"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="hidden sm:inline">New</span>
            </button>
          </div>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-8 sm:py-12">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 rounded-full overflow-hidden border-4 border-[#8b5cf6]">
                <Image
                  src={SOPHIA_PROFILE.avatar}
                  alt={SOPHIA_PROFILE.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <h2 className="text-lg sm:text-xl font-semibold mb-2">Chat with {SOPHIA_PROFILE.name}</h2>
              <p className="text-[#6b7280] text-sm sm:text-base">
                Click Start to begin your session
              </p>
            </div>
          )}

          {messages.map((message, index) => (
            <div key={index}>
              <div
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex items-start gap-2 sm:gap-3 max-w-[90%] sm:max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                  {message.role === "assistant" && (
                    <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden flex-shrink-0 border border-[#8b5cf6]">
                      <Image
                        src={SOPHIA_PROFILE.avatar}
                        alt={SOPHIA_PROFILE.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  )}
                  {message.isPhoto ? (
                    <div className="rounded-2xl overflow-hidden border border-[#8b5cf6]">
                      <Image
                        src={message.content}
                        alt="Sophia's photo"
                        width={300}
                        height={400}
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div
                      className={`px-3 sm:px-4 py-2 sm:py-3 rounded-2xl text-sm sm:text-base ${
                        message.role === "user"
                          ? "bg-[#8b5cf6] text-white rounded-br-md"
                          : "bg-[#12121a] border border-[#1e1e2e] rounded-bl-md"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden flex-shrink-0 border border-[#8b5cf6]">
                  <Image
                    src={SOPHIA_PROFILE.avatar}
                    alt={SOPHIA_PROFILE.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="px-3 sm:px-4 py-2 sm:py-3 rounded-2xl bg-[#12121a] border border-[#1e1e2e] rounded-bl-md">
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

      {/* Footer */}
      <footer className="border-t border-[#1e1e2e] px-3 sm:px-4 py-3 sm:py-4">
        <div className="max-w-4xl mx-auto">
          {!hasStarted ? (
            /* Start Button - shown before session begins */
            <div className="flex flex-col items-center">
              <button
                onClick={handleStart}
                disabled={isLoading}
                className="w-full max-w-xs px-8 py-4 bg-[#8b5cf6] text-white text-lg font-semibold rounded-xl hover:bg-[#a78bfa] transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 cursor-pointer"
              >
                {isLoading ? "Starting..." : "Start"}
              </button>
              <p className="text-center text-[#4b5563] text-[10px] sm:text-xs mt-3">
                Messages are stored locally and cleared on refresh
              </p>
            </div>
          ) : (
            /* Chat Controls - shown after session begins */
            <>
              {/* Quick Action Buttons */}
              <div className="flex gap-2 sm:gap-3 mb-3">
                <button
                  onClick={() => handleQuickAction("Keep going")}
                  disabled={isLoading}
                  className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 bg-[#1e1e2e] text-white text-sm sm:text-base rounded-xl hover:bg-[#2a2a3e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer border border-[#2e2e4e]"
                >
                  Keep Going
                </button>
                <button
                  onClick={() => handleQuickAction("I'm about to cum")}
                  disabled={isLoading}
                  className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 bg-[#8b5cf6] text-white text-sm sm:text-base rounded-xl hover:bg-[#a78bfa] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  I&apos;m About to Cum
                </button>
              </div>

              {/* Unlock Photo Button */}
              {unlockedPhotoIndex < SOPHIA_PHOTOS.length && (
                <button
                  onClick={handleUnlockPhoto}
                  disabled={isLoading}
                  className="w-full mb-3 px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-sm sm:text-base rounded-xl hover:from-pink-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Unlock Photo ({SOPHIA_PHOTOS.length - unlockedPhotoIndex} remaining)
                </button>
              )}

              {/* Text Input */}
              <form onSubmit={sendMessage} className="flex gap-2 sm:gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 bg-[#12121a] border border-[#1e1e2e] rounded-xl focus:outline-none focus:border-[#8b5cf6] transition-colors placeholder-[#6b7280] text-sm sm:text-base"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="px-4 sm:px-6 py-2.5 sm:py-3 bg-[#8b5cf6] text-white rounded-xl hover:bg-[#a78bfa] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </form>
              <p className="text-center text-[#4b5563] text-[10px] sm:text-xs mt-2 sm:mt-3">
                Messages are stored locally and cleared on refresh
              </p>
            </>
          )}
        </div>
      </footer>
    </div>
  );
}
