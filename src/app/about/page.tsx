import type { Metadata } from "next";
import Link from "next/link";
import { AdvisorAvatar } from "@/components/ui/AdvisorAvatar";

export const metadata: Metadata = {
  title: "About Tempo — Our Story",
  description:
    "Tempo was built by two former home care workers who saw the cost of clothing designed without disabled people in mind. This is our story.",
};

// ─── Advisory Board Data ──────────────────────────────────────────────────────

const advisors = [
  {
    initials: "A.O.",
    name: "Amara Osei",
    role: "Disability Rights Attorney & Style Consultant",
    bio: "Amara specializes in ADA compliance and adaptive fashion policy. She advises Tempo on legal language, accessibility standards, and garment design review.",
    avatarBg: "#C29E5F",
    avatarText: "#1A1A1A",
  },
  {
    initials: "C.R.",
    name: "Carlos Rivera",
    role: "Occupational Therapist, Spinal Cord Injury Rehab",
    bio: "Carlos works with post-stroke and SCI patients on daily living skills. He leads Tempo's time-to-dress research and adaptive feature testing protocols.",
    avatarBg: "#7A8B75",
    avatarText: "#FAFAF7",
  },
  {
    initials: "S.W.",
    name: "Simone Walsh",
    role: "Wheelchair User, Fashion Blogger",
    bio: "Simone runs 'Rolling in Style,' a platform documenting adaptive fashion for full-time wheelchair users. She advises on seated-cut design and the social dimension of adaptive clothing.",
    avatarBg: "#C4725A",
    avatarText: "#FAFAF7",
  },
  {
    initials: "K.T.",
    name: "Dr. Keiko Tanaka",
    role: "Occupational Therapy Faculty, Disability Studies",
    bio: "Dr. Tanaka researches the intersection of disability studies and material culture. She advises Tempo on community accountability, ablesaviorism prevention, and academic rigor.",
    avatarBg: "#1A1A1A",
    avatarText: "#C29E5F",
  },
  {
    initials: "J.N.",
    name: "James Nkrumah",
    role: "Home Care Aide & Disability Advocate",
    bio: "James has 12 years of experience as a paid home care aide. He advises on caregiver workflow, institutional laundry requirements, and the realities of time-pressure dressing.",
    avatarBg: "#D4C9BA",
    avatarText: "#1A1A1A",
  },
];

// ─── Brand Commitments Data ───────────────────────────────────────────────────

