import Link from "next/link";

export const metadata = {
  title: "How TempoPoints Work, Tempo",
  description:
    "Learn how TempoPoints are earned and weighted by sustainability impact. Scan passports, complete take-backs, refer caregivers, and more.",
  alternates: {
    canonical: "/points/how-it-works",
  },
};

const ACTIONS = [
  {
    event: "Scan a Digital Product Passport",
    points: 100,
    why: "Verifying material origins reduces information asymmetry and pushes brands toward supply-chain transparency. Every scan signals market demand for this data.",
  },
  {
    event: "Read a full product passport",
    points: 50,
    why: "Reading the full passport, not just scanning, deepens your understanding of a garment's environmental footprint and material provenance.",
  },
  {
    event: "Complete a Fit Concierge session",
    points: 50,
    why: "Getting fit right the first time reduces returns and the associated transport emissions.",
  },
  {
    event: "AI virtual fitting session",
    points: 75,
    why: "Trying before buying, without physical shipping, is the lowest-emission path to a purchase decision.",
  },
  {
    event: "Submit a wearer or caregiver review",
    points: 250,
    why: "Honest adaptive reviews are rare and disproportionately valuable to other disabled shoppers navigating a market that rarely documents fit for non-normative bodies.",
  },
  {
    event: "Refer a caregiver",
    points: 500,
    why: "Expanding the caregiver network brings more people into a purchasing model that values functional design over aesthetic conformity.",
  },
  {
    event: "Take-Back return",
    points: 1000,
    why: "Returning a garment for recycling or resale is the single highest-impact act in a garment's lifecycle. A 1,000-point award reflects that.",
  },
  {
    event: "Advocacy share",
    points: 150,
    why: "Each share expands the audience for adaptive fashion, building the commercial case that makes continued investment possible.",
  },
  {
    event: "Quarterly advocacy action",
    points: 300,
    why: "Structured advocacy, such as submitting public comment, attending a community event, or completing a designated campaign, creates durable policy and market pressure.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="bg-[#E8DFD2] min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="text-xs text-[#5A5A5A] mb-8">
          <Link href="/rewards" className="hover:text-[#1A1A1A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] rounded">
            Rewards
          </Link>
          {" / "}
          <span className="text-[#1A1A1A]">How it works</span>
        </nav>

        <h1 className="font-playfair text-4xl font-bold text-[#1A1A1A] mb-4">
          How TempoPoints work
        </h1>
        <p className="text-[#5A5A5A] leading-relaxed mb-10">
          TempoPoints are not a spending reward. Every action in the catalog maps to a measurable sustainability or community outcome. The point values reflect impact weight, not purchase value.
        </p>

        <ul className="flex flex-col gap-6" role="list">
          {ACTIONS.map((action) => (
            <li
              key={action.event}
              className="bg-[#FAFAF7] border border-[#D4C9BA] rounded-xl p-6"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <p className="text-sm font-semibold text-[#1A1A1A]">{action.event}</p>
                <span className="shrink-0 text-sm font-bold text-[#C29E5F]">
                  {action.points} pts
                </span>
              </div>
              <p className="text-sm text-[#5A5A5A] leading-relaxed">{action.why}</p>
            </li>
          ))}
        </ul>

        <div className="mt-12 p-6 bg-[#7A8B75]/10 border border-[#7A8B75]/20 rounded-xl">
          <p className="text-sm text-[#5A5A5A] leading-relaxed">
            Point values are reviewed annually by the Tempo advisor board, which includes disabled co-designers and sustainability researchers. Changes are published in the governance report at{" "}
            <Link href="/governance" className="text-[#7A8B75] underline underline-offset-2 hover:text-[#5a6b55] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] rounded">
              tempo.style/governance
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
