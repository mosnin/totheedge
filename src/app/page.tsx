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
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold mb-4">Age Verification Required</h2>
              <p className="text-[#6b7280] mb-6 text-sm sm:text-base">
                This website contains content intended for adults only. By entering, you confirm that you are at least 18 years of age.
              </p>
              <div className="flex gap-3 sm:gap-4">
                <button
                  onClick={handleDecline}
                  className="flex-1 px-4 sm:px-6 py-3 rounded-xl border border-[#1e1e2e] text-[#6b7280] hover:bg-[#1e1e2e] transition-colors cursor-pointer text-sm sm:text-base"
                >
                  Leave
                </button>
                <button
                  onClick={handleAgree}
                  className="flex-1 px-4 sm:px-6 py-3 rounded-xl bg-[#8b5cf6] text-white hover:bg-[#a78bfa] transition-colors cursor-pointer text-sm sm:text-base"
                >
                  I am 18+
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navbar */}
      <nav className={`border-b border-[#1e1e2e] px-4 sm:px-6 py-4 ${!hasAgreed ? "blur-sm" : ""}`}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-[#8b5cf6] to-[#a78bfa] flex items-center justify-center">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-[#8b5cf6] to-[#a78bfa] bg-clip-text text-transparent">
              Edging Hard
            </span>
          </div>
          <button
            onClick={handleStartChat}
            disabled={!hasAgreed}
            className="px-4 sm:px-6 py-2 bg-[#8b5cf6] text-white text-sm sm:text-base font-medium rounded-lg hover:bg-[#a78bfa] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            Start Chat
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className={`flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-12 ${!hasAgreed ? "blur-sm" : ""}`}>
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-[#8b5cf6] to-[#a78bfa] bg-clip-text text-transparent leading-tight">
            Are you ready to go to the edge?
          </h1>
          <p className="text-[#6b7280] text-base sm:text-lg md:text-xl">
            Experience AI conversation like never before
          </p>
        </div>

        {/* Features Box */}
        <div className="bg-[#12121a] border border-[#1e1e2e] rounded-2xl p-5 sm:p-8 max-w-lg w-full mb-6 sm:mb-8">
          <ul className="space-y-3 sm:space-y-4">
            <li className="flex items-center gap-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#10b981]/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#10b981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-base sm:text-lg">100% Free and Anonymous</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#10b981]/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#10b981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-base sm:text-lg">No Message Storage</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#10b981]/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#10b981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-base sm:text-lg">No Sign In or Sign Up</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#10b981]/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#10b981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-base sm:text-lg">100% Free - No Card Needed</span>
            </li>
          </ul>
        </div>

        {/* Start Chat Button */}
        <button
          onClick={handleStartChat}
          disabled={!hasAgreed}
          className="px-6 sm:px-8 py-3 sm:py-4 bg-[#8b5cf6] text-white text-base sm:text-lg font-semibold rounded-xl hover:bg-[#a78bfa] transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 cursor-pointer"
        >
          Start Chat
        </button>
      </main>

      {/* Footer */}
      <footer className={`border-t border-[#1e1e2e] py-5 sm:py-6 px-4 sm:px-6 ${!hasAgreed ? "blur-sm" : ""}`}>
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[#6b7280] text-xs sm:text-sm mb-2">
            <strong>Legal Disclaimer:</strong> This AI chatbot may produce inaccurate or misleading information.
            AI systems can &quot;hallucinate&quot; - generating content that sounds plausible but is factually incorrect.
          </p>
          <p className="text-[#6b7280] text-xs sm:text-sm">
            Always verify important information independently. This service is provided &quot;as is&quot; without warranties.
            By using this service, you acknowledge these limitations and agree to use it at your own discretion.
          </p>
          <p className="text-[#6b7280] text-xs sm:text-sm mt-3 sm:mt-4">
            <strong>18 U.S.C. 2257 Compliance Statement:</strong> All models, actors, actresses and other persons that appear in any visual depiction of sexually explicit conduct appearing or otherwise contained on this website were over the age of eighteen (18) years at the time of the creation of such depictions. All content and images are in full compliance with the requirements of 18 U.S.C. 2257 and associated regulations.
          </p>
          <p className="text-[#6b7280] text-xs sm:text-sm mt-3 sm:mt-4">
            <strong>DMCA Notice:</strong> If you believe that content on this site infringes your copyright, please contact us at{" "}
            <a href="mailto:help@edginghard.com" className="text-[#8b5cf6] hover:text-[#a78bfa] transition-colors underline">
              help@edginghard.com
            </a>
          </p>
          <p className="text-[#4b5563] text-[10px] sm:text-xs mt-3 sm:mt-4">
            &copy; {new Date().getFullYear()} Edging Hard. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
