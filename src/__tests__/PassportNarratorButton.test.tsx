// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { PassportNarratorButton } from "@/components/passport/PassportNarratorButton";

vi.mock("@/hooks/useSpeechRecognition", () => ({
  useSpeechRecognition: () => ({
    state: "idle",
    supported: false,
    start: vi.fn(),
    stop: vi.fn(),
  }),
}));

function makeStreamFetch(text: string) {
  const encoder = new TextEncoder();
  const encoded = encoder.encode(text);
  let consumed = false;
  return vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    body: {
      getReader: () => ({
        read: vi.fn(() => {
          if (!consumed) {
            consumed = true;
            return Promise.resolve({ done: false, value: encoded });
          }
          return Promise.resolve({ done: true, value: undefined });
        }),
      }),
    },
  });
}

describe("PassportNarratorButton", () => {
  beforeEach(() => vi.clearAllMocks());

  it("chips are not visible before summary loads", () => {
    render(<PassportNarratorButton sku="TMP-001" />);
    expect(
      screen.queryByText("What does GOTS certification guarantee?")
    ).not.toBeInTheDocument();
  });

  it("chips are visible after summary streams in", async () => {
    vi.stubGlobal("fetch", makeStreamFetch("Safe for hospital laundry at 60C."));
    render(<PassportNarratorButton sku="TMP-001" />);
    fireEvent.click(
      screen.getByRole("button", { name: /plain language/i })
    );
    await waitFor(() => {
      expect(
        screen.getByText("What does GOTS certification guarantee?")
      ).toBeInTheDocument();
    });
  });

  it("clicking a chip fires a follow-up fetch with the chip text as question", async () => {
    const fetchMock = makeStreamFetch("Organic cotton standard.");
    vi.stubGlobal("fetch", fetchMock);
    render(<PassportNarratorButton sku="TMP-001" />);

    // Load initial summary
    fireEvent.click(screen.getByRole("button", { name: /plain language/i }));
    await waitFor(() =>
      expect(
        screen.getByText("What does GOTS certification guarantee?")
      ).toBeInTheDocument()
    );

    // Click chip — expect a second fetch call with the question field
    fireEvent.click(
      screen.getByText("What does GOTS certification guarantee?")
    );
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));

    const secondCall = fetchMock.mock.calls[1] as [string, RequestInit];
    const body = JSON.parse(secondCall[1].body as string) as {
      sku: string;
      question: string;
    };
    expect(body.sku).toBe("TMP-001");
    expect(body.question).toBe("What does GOTS certification guarantee?");
  });

  it("PDF download link points to the correct API route", async () => {
    vi.stubGlobal("fetch", makeStreamFetch("Summary text."));
    render(<PassportNarratorButton sku="TMP-002" />);
    fireEvent.click(screen.getByRole("button", { name: /plain language/i }));
    await waitFor(() =>
      expect(
        screen.getByText("What does GOTS certification guarantee?")
      ).toBeInTheDocument()
    );
    const link = screen.getByRole("link", { name: /download passport pdf/i });
    expect(link).toHaveAttribute("href", "/api/passport-pdf/TMP-002");
    expect(link).toHaveAttribute("download", "tempo-passport-TMP-002.pdf");
  });
});
