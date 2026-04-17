"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type SpeechState = "idle" | "listening" | "processing" | "error";

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
  error?: string;
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

interface SpeechRecognitionInstance {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

function getSpeechRecognition(): SpeechRecognitionConstructor | undefined {
  if (typeof window === "undefined") return undefined;
  const w = window as Window & {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition;
}

interface UseSpeechRecognitionOptions {
  onResult: (transcript: string, isFinal: boolean) => void;
  onError?: (message: string) => void;
  continuous?: boolean;
  lang?: string;
}

export function useSpeechRecognition({
  onResult,
  onError,
  continuous = false,
  lang = "en-US",
}: UseSpeechRecognitionOptions) {
  const [state, setState] = useState<SpeechState>("idle");
  const [supported, setSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const onResultRef = useRef(onResult);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onResultRef.current = onResult;
    onErrorRef.current = onError;
  });

  useEffect(() => {
    setSupported(typeof getSpeechRecognition() !== "undefined");
  }, []);

  const start = useCallback(() => {
    const SpeechRecognition = getSpeechRecognition();
    if (!SpeechRecognition) {
      setState("error");
      onErrorRef.current?.("Speech recognition is not supported in this browser.");
      return;
    }

    recognitionRef.current?.abort();

    const rec = new SpeechRecognition();
    rec.lang = lang;
    rec.continuous = continuous;
    rec.interimResults = true;
    rec.maxAlternatives = 1;

    rec.onstart = () => setState("listening");

    rec.onresult = (event) => {
      const result = event.results[event.results.length - 1];
      if (!result) return;
      const transcript = result[0]?.transcript ?? "";
      const isFinal = result.isFinal;
      if (isFinal) setState("processing");
      onResultRef.current(transcript, isFinal);
    };

    rec.onerror = (event) => {
      if (event.error === "aborted" || event.error === "no-speech") {
        setState("idle");
        return;
      }
      setState("error");
      onErrorRef.current?.(
        event.error === "not-allowed"
          ? "Microphone access was denied."
          : `Speech error: ${event.error}`
      );
    };

    rec.onend = () => {
      setState((prev) => (prev === "listening" ? "idle" : prev));
    };

    recognitionRef.current = rec;
    rec.start();
  }, [lang, continuous]);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    setState("idle");
  }, []);

  const abort = useCallback(() => {
    recognitionRef.current?.abort();
    setState("idle");
  }, []);

  useEffect(() => () => { recognitionRef.current?.abort(); }, []);

  return { state, supported, start, stop, abort };
}
