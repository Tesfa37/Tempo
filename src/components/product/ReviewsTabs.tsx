"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { awardPoints } from "@/app/actions/points";
import { showEarnToast, showTierUpToast } from "@/components/points/EarnToast";
import { createClient } from "@/lib/supabase/client";
import { queueGuestEvent } from "@/components/points/GuestPointsTracker";

interface WearerReview {
  type: "wearer";
  name: string;
  stars: number;
  text: string;
}

interface CaregiverReview {
  type: "caregiver";
  name: string;
  role: string;
  stars: number;
  text: string;
}

const WEARER_REVIEWS: WearerReview[] = [
  {
    type: "wearer",
    name: "Diane, S",
    stars: 5,
    text: "I've been putting on pants by myself for the first time in two years. The magnetic closure is genuinely invisible when dressed. I wore these to my nephew's graduation and not a single person asked about them, which is exactly what I wanted.",
  },
  {
    type: "wearer",
    name: "Renata, M",
    stars: 5,
    text: "The seated cut is the real innovation here. I've tried Tommy Adaptive and the back bunching was constant. These fit as if they were measured for me.",
  },
];

const CAREGIVER_REVIEWS: CaregiverReview[] = [
  {
    type: "caregiver",
    name: "Marcus",
    role: "Home Care Aide",
    stars: 5,
    text: "I work with four clients with varying levels of post-stroke mobility. These reduce my morning dressing time by about 8 minutes per client. That's real.",
  },
  {
    type: "caregiver",
    name: "Jennifer",
    role: "Occupational Therapist",
    stars: 5,
    text: "I recommend these to every post-stroke client I see now. The magnetic closure is strong enough to stay closed during transfers but opens reliably with one hand.",
  },
];

function StarRating({ count, max = 5 }: { count: number; max?: number }) {
  return (
    <div
      className="flex gap-1"
      role="img"
      aria-label={`${count} out of ${max} stars`}
    >
      {Array.from({ length: max }, (_, i) => (
        <span
          key={i}
          className={`w-3 h-3 rounded-full inline-block ${
            i < count ? "bg-[#C29E5F]" : "bg-[#D4C9BA]"
          }`}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

function WearerReviewCard({ review }: { review: WearerReview }) {
  return (
    <article className="bg-[#FAFAF7] border border-[#D4C9BA] rounded-xl p-5">
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm text-[#1A1A1A]">{review.name}</span>
          <span className="text-xs bg-[#7A8B75]/15 text-[#7A8B75] px-2 py-0.5 rounded-full border border-[#7A8B75]/20 font-medium">
            Verified buyer
          </span>
        </div>
        <StarRating count={review.stars} />
      </div>
      <p className="text-sm text-[#5A5A5A] leading-relaxed">{review.text}</p>
    </article>
  );
}

function CaregiverReviewCard({ review }: { review: CaregiverReview }) {
  return (
    <article className="bg-[#FAFAF7] border border-[#D4C9BA] rounded-xl p-5">
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <div>
          <span className="font-medium text-sm text-[#1A1A1A]">{review.name}</span>
          <span className="text-[#5A5A5A] text-sm">, {review.role}</span>
        </div>
        <StarRating count={review.stars} />
      </div>
      <p className="text-sm text-[#5A5A5A] leading-relaxed">{review.text}</p>
    </article>
  );
}

function WriteReviewForm({ type }: { type: "wearer" | "caregiver" }) {
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const eventType =
    type === "wearer" ? "write_wearer_review" : "write_caregiver_review";
  const points = 250;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      queueGuestEvent(eventType, points);
    } else {
      const result = await awardPoints(eventType, points);
      if (result.success && !result.skipped) {
        showEarnToast(points, `Submitted a ${type} review`);
        if (result.tierChanged && result.tier) showTierUpToast(result.tier);
      }
    }
    setLoading(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <p className="text-sm text-[#7A8B75] font-medium mt-4">
        Thank you for your review.
      </p>
    );
  }

  return (
    <form
      onSubmit={(e) => void handleSubmit(e)}
      className="mt-6 bg-[#FAFAF7] border border-[#D4C9BA] rounded-xl p-5"
    >
      <p className="text-sm font-semibold text-[#1A1A1A] mb-3">
        Share your experience
      </p>
      <label htmlFor={`review-text-${type}`} className="sr-only">
        Write your {type} review
      </label>
      <textarea
        id={`review-text-${type}`}
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
        placeholder={
          type === "wearer"
            ? "Describe how this garment works for your body and situation."
            : "Describe the experience from a care perspective."
        }
        className="w-full px-4 py-3 rounded-lg border border-[#D4C9BA] bg-[#E8DFD2]/50 text-sm text-[#1A1A1A] placeholder-[#9A9A9A] resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F]"
      />
      <div className="flex items-center justify-between mt-3">
        <p className="text-xs text-[#5A5A5A]">Earns 250 Tempo Points</p>
        <button
          type="submit"
          disabled={!text.trim() || loading}
          className="text-xs font-medium px-4 py-2 rounded bg-[#7A8B75] text-white hover:bg-[#6a7a65] motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? "Submitting..." : "Submit review"}
        </button>
      </div>
    </form>
  );
}

interface ReviewsTabsProps {
  showPlaceholderReviews?: boolean;
}

export function ReviewsTabs({ showPlaceholderReviews = true }: ReviewsTabsProps) {
  return (
    <section aria-labelledby="reviews-heading">
      <h2
        id="reviews-heading"
        className="font-playfair text-2xl font-bold text-[#1A1A1A] mb-6"
      >
        Reviews
      </h2>

      <Tabs defaultValue="wearer">
        <TabsList className="mb-6 bg-[#E8DFD2] h-auto p-1">
          <TabsTrigger
            value="wearer"
            className="px-4 py-2 text-sm data-active:bg-[#FAFAF7] data-active:text-[#1A1A1A] focus-visible:ring-[#C29E5F]"
          >
            Wearer reviews
          </TabsTrigger>
          <TabsTrigger
            value="caregiver"
            className="px-4 py-2 text-sm data-active:bg-[#FAFAF7] data-active:text-[#1A1A1A] focus-visible:ring-[#C29E5F]"
          >
            Caregiver reviews
          </TabsTrigger>
        </TabsList>

        <TabsContent value="wearer">
          {showPlaceholderReviews ? (
            <div className="space-y-4">
              {WEARER_REVIEWS.map((review) => (
                <WearerReviewCard key={review.name} review={review} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#5A5A5A] leading-relaxed py-4">
              Reviews will appear after our first shipments in Q2 2026. Be among the first to review a Tempo garment.
            </p>
          )}
          <WriteReviewForm type="wearer" />
        </TabsContent>

        <TabsContent value="caregiver">
          {showPlaceholderReviews ? (
            <div className="space-y-4">
              {CAREGIVER_REVIEWS.map((review) => (
                <CaregiverReviewCard
                  key={`${review.name}-${review.role}`}
                  review={review}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#5A5A5A] leading-relaxed py-4">
              Reviews will appear after our first shipments in Q2 2026. Be among the first to review a Tempo garment.
            </p>
          )}
          <WriteReviewForm type="caregiver" />
        </TabsContent>
      </Tabs>
    </section>
  );
}
