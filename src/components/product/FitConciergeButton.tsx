"use client";

import { useRef, useState } from "react";
import { Mic, MicOff, BookmarkCheck, Share2 } from "lucide-react";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { awardPoints } from "@/app/actions/points";
import { showEarnToast, showTierUpToast } from "@/components/points/EarnToast";
import {
  saveConversation,
  generateShareSummary,
  type ConversationMessage,
} from "@/app/actions/conversations";

const CHIPS = [
  {
    label: "I use a wheelchair full time",
    starter:
      "I use a wheelchair full time. What trousers do you recommend for all-day seated wear?",
  },
  {
    label: "I have limited hand mobility",
    starter:
      "I have limited hand mobility. Which garments can I put on independently?",
  },
  {
    label: "Dressing for a caregiver client",
    starter:
      "I'm a caregiver. My client has post-stroke paralysis. What should I know about dressing time and closures?",
  },
  {
    label: "First time buying adaptive",
    starter:
      "I'm new to adaptive clothing and not sure where to start. What would you recommend?",
  },
] as const;

export function FitConciergeButton() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pointsAwarded, setPointsAwarded] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [sharing, setSharing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    state: micState,
    supported: micSupported,
    start: micStart,
    stop: micStop,
  } = useSpeechRecognition({
    onResult: (text, isFinal) => {
      setInput(text);
      if (isFinal) micStop();
    },
  });

  const hasResponse = conversation.some((m) => m.role === "assistant");

  async function handleAsk() {
    if (!input.trim() || loading) return;
    const text = input.trim();
    setLoading(true);
    setError("");
    setInput("");
    // Reset save/share state when a new message is sent
    setSavedId(null);
    setShareUrl(null);

    const userMessage: ConversationMessage = { role: "user", content: text };
    const updatedConversation = [...conversation, userMessage];
    setConversation(updatedConversation);

    try {
      const res = await fetch("/api/fit-concierge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedConversation }),
      });

      if (!res.ok) {
        setError(
          "The Fit Concierge is temporarily unavailable. Please try again."
        );
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) {
        setError("Unable to read response.");
        return;
      }

      const decoder = new TextDecoder();
      let fullText = "";

      setConversation((prev) => [
        ...prev,
        { role: "assistant", content: "" },
      ]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullText += decoder.decode(value, { stream: true });
        setConversation((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: fullText,
          };
          return updated;
        });
      }

      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

      if (!pointsAwarded) {
        const pointResult = await awardPoints("complete_fit_concierge", 50);
        if (pointResult.success && !pointResult.skipped) {
          setPointsAwarded(true);
          showEarnToast(50, "Used the Fit Concierge");
          if (pointResult.tierChanged && pointResult.tier)
            showTierUpToast(pointResult.tier);
        }
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!hasResponse || saving || savedId) return;
    setSaving(true);
    const result = await saveConversation(conversation);
    if (result.success) {
      setSavedId(result.conversationId);
      if (result.pointsAwarded) {
        toast("Conversation saved to your passport", {
          description: "+50 Tempo Points earned",
          duration: 4000,
        });
      } else {
        toast("Conversation saved", { duration: 3000 });
      }
    } else {
      toast.error("Could not save conversation. Please try again.");
    }
    setSaving(false);
  }

  async function handleShare() {
    if (!savedId || sharing) return;
    setSharing(true);
    const result = await generateShareSummary(savedId);
    if (result.success) {
      setShareUrl(result.shareUrl);
      const fullUrl = `${window.location.origin}${result.shareUrl}`;
      try {
        await navigator.clipboard.writeText(fullUrl);
        toast("Share link copied to clipboard", {
          description:
            "Send this link to a caregiver or occupational therapist.",
          duration: 5000,
        });
      } catch {
        toast("Share link ready", { description: fullUrl, duration: 10000 });
      }
    } else {
      toast.error("Could not generate share link. Please try again.");
    }
    setSharing(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      void handleAsk();
    }
  }

  return (
    <>
      <button
        type="button"
        data-fit-concierge-trigger
        onClick={() => setOpen(true)}
        className="w-full py-3 px-6 rounded-lg bg-[#C29E5F] text-white font-medium text-sm hover:bg-[#a8874f] motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] focus-visible:ring-offset-2"
      >
        Not sure about fit? Ask our Fit Concierge
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-md p-0 flex flex-col"
        >
          <SheetHeader className="px-6 pt-8 pb-4 border-b border-[#D4C9BA] flex-shrink-0">
            <SheetTitle className="font-playfair text-xl text-[#1A1A1A]">
              AI Fit Concierge
            </SheetTitle>
            <SheetDescription className="text-[#5A5A5A] text-sm mt-1">
              Describe your situation and I will recommend from our catalog.
            </SheetDescription>
          </SheetHeader>

          {/* Scrollable conversation area */}
          <div className="flex-1 overflow-y-auto px-6 py-4 min-h-0">
            {/* Suggestion chips - shown when no conversation yet */}
            {conversation.length === 0 && (
              <div
                className="flex flex-wrap gap-2 mb-5"
                role="group"
                aria-label="Quick start options"
              >
                {CHIPS.map((chip) => (
                  <button
                    key={chip.label}
                    type="button"
                    onClick={() => setInput(chip.starter)}
                    className="text-xs px-3 py-1.5 rounded-full border border-[#7A8B75]/40 bg-[#7A8B75]/10 text-[#7A8B75] hover:bg-[#7A8B75]/20 motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F]"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            )}

            {/* Chat messages */}
            {conversation.length > 0 && (
              <div
                className="space-y-3 mb-3"
                aria-label="Conversation history"
              >
                {conversation.map((msg, i) => (
                  <div
                    key={i}
                    className={`rounded-xl p-4 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-[#E8DFD2] border border-[#D4C9BA] text-[#1A1A1A] ml-8"
                        : "bg-[#FAFAF7] border border-[#D4C9BA] text-[#5A5A5A] mr-8"
                    }`}
                  >
                    <span className="font-medium text-xs uppercase tracking-wide text-[#9A9A9A] block mb-1.5">
                      {msg.role === "user" ? "You" : "Fit Concierge"}
                    </span>
                    {msg.content ? (
                      <span className="whitespace-pre-wrap">{msg.content}</span>
                    ) : (
                      <span className="motion-safe:animate-pulse text-[#9A9A9A] italic">
                        Thinking...
                      </span>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}

            {/* Screen-reader live region for streaming updates */}
            <div aria-live="polite" aria-atomic="true" className="sr-only">
              {loading
                ? "Fit Concierge is responding"
                : hasResponse && !loading
                ? "Response received"
                : ""}
            </div>

            {error && (
              <p className="text-sm text-[#C4725A]" role="alert">
                {error}
              </p>
            )}
          </div>

          {/* Pinned input area */}
          <div className="flex-shrink-0 px-6 pb-6 pt-3 border-t border-[#D4C9BA] bg-[#FAFAF7]">
            <div className="flex items-center justify-between mb-2">
              <label
                htmlFor="fit-concierge-input"
                className="text-sm font-medium text-[#1A1A1A]"
              >
                {conversation.length === 0
                  ? "Tell me about your fit needs"
                  : "Continue the conversation"}
              </label>
              {micSupported && (
                <button
                  type="button"
                  onClick={micState === "listening" ? micStop : micStart}
                  aria-label={
                    micState === "listening"
                      ? "Stop voice input"
                      : "Start voice input"
                  }
                  aria-pressed={micState === "listening"}
                  className={`p-1.5 rounded motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] ${
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
            </div>

            <textarea
              id="fit-concierge-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={3}
              placeholder={
                conversation.length === 0
                  ? "For example: I use a wheelchair full-time, and I need trousers that do not bunch at the back. I dress independently."
                  : "Ask a follow-up question..."
              }
              className="w-full px-4 py-3 rounded-lg border border-[#D4C9BA] bg-white text-sm text-[#1A1A1A] placeholder-[#5A5A5A] resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F]"
            />
            <p className="text-xs text-[#5A5A5A] mt-1 mb-3">
              Press Ctrl + Enter to submit
            </p>

            <button
              type="button"
              onClick={() => void handleAsk()}
              disabled={!input.trim() || loading}
              className="w-full py-3 px-6 rounded-lg bg-[#7A8B75] text-white font-medium text-sm hover:bg-[#6a7a65] motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? "Finding the right fit for you..." : "Ask Concierge"}
            </button>

            {/* Save + Share - visible after first assistant response */}
            {hasResponse && (
              <div className="flex gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => void handleSave()}
                  disabled={saving || !!savedId || loading}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-[#D4C9BA] bg-[#E8DFD2] text-xs text-[#5A5A5A] hover:bg-[#D4C9BA] motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <BookmarkCheck className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
                  {saving ? "Saving..." : savedId ? "Saved" : "Save to my passport"}
                </button>

                {savedId && (
                  <button
                    type="button"
                    onClick={() => void handleShare()}
                    disabled={sharing}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-[#D4C9BA] bg-[#E8DFD2] text-xs text-[#5A5A5A] hover:bg-[#D4C9BA] motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Share2 className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
                    {sharing
                      ? "Generating..."
                      : shareUrl
                      ? "Link copied"
                      : "Share transcript"}
                  </button>
                )}
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
