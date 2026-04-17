"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

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
    text: "I've been putting on pants by myself for the first time in two years. The magnetic closure is genuinely invisible when dressed. I wore these to my nephew's graduation and not a single person asked about them — which is exactly what I wanted.",
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

export function ReviewsTabs() {
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
          <div className="space-y-4">
            {WEARER_REVIEWS.map((review) => (
              <WearerReviewCard key={review.name} review={review} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="caregiver">
          <div className="space-y-4">
            {CAREGIVER_REVIEWS.map((review) => (
              <CaregiverReviewCard
                key={`${review.name}-${review.role}`}
                review={review}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
}
