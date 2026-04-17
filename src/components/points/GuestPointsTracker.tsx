"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { migratePoints } from "@/app/actions/points";
import type { GuestEvent, PointsEventType } from "@/lib/points-catalog";

const GUEST_ID_KEY = "tempo_guest_id";
const GUEST_EVENTS_KEY = "tempo_guest_events";

export function queueGuestEvent(
  eventType: PointsEventType,
  points: number,
  metadata?: Record<string, unknown>
) {
  if (typeof window === "undefined") return;
  const raw = localStorage.getItem(GUEST_EVENTS_KEY);
  let events: GuestEvent[] = [];
  try {
    events = raw ? (JSON.parse(raw) as GuestEvent[]) : [];
  } catch {
    localStorage.removeItem(GUEST_EVENTS_KEY);
  }
  events.push({ eventType, points, metadata, queuedAt: new Date().toISOString() });
  localStorage.setItem(GUEST_EVENTS_KEY, JSON.stringify(events));
}

export function GuestPointsTracker() {
  useEffect(() => {
    if (!localStorage.getItem(GUEST_ID_KEY)) {
      localStorage.setItem(GUEST_ID_KEY, crypto.randomUUID());
    }

    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event) => {
      if (event !== "SIGNED_IN") return;
      const raw = localStorage.getItem(GUEST_EVENTS_KEY);
      if (!raw) return;
      let events: GuestEvent[];
      try {
        events = JSON.parse(raw) as GuestEvent[];
      } catch {
        localStorage.removeItem(GUEST_EVENTS_KEY);
        return;
      }
      if (events.length === 0) return;
      await migratePoints(events);
      localStorage.removeItem(GUEST_EVENTS_KEY);
    });

    return () => subscription.unsubscribe();
  }, []);

  return null;
}
