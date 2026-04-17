"use client";

import { useState, useEffect } from "react";
import { Mic, MicOff, Volume2, Pause, Square, FileDown } from "lucide-react";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";

const SUGGESTION_CHIPS = [
  "What does GOTS certification guarantee?",
  "Why Portugal?",
  "Is this compatible with hospital laundry?",
  "How does the Take-Back program work?",
] as const;

type VoiceState = "idle" | "speaking" | "paused";

interface PassportNarratorButtonProps {
  sku: string;
}

async function readStream(
  res: Response,
  onChunk: (text: string) => void
): Promise<void> {
  const reader = res.body?.getReader();
  if (!reader) throw new Error("Unable to read response.");
  const decoder = new TextDecoder();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    onChunk(decoder.decode(value, { stream: true }));
  }
}

export function PassportNarratorButton({ sku }: PassportNarratorButtonProps) {
  const [summary, setSummary] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState("");
  const [shown, setShown] = useState(false);
  const [followUp, setFollowUp] = useState("");
  const [followUpResponse, setFollowUpResponse] = useState("");
  const [followUpStreaming, setFollowUpStreaming] = useState(false);
  const [voiceState, setVoiceState] = useState<VoiceState>("idle");
  const [hasSpeech, setHasSpeech] = useState(false);
  useEffect(() => {
    setHasSpeech(typeof window !== "undefined" && "speechSynthesis" in window);
  }, []);

  const {
    state: micState,
    supported: micSupported,
    start: micStart,
    stop: micStop,
  } = useSpeechRecognition({
    onResult: (text, isFinal) => {
      setFollowUp(text);
      if (isFinal) micStop();
    },
  });

  const handleClick = async () => {
    if (summary) {
      setShown((s) => !s);
      return;
    }
    setStreaming(true);
    setError("");
    setShown(true);
    try {
      const res = await fetch("/api/passport-narrator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sku }),
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? "Unable to generate summary.");
      }
      await readStream(res, (chunk) =>
        setSummary((prev) => prev + chunk)
      );
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Unable to generate summary. Please try again."
      );
    } finally {
      setStreaming(false);
    }
  };

  async function handleFollowUpWithText(question: string) {
    if (!question.trim()) return;
    setFollowUpStreaming(true);
    setFollowUpResponse("");
    try {
      const res = await fetch("/api/passport-narrator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sku, question }),
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? "Unable to answer that question.");
      }
      await readStream(res, (chunk) =>
        setFollowUpResponse((prev) => prev + chunk)
      );
    } catch (e) {
      setFollowUpResponse(
        e instanceof Error ? e.message : "Something went wrong. Please try again."
      );
    } finally {
      setFollowUpStreaming(false);
    }
  }

  function handleFollowUp() {
    void handleFollowUpWithText(followUp);
  }

  function handleChipClick(text: string) {
    setFollowUp(text);
    void handleFollowUpWithText(text);
  }

  function getPreferredVoice(): SpeechSynthesisVoice | null {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;
    const voices = speechSynthesis.getVoices();
    return (
      voices.find(
        (v) => v.name.includes("Natural") && v.lang.startsWith("en")
      ) ??
      voices.find((v) => v.lang.startsWith("en")) ??
      null
    );
  }

  function handleReadAloud() {
    if (!hasSpeech) return;
    if (voiceState === "speaking") {
      speechSynthesis.pause();
      setVoiceState("paused");
      return;
    }
    if (voiceState === "paused") {
      speechSynthesis.resume();
      setVoiceState("speaking");
      return;
    }
    const utterance = new SpeechSynthesisUtterance(summary);
    const voice = getPreferredVoice();
    if (voice) utterance.voice = voice;
    utterance.onend = () => setVoiceState("idle");
    speechSynthesis.speak(utterance);
    setVoiceState("speaking");
  }

  function handleStopVoice() {
    if (!hasSpeech) return;
    speechSynthesis.cancel();
    setVoiceState("idle");
  }

  const summaryReady = shown && !!summary && !streaming;

  return (
    <div className="mb-8">
      {/* Trigger button */}
      <button
        onClick={() => void handleClick()}
        disabled={streaming}
        className="inline-flex items-center gap-2 text-sm font-medium text-[#C29E5F] border border-[#C29E5F] px-4 py-2 rounded hover:bg-[#C29E5F]/10 transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F]"
        aria-expanded={shown}
        aria-controls="passport-summary"
      >
        {streaming
          ? "Generating plain-language summary..."
          : shown && summary
          ? "Hide plain-language summary"
          : "Tell me about this passport in plain language"}
      </button>

      {/* Streaming summary */}
      {shown && (summary || streaming) && (
        <div
          id="passport-summary"
          className="mt-4 p-4 bg-[#FAFAF7] border border-[#D4C9BA] rounded text-sm text-[#1A1A1A] leading-relaxed"
          role="region"
          aria-label="Plain-language passport summary"
          aria-live="polite"
        >
          {streaming && !summary && (
            <span className="sr-only">Generating summary...</span>
          )}
          {summary}
          {streaming && (
            <span
              className="motion-safe:animate-pulse ml-0.5"
              aria-hidden="true"
            >
              |
            </span>
          )}
        </div>
      )}

      {summaryReady && (
        <>
          {/* Voice controls */}
          {hasSpeech && (
            <div
              className="mt-3 flex items-center gap-2"
              role="group"
              aria-label="Read aloud controls"
            >
              <button
                type="button"
                onClick={handleReadAloud}
                aria-label={
                  voiceState === "speaking"
                    ? "Pause narration"
                    : voiceState === "paused"
                    ? "Resume narration"
                    : "Read aloud"
                }
                className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded border border-[#D4C9BA] bg-[#FAFAF7] text-[#5A5A5A] hover:bg-[#E8DFD2] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F]"
              >
                {voiceState === "speaking" ? (
                  <>
                    <Pause className="h-3.5 w-3.5" aria-hidden="true" />
                    Pause
                  </>
                ) : voiceState === "paused" ? (
                  <>
                    <Volume2 className="h-3.5 w-3.5" aria-hidden="true" />
                    Resume
                  </>
                ) : (
                  <>
                    <Volume2 className="h-3.5 w-3.5" aria-hidden="true" />
                    Read aloud
                  </>
                )}
              </button>
              {voiceState !== "idle" && (
                <button
                  type="button"
                  onClick={handleStopVoice}
                  aria-label="Stop narration"
                  className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded border border-[#D4C9BA] bg-[#FAFAF7] text-[#5A5A5A] hover:bg-[#E8DFD2] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F]"
                >
                  <Square className="h-3.5 w-3.5" aria-hidden="true" />
                  Stop
                </button>
              )}
            </div>
          )}

          {/* Suggestion chips */}
          <div
            className="mt-4 flex flex-wrap gap-2"
            role="group"
            aria-label="Follow-up suggestions"
          >
            {SUGGESTION_CHIPS.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => handleChipClick(chip)}
                disabled={followUpStreaming}
                className="text-xs px-3 py-1.5 rounded-full border border-[#7A8B75]/40 bg-[#7A8B75]/10 text-[#7A8B75] hover:bg-[#7A8B75]/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] disabled:opacity-50"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* PDF download */}
          <a
            href={`/api/passport-pdf/${sku}`}
            download={`tempo-passport-${sku}.pdf`}
            className="mt-4 inline-flex items-center gap-1.5 text-xs text-[#5A5A5A] border border-[#D4C9BA] px-3 py-1.5 rounded hover:bg-[#E8DFD2] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F]"
          >
            <FileDown className="h-3.5 w-3.5" aria-hidden="true" />
            Download passport PDF
          </a>

          {/* Free-text follow-up */}
          <div className="mt-4 flex flex-col gap-2">
            <p className="text-xs font-medium text-[#5A5A5A]">Ask a follow-up</p>
            <div className="flex gap-2 items-center">
              <input
                type="text"
                value={followUp}
                onChange={(e) => setFollowUp(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleFollowUp();
                }}
                placeholder="e.g. Is it safe to tumble dry?"
                aria-label="Follow-up question about this passport"
                className="flex-1 px-3 py-2 text-sm border border-[#D4C9BA] rounded bg-[#FAFAF7] text-[#1A1A1A] placeholder-[#9A9A9A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F]"
              />
              {micSupported && (
                <button
                  type="button"
                  onClick={micState === "listening" ? micStop : micStart}
                  aria-label={
                    micState === "listening"
                      ? "Stop voice input"
                      : "Dictate follow-up question"
                  }
                  aria-pressed={micState === "listening"}
                  className={`p-2 rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] ${
                    micState === "listening"
                      ? "bg-[#C4725A] text-white"
                      : "bg-[#E8DFD2] text-[#5A5A5A] hover:bg-[#D4C9BA]"
                  }`}
                >
                  {micState === "listening" ? (
                    <MicOff className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Mic className="h-4 w-4" aria-hidden="true" />
                  )}
                </button>
              )}
              <button
                type="button"
                onClick={handleFollowUp}
                disabled={!followUp.trim() || followUpStreaming}
                className="px-3 py-2 text-xs font-medium bg-[#7A8B75] text-white rounded hover:bg-[#6a7a65] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {followUpStreaming ? "…" : "Ask"}
              </button>
            </div>

            {(followUpResponse || followUpStreaming) && (
              <div
                className="p-3 bg-[#FAFAF7] border border-[#D4C9BA] rounded text-sm text-[#1A1A1A] leading-relaxed"
                aria-live="polite"
                role="region"
                aria-label="Follow-up answer"
              >
                {followUpStreaming && !followUpResponse && (
                  <span className="sr-only">Loading answer...</span>
                )}
                {followUpResponse}
                {followUpStreaming && (
                  <span
                    className="motion-safe:animate-pulse ml-0.5"
                    aria-hidden="true"
                  >
                    |
                  </span>
                )}
              </div>
            )}
          </div>
        </>
      )}

      {error && (
        <p className="mt-2 text-sm text-[#C4725A]" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