const commitments = [
  {
    heading: "Design with, not for",
    body: "Every garment design goes through our disabled advisory board before production. Disabled advisors are compensated at $175 per consulting hour plus a 0.5 percent royalty on every piece they co-designed. Every advisor is credited by name with a linked portfolio.",
  },
  {
    heading: "Transparent materials",
    body: "Every garment ships with a Digital Product Passport. Fiber composition, factory location, certifications, carbon footprint — all publicly accessible, scannable at the tag.",
  },
  {
    heading: "Caregiver-first, always",
    body: "Caregiver Mode is a first-class product feature, not an afterthought. Time-to-dress estimates and sterilization compatibility are product specs, not marketing bullets.",
  },
  {
    heading: "Publicly correctable",
    body: "If a disabled advocate or writer identifies a problem with our design, marketing, or language, we respond publicly within 24 hours and publish our correction. We don't defend. We adjust.",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AboutPage() {
  return (
    <div className="bg-[#E8DFD2] min-h-screen">

      {/* ── Opening: Home Care Origin Story ─────────────────────────────────── */}
      <section
        className="bg-[#1A1A1A] py-20 px-4 sm:px-6 lg:px-8"
        aria-labelledby="origin-heading"
      >
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-semibold text-[#C29E5F] uppercase tracking-widest mb-6">
            Our Story
          </p>
          <h1
            id="origin-heading"
            className="font-playfair text-4xl sm:text-5xl font-bold text-[#FAFAF7] leading-tight mb-8"
          >
            We built this from a fourteen-dollar-an-hour job.
          </h1>
          <div className="flex flex-col gap-6">
            <p className="text-[#D4C9BA] text-base sm:text-lg leading-relaxed">
              Before we worked in consulting, we both worked in home care. Not
              as executives visiting a facility — as paid workers doing the
              daily dressing, bathing, and transport for disabled clients. Tesfa
              watched a seated client, sixty-three years old, spend fifteen
              minutes putting on a pair of four ninety-nine pants — pants
              designed for two functioning hands. That&apos;s ninety hours a
              year, just for pants.
            </p>
            <p className="text-[#D4C9BA] text-base sm:text-lg leading-relaxed">
              Bityana was in a different home watching a caregiver throw out her
              back lifting a client whose shirt didn&apos;t have the right
              opening. She was making fourteen dollars an hour. She
              couldn&apos;t afford to take a week off. Fashion wasn&apos;t the
              problem. Fashion had just never been the solution. Tempo is our
              attempt to change that — not with charity, but with product.
            </p>
          </div>
        </div>
      </section>

      {/* ── Founder Bios ─────────────────────────────────────────────────────── */}
      <section
        className="bg-[#FAFAF7] py-20 px-4 sm:px-6 lg:px-8 border-b border-[#D4C9BA]"
        aria-labelledby="founders-heading"
      >
        <div className="max-w-4xl mx-auto">
          <h2
            id="founders-heading"
            className="font-playfair text-3xl sm:text-4xl font-bold text-[#1A1A1A] mb-12 text-center"
          >
            The founders
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {/* Tesfa Desta */}
            <div className="bg-[#E8DFD2] border border-[#D4C9BA] rounded-xl p-6 flex flex-col gap-4">
              {/* Avatar */}
              <AdvisorAvatar
                initials="T.D."
                name="Tesfa Desta"
                avatarBg="#C29E5F"
                avatarText="#1A1A1A"
                size="md"
              />
              <div>
                <h3 className="font-playfair text-xl font-semibold text-[#1A1A1A]">
                  Tesfa Desta
                </h3>
                <p className="text-sm text-[#7A8B75] font-medium mb-3">
                  Co-Founder, Desta &amp; Yishak Consulting
                </p>
                <p className="text-sm text-[#5A5A5A] leading-relaxed">
                  Tesfa brings a background in home care and digital marketing
                  strategy. At Tempo, he leads brand narrative, product
                  positioning, and the adaptive design brief. He is a founding
                  advisor for CICDC 2026&apos;s Digital Marketing Strategies
                  track.
                </p>
              </div>
            </div>

            {/* Bityana Yishak */}
            <div className="bg-[#E8DFD2] border border-[#D4C9BA] rounded-xl p-6 flex flex-col gap-4">
              {/* Avatar */}
              <AdvisorAvatar
                initials="B.Y."
                name="Bityana Yishak"
                avatarBg="#7A8B75"
                avatarText="#FAFAF7"
                size="md"
              />
              <div>
                <h3 className="font-playfair text-xl font-semibold text-[#1A1A1A]">
                  Bityana Yishak
                </h3>
                <p className="text-sm text-[#7A8B75] font-medium mb-3">
                  Co-Founder, Desta &amp; Yishak Consulting
                </p>
                <p className="text-sm text-[#5A5A5A] leading-relaxed">
                  Bityana leads market research, financial modeling, and the
                  digital ecosystem strategy at Tempo. Her work translates the
                  lived realities of the adaptive fashion market into defensible
                  unit economics and operational plans.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Advisory Board ───────────────────────────────────────────────────── */}
      <section
        className="bg-[#E8DFD2] py-20 px-4 sm:px-6 lg:px-8"
        aria-labelledby="advisory-heading"
      >
        <div className="max-w-5xl mx-auto">
          <div className="max-w-3xl mb-12">
            <h2
              id="advisory-heading"
              className="font-playfair text-3xl sm:text-4xl font-bold text-[#1A1A1A] mb-4"
            >
              Our Advisory Board
            </h2>
            <p className="text-[#5A5A5A] text-base sm:text-lg leading-relaxed">
              Disabled people are not our inspiration. They are our advisors,
              co-designers, and critics — compensated, credited, and present at
              every product and marketing decision.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {advisors.map((advisor) => (
              /* PLACEHOLDER — replace with real advisor before launch */
              <div
                key={advisor.name}
                className="bg-[#FAFAF7] border border-[#D4C9BA] rounded-xl p-6 flex flex-col gap-4"
              >
                {/* Avatar */}
                <AdvisorAvatar
                  initials={advisor.initials}
                  name={advisor.name}
                  avatarBg={advisor.avatarBg}
                  avatarText={advisor.avatarText}
                  size="sm"
                />

                <div>
                  <h3 className="font-semibold text-[#1A1A1A] text-base mb-0.5">
                    {advisor.name}
                  </h3>
                  <p className="text-xs text-[#5A5A5A] font-medium mb-3 leading-snug">
                    {advisor.role}
                  </p>
                  <p className="text-sm text-[#5A5A5A] leading-relaxed">
                    {advisor.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-sm italic text-neutral-600 mt-8">
            Compensation is disclosed annually in our public advisor compensation
            report. First report due Q1 2027 at{" "}
            <Link
              href="/governance"
              className="underline underline-offset-2 hover:text-neutral-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] rounded"
            >
              tempo.style/governance
            </Link>
            .
          </p>
        </div>
      </section>

      {/* ── Brand Commitments ────────────────────────────────────────────────── */}
      <section
        className="bg-[#FAFAF7] py-20 px-4 sm:px-6 lg:px-8"
        aria-labelledby="commitments-heading"
      >
        <div className="max-w-4xl mx-auto">
          <h2
            id="commitments-heading"
            className="font-playfair text-3xl sm:text-4xl font-bold text-[#1A1A1A] mb-12 text-center"
          >
            What we commit to
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {commitments.map((commitment, idx) => (
              <div
                key={idx}
                className="bg-[#E8DFD2] border border-[#D4C9BA] rounded-xl p-6 flex flex-col gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-[#C29E5F] flex items-center justify-center shrink-0">
                  <span
                    className="text-[#1A1A1A] font-bold text-sm"
                    aria-hidden="true"
                  >
                    {idx + 1}
                  </span>
                </div>
                <h3 className="font-playfair text-lg font-semibold text-[#1A1A1A]">
                  {commitment.heading}
                </h3>
                <p className="text-sm text-[#5A5A5A] leading-relaxed">
                  {commitment.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
