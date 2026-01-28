"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [showAgeModal, setShowAgeModal] = useState(true);
  const [hasAgreed, setHasAgreed] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const agreed = sessionStorage.getItem("ageVerified");
    if (agreed === "true") {
      setShowAgeModal(false);
      setHasAgreed(true);
    }
  }, []);

  const handleAgree = () => {
    sessionStorage.setItem("ageVerified", "true");
    setShowAgeModal(false);
    setHasAgreed(true);
  };

  const handleDecline = () => {
    window.location.href = "https://www.google.com";
  };

  const handleStartChat = () => {
    router.push("/chat");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Age Verification Modal */}
      {showAgeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 animate-fadeIn">
          <div className="bg-[#12121a] border border-[#1e1e2e] rounded-2xl p-8 max-w-md mx-4 animate-slideUp">
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
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-4">Age Verification Required</h2>
              <p className="text-[#6b7280] mb-6">
                This website contains content intended for adults only. By entering, you confirm that you are at least 18 years of age.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={handleDecline}
                  className="flex-1 px-6 py-3 rounded-xl border border-[#1e1e2e] text-[#6b7280] hover:bg-[#1e1e2e] transition-colors cursor-pointer"
                >
                  Leave
                </button>
                <button
                  onClick={handleAgree}
                  className="flex-1 px-6 py-3 rounded-xl bg-[#8b5cf6] text-white hover:bg-[#a78bfa] transition-colors cursor-pointer"
                >
                  I am 18+
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className={`flex-1 flex flex-col items-center justify-center px-4 ${!hasAgreed ? "blur-sm" : ""}`}>
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#8b5cf6] to-[#a78bfa] bg-clip-text text-transparent">
            Are you ready to go to the edge?
          </h1>
          <p className="text-[#6b7280] text-lg md:text-xl">
            Experience AI conversation like never before
          </p>
        </div>

        {/* Features Box */}
        <div className="bg-[#12121a] border border-[#1e1e2e] rounded-2xl p-8 max-w-lg w-full mb-8">
          <ul className="space-y-4">
            <li className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#10b981]/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-[#10b981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-lg">100% Free and Anonymous</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#10b981]/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-[#10b981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-lg">No Message Storage</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#10b981]/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-[#10b981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-lg">No Sign In or Sign Up</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#10b981]/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-[#10b981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-lg">100% Free - No Card Needed</span>
            </li>
          </ul>
        </div>

        {/* Start Chat Button */}
        <button
          onClick={handleStartChat}
          disabled={!hasAgreed}
          className="px-8 py-4 bg-[#8b5cf6] text-white text-lg font-semibold rounded-xl hover:bg-[#a78bfa] transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 cursor-pointer"
        >
          Start Chat
        </button>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1e1e2e] py-6 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[#6b7280] text-sm mb-2">
            <strong>Legal Disclaimer:</strong> This AI chatbot may produce inaccurate or misleading information.
            AI systems can &quot;hallucinate&quot; - generating content that sounds plausible but is factually incorrect.
          </p>
          <p className="text-[#6b7280] text-sm">
            Always verify important information independently. This service is provided &quot;as is&quot; without warranties.
            By using this service, you acknowledge these limitations and agree to use it at your own discretion.
          </p>
          <p className="text-[#4b5563] text-xs mt-4">
            &copy; {new Date().getFullYear()} To The Edge. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
