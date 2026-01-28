// ExoClick Ad Manager for Chat Integration
// Zone IDs:
//   Banner:       5841084 (footer banner, every 4-5 user messages)
//   Interstitial: 5841074 (fullpage, every 12-15 messages or denial keywords)
//   Unlock Video: 5841076 (VAST rewarded video at denial peaks)

declare global {
  interface Window {
    AdProvider?: Array<Record<string, unknown>>;
  }
}

// --- Configuration ---
const AD_ZONES = {
  banner: "5841084",
  interstitial: "5841074",
  unlock: "5841076",
} as const;

export const BANNER_ZONE_ID = AD_ZONES.banner;

const VAST_URL = `https://s.magsrv.com/v1/vast.php?idzone=${AD_ZONES.unlock}`;

const BANNER_INTERVAL = 4; // show banner every N user messages (4-5)
const INTERSTITIAL_INTERVAL = 12; // show interstitial every N messages (12-15)
const INTERSTITIAL_CAP_MS = 5 * 60 * 1000; // 5 min frequency cap
const UNLOCK_CAP_MS = 10 * 60 * 1000; // 10 min frequency cap

const DENIAL_KEYWORDS = [
  "pause",
  "hold",
  "edge",
  "stop",
  "wait",
  "don't cum",
  "not yet",
  "slow down",
  "hold it",
  "don't you dare",
];

// --- State ---
interface AdState {
  userMessageCount: number;
  totalMessageCount: number;
  lastInterstitialTime: number;
  lastUnlockTime: number;
  adProviderLoaded: boolean;
  adblockDetected: boolean;
  events: Array<{ type: string; timestamp: number; zone?: string }>;
}

const state: AdState = {
  userMessageCount: 0,
  totalMessageCount: 0,
  lastInterstitialTime: 0,
  lastUnlockTime: 0,
  adProviderLoaded: false,
  adblockDetected: false,
  events: [],
};

// --- Event Tracking ---
function trackEvent(type: string, zone?: string) {
  state.events.push({ type, timestamp: Date.now(), zone });
}

// --- Adblock Detection ---
function checkAdblock(): boolean {
  try {
    const testEl = document.createElement("ins");
    testEl.className = "eas6a97888e35";
    testEl.style.cssText =
      "display:block!important;position:absolute;left:-9999px;";
    document.body.appendChild(testEl);
    const blocked =
      testEl.offsetHeight === 0 ||
      getComputedStyle(testEl).display === "none";
    testEl.remove();
    state.adblockDetected = blocked;
    return blocked;
  } catch {
    return false;
  }
}

// --- ExoClick Ad Provider ---
function ensureAdProvider() {
  if (state.adProviderLoaded) return;
  if (typeof window === "undefined") return;

  // ad-provider.js is already loaded globally in layout.tsx
  // Just mark as loaded
  state.adProviderLoaded = true;
}

function serveAdZone() {
  if (typeof window === "undefined") return;
  window.AdProvider = window.AdProvider || [];
  window.AdProvider.push({ serve: {} });
}

// --- Banner Ad (footer) ---
export function shouldShowBanner(): boolean {
  return (
    state.userMessageCount > 0 &&
    state.userMessageCount % BANNER_INTERVAL === 0
  );
}

export function serveBannerAd() {
  if (state.adblockDetected) return;
  if (typeof window === "undefined") return;
  ensureAdProvider();
  serveAdZone();
  trackEvent("ad_triggered", AD_ZONES.banner);
}

// --- Interstitial Ad (fullpage overlay) ---
function canShowInterstitial(): boolean {
  const now = Date.now();
  return now - state.lastInterstitialTime > INTERSTITIAL_CAP_MS;
}

export function shouldShowInterstitial(aiResponse?: string): boolean {
  if (!canShowInterstitial()) return false;

  // Check message count threshold
  if (
    state.totalMessageCount > 0 &&
    state.totalMessageCount % INTERSTITIAL_INTERVAL === 0
  ) {
    return true;
  }

  // Check for denial/countdown keywords in AI response
  if (aiResponse) {
    const lower = aiResponse.toLowerCase();
    return DENIAL_KEYWORDS.some((kw) => lower.includes(kw));
  }

  return false;
}

