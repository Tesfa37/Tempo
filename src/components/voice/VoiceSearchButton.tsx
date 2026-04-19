"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Mic, MicOff, Loader2, HelpCircle } from "lucide-react";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { parseVoiceCommand } from "@/lib/voice-commands";

interface VoiceSearchButtonProps {
  onOpenHelp: () => void;
}

export function VoiceSearchButton({ onOpenHelp }: VoiceSearchButtonProps) {
  const router = useRouter();
  const [transcript, setTranscript] = useState("");
  const [statusMsg, setStatusMsg] = useState("");
  const [announcement, setAnnouncement] = useState("");

  const announce = (msg: string) => {
    setAnnouncement("");
    requestAnimationFrame(() => setAnnouncement(msg));
  };

  const handleResult = useCallback(
    (text: string, isFinal: boolean) => {
      setTranscript(text);
      if (!isFinal) return;

      const intent = parseVoiceCommand(text);

      if (intent.type === "navigate") {
        announce(`Navigating to ${intent.description}`);
        setStatusMsg(`Going to ${intent.description}…`);
        setTimeout(() => { router.push(intent.href); setTranscript(""); setStatusMsg(""); }, 600);
      } else if (intent.type === "filter") {
        announce(`Filtering: ${intent.description}`);
        setStatusMsg(`Showing ${intent.description}…`);
        setTimeout(() => { router.push(intent.href); setTranscript(""); setStatusMsg(""); }, 600);
      } else if (intent.type === "concierge") {
        announce("Opening Fit Concierge with your question");
        setStatusMsg("Opening Fit Concierge…");
        const btn = document.querySelector<HTMLButtonElement>("[data-fit-concierge-trigger]");
        btn?.click();
        const input = document.getElementById("fit-concierge-input") as HTMLTextAreaElement | null;
        if (input) {
          input.value = text;
          input.dispatchEvent(new Event("input", { bubbles: true }));
        }
        setTranscript("");
        setStatusMsg("");
      } else {
        announce("Command not recognised. Say 'help' for a list of commands.");
        setStatusMsg("Not recognised, try again");
        setTimeout(() => setStatusMsg(""), 2500);
        setTranscript("");
      }
    },
    [router]
  );

  const handleError = useCallback((msg: string) => {
    setStatusMsg(msg);
    setTimeout(() => setStatusMsg(""), 3000);
  }, []);

  const { state, supported, start, stop } = useSpeechRecognition({
    onResult: handleResult,
    onError: handleError,
  });

  // Ctrl+Space global shortcut
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if ((e.ctrlKey || e.metaKey) && e.code === "Space") {
        e.preventDefault();
        if (state === "listening") stop();
        else start();
      }
      if (e.key === "?" && !e.ctrlKey && !e.metaKey) {
        onOpenHelp();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [state, start, stop, onOpenHelp]);

  if (!supported) return null;

  const isListening = state === "listening";
  const isProcessing = state === "processing";

  return (
    <>
      {/* Screen reader live region */}
      <div aria-live="polite" aria-atomic="true" className="sr-only" role="status">
        {announcement}
      </div>

      {/* Status / transcript bubble */}
      {(isListening || isProcessing || statusMsg || transcript) && (
        <div
          className="fixed bottom-24 right-4 z-50 max-w-xs bg-[#1A1A1A]/90 text-[#FAFAF7] text-xs rounded-xl px-4 py-3 shadow-lg pointer-events-none"
          aria-hidden="true"
        >
          {isListening && !transcript && <span className="italic text-[#C29E5F]">Listening…</span>}
          {transcript && <span>{transcript}</span>}
          {statusMsg && <span className="block mt-1 text-[#7A8B75]">{statusMsg}</span>}
        </div>
      )}

      {/* Floating button group */}
      <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2">
        {/* Help */}
        <button
          type="button"
          onClick={onOpenHelp}
          aria-label="Voice command help"
          className="h-10 w-10 rounded-full bg-[#1A1A1A]/70 text-[#FAFAF7] flex items-center justify-center shadow hover:bg-[#1A1A1A] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F]"
        >
          <HelpCircle className="h-4 w-4" aria-hidden="true" />
        </button>

        {/* Mic */}
        <button
          type="button"
          onClick={isListening ? stop : start}
          aria-label={
            isListening
              ? "Stop listening (Ctrl+Space)"
              : "Start voice command (Ctrl+Space)"
          }
          aria-pressed={isListening}
          className={`h-14 w-14 rounded-full flex items-center justify-center shadow-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] focus-visible:ring-offset-2 ${
            isListening
              ? "bg-[#C4725A] animate-pulse scale-110"
              : isProcessing
              ? "bg-[#C29E5F]"
              : "bg-[#1A1A1A] hover:bg-[#2A2A2A]"
          }`}
        >
          {isProcessing ? (
            <Loader2 className="h-6 w-6 text-white animate-spin" aria-hidden="true" />
          ) : isListening ? (
            <MicOff className="h-6 w-6 text-white" aria-hidden="true" />
          ) : (
            <Mic className="h-6 w-6 text-white" aria-hidden="true" />
          )}
        </button>
      </div>
    </>
  );
}