export function createInterstitialContainer(): HTMLDivElement {
  const overlay = document.createElement("div");
  overlay.id = "exo-interstitial-overlay";
  overlay.style.cssText = `
    position:fixed;inset:0;z-index:9999;
    background:rgba(0,0,0,0.9);
    display:flex;flex-direction:column;align-items:center;justify-content:center;
    padding:16px;
  `;

  const closeBtn = document.createElement("button");
  closeBtn.textContent = "Close";
  closeBtn.style.cssText = `
    position:absolute;top:16px;right:16px;
    background:#8b5cf6;color:#fff;border:none;
    padding:8px 20px;border-radius:8px;font-size:14px;cursor:pointer;
    z-index:10000;
  `;
  closeBtn.onclick = () => {
    overlay.remove();
    trackEvent("ad_completed", AD_ZONES.interstitial);
  };

  const adContainer = document.createElement("div");
  adContainer.style.cssText =
    "width:100%;max-width:480px;min-height:250px;display:flex;align-items:center;justify-content:center;";

  const ins = document.createElement("ins");
  ins.className = "eas6a97888e35";
  ins.setAttribute("data-zoneid", AD_ZONES.interstitial);

  adContainer.appendChild(ins);
  overlay.appendChild(closeBtn);
  overlay.appendChild(adContainer);

  return overlay;
}

export function showInterstitial() {
  if (state.adblockDetected || !canShowInterstitial()) return;
  ensureAdProvider();

  const overlay = createInterstitialContainer();
  document.body.appendChild(overlay);
  serveAdZone();

  state.lastInterstitialTime = Date.now();
  trackEvent("ad_triggered", AD_ZONES.interstitial);

  // Auto-close after 15s as fallback
  setTimeout(() => {
    if (document.getElementById("exo-interstitial-overlay")) {
      overlay.remove();
      trackEvent("ad_completed", AD_ZONES.interstitial);
    }
  }, 15000);
}

// --- Unlock / Rewarded Video Ad ---
function canShowUnlock(): boolean {
  const now = Date.now();
  return now - state.lastUnlockTime > UNLOCK_CAP_MS;
}

export function shouldShowUnlockPrompt(aiResponse: string): boolean {
  if (!canShowUnlock()) return false;
  const lower = aiResponse.toLowerCase();
  // Stronger denial signals for unlock prompt
  const strongDenial = ["pause", "hold", "edge", "stop", "wait", "not yet"];
  return strongDenial.some((kw) => lower.includes(kw));
}

export interface UnlockResult {
  completed: boolean;
  photoUrl?: string;
}

export function showUnlockOverlay(
  photoUrl: string,
  onComplete: (result: UnlockResult) => void,
) {
  if (state.adblockDetected) {
    // Adblock fallback: just give the content
    onComplete({ completed: true, photoUrl });
    return;
  }

  ensureAdProvider();
  state.lastUnlockTime = Date.now();
  trackEvent("ad_triggered", AD_ZONES.unlock);

  const overlay = document.createElement("div");
  overlay.id = "exo-unlock-overlay";
  overlay.style.cssText = `
    position:fixed;inset:0;z-index:9999;
    background:rgba(0,0,0,0.95);
    display:flex;flex-direction:column;align-items:center;justify-content:center;
    padding:16px;gap:16px;
  `;

  // Prompt text
  const prompt = document.createElement("div");
  prompt.style.cssText =
    "text-align:center;color:#fff;max-width:360px;";
  prompt.innerHTML = `
    <div style="width:48px;height:48px;margin:0 auto 12px;border-radius:50%;background:rgba(139,92,246,0.2);display:flex;align-items:center;justify-content:center;">
      <svg width="24" height="24" fill="none" stroke="#8b5cf6" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
        <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
    </div>
    <p style="font-size:16px;font-weight:600;margin-bottom:4px;">Unlock Exclusive Photo</p>
    <p style="font-size:13px;color:#9ca3af;">Watch a short ad to unlock her photo</p>
  `;

  // Video container for VAST
  const videoWrap = document.createElement("div");
  videoWrap.style.cssText =
    "width:100%;max-width:400px;aspect-ratio:16/9;background:#000;border-radius:12px;overflow:hidden;position:relative;";

  const video = document.createElement("video");
  video.id = "exo-vast-player";
  video.style.cssText = "width:100%;height:100%;object-fit:contain;";
  video.setAttribute("playsinline", "");
  video.setAttribute("webkit-playsinline", "");
  video.muted = false;
  video.controls = false;

  videoWrap.appendChild(video);

  // Progress bar
  const progressBar = document.createElement("div");
  progressBar.style.cssText =
    "width:100%;max-width:400px;height:4px;background:#1e1e2e;border-radius:2px;overflow:hidden;";
  const progressFill = document.createElement("div");
  progressFill.style.cssText =
    "width:0%;height:100%;background:#8b5cf6;transition:width 0.3s;";
  progressBar.appendChild(progressFill);

  // Skip / status text
  const statusText = document.createElement("p");
  statusText.style.cssText = "color:#6b7280;font-size:12px;";
  statusText.textContent = "Loading ad...";

  overlay.appendChild(prompt);
  overlay.appendChild(videoWrap);
  overlay.appendChild(progressBar);
  overlay.appendChild(statusText);
  document.body.appendChild(overlay);

  // VAST parsing and video playback
  let adCompleted = false;

  function completeAd() {
    if (adCompleted) return;
    adCompleted = true;
    overlay.remove();
    trackEvent("ad_completed", AD_ZONES.unlock);
    onComplete({ completed: true, photoUrl });
  }

  // Fetch VAST XML and extract media file
  fetch(VAST_URL)
    .then((res) => res.text())
    .then((xml) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(xml, "text/xml");
      const mediaFile = doc.querySelector("MediaFile");
      const mediaUrl = mediaFile?.textContent?.trim();

      if (mediaUrl) {
        video.src = mediaUrl;
        video.play().catch(() => {
          // Autoplay blocked, show fallback
          statusText.textContent = "Tap to play";
          video.controls = true;
        });

        video.ontimeupdate = () => {
          if (video.duration > 0) {
            const pct = (video.currentTime / video.duration) * 100;
            progressFill.style.width = `${pct}%`;
            const remaining = Math.ceil(video.duration - video.currentTime);
            statusText.textContent = `Ad ends in ${remaining}s`;
          }
        };

        video.onended = completeAd;

        // Fallback timeout: complete after 30s regardless
        setTimeout(completeAd, 30000);
      } else {
        // No media file found, timeout-based reward
        statusText.textContent = "Preparing content...";
        setTimeout(completeAd, 5000);
      }
    })
    .catch(() => {
      // VAST fetch failed — timeout-based fallback
      statusText.textContent = "Loading...";
      setTimeout(completeAd, 3000);
    });
}

// --- Main Hook: Process AI Response ---
export interface AdActions {
  showBanner: boolean;
  showInterstitial: boolean;
  showUnlockPrompt: boolean;
}

export function onUserMessage(): void {
  state.userMessageCount++;
  state.totalMessageCount++;
  trackEvent("message_count");
}

export function onAiResponse(aiResponse: string): AdActions {
  state.totalMessageCount++;

  // Run adblock check once
  if (!state.adblockDetected && state.totalMessageCount === 2) {
    checkAdblock();
  }

  return {
    showBanner: shouldShowBanner(),
    showInterstitial: shouldShowInterstitial(aiResponse),
    showUnlockPrompt: shouldShowUnlockPrompt(aiResponse),
  };
}

export function resetAdState(): void {
  state.userMessageCount = 0;
  state.totalMessageCount = 0;
  state.events = [];
}

export function getAdEvents() {
  return [...state.events];
}
