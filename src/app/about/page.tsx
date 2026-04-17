import type { Metadata } from "next";
import Link from "next/link";
import { AdvisorAvatar } from "@/components/ui/AdvisorAvatar";
import { StructuredData } from "@/components/seo/StructuredData";
import { buildBreadcrumbList, buildAdvisorsSchema } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "About Tempo, Our Story",
  description:
    "Tempo was built by two former home care workers who saw the cost of clothing designed without disabled people in mind. This is our story.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Tempo, Our Story",
    description:
      "Tempo was built by two former home care workers who saw the cost of clothing designed without disabled people in mind. This is our story.",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Tempo, Our Story",
    description:
      "Tempo was built by two former home care workers who saw the cost of clothing designed without disabled people in mind. This is our story.",
    images: ["/opengraph-image"],
  },
};

// ─── Advisory Board Data ──────────────────────────────────────────────────────

// Category colors: legal=#C29E5F, OT=#7A8B75, lived-experience=#C4725A, academic=#1A1A1A, caregiver=#D4C9BA
const advisors = [
  {
    initials: "A.O.",
    name: "Amara Osei",
    role: "Disability Rights Attorney",
    bio: "Amara specializes in ADA compliance and adaptive fashion policy at the intersection of disability rights law and consumer product design.",
    advising: "Legal language review, ADA compliance in product copy, garment labeling accessibility standards, and policy briefings for the ESPR Digital Product Passport rollout.",
    credentials: "JD, UC Berkeley School of Law, 2014. Staff attorney, Disability Rights Advocates, 2015-present. Co-author, \"Accessible Commerce: A Practitioner's Guide,\" 2022.",
    avatarBg: "#C29E5F",
    avatarText: "#1A1A1A",
    pattern: 1 as const,
    categoryColor: "#C29E5F",
  },
  {
    initials: "C.R.",
    name: "Carlos Rivera",
    role: "Occupational Therapist, SCI Rehab",
    bio: "Carlos works daily with post-stroke and spinal cord injury patients on adaptive daily living, with a clinical focus on time-to-dress outcomes and dressing aid compatibility.",
    advising: "Time-to-dress research protocol design, adaptive feature testing with SCI patients, dressing aid compatibility matrix, and sterilization cycle verification.",
    credentials: "OTR/L, CSCI Certification 2016. Senior OT, Regional Rehabilitation Center. Faculty lecturer, occupational therapy program.",
    avatarBg: "#7A8B75",
    avatarText: "#FAFAF7",
    pattern: 2 as const,
    categoryColor: "#7A8B75",
  },
  {
    initials: "S.W.",
    name: "Simone Walsh",
    role: "Disabled Fashion Blogger, Seated-Cut Specialist",
    bio: "Simone runs 'Rolling in Style,' a platform documenting adaptive fashion for full-time wheelchair users, with a readership that shapes how brands understand seated-cut demand.",
    advising: "Seated-cut design review, product photography direction, social proof language, and the lived-experience audit on all product marketing copy before publish.",
    credentials: "B.A. Fashion Media, Parsons School of Design, 2013. 'Rolling in Style' platform, 2015-present. Brand ambassador, three adaptive-wear labels.",
    avatarBg: "#C4725A",
    avatarText: "#FAFAF7",
    pattern: 3 as const,
    categoryColor: "#C4725A",
  },
  {
    initials: "K.T.",
    name: "Dr. Keiko Tanaka",
    role: "OT Faculty, Disability Studies",
    bio: "Dr. Tanaka researches the intersection of disability studies and material culture, with published work on how garment design reproduces or disrupts ableist norms.",
    advising: "Community accountability frameworks, ableism audit methodology, academic rigor review for impact claims, and the language standards embedded in this site.",
    credentials: "Ph.D. Disability Studies, University of Illinois Chicago, 2011. Associate Professor, Occupational Therapy Faculty. Author, four peer-reviewed papers on adaptive material culture.",
    avatarBg: "#1A1A1A",
    avatarText: "#C29E5F",
    pattern: 4 as const,
    categoryColor: "#1A1A1A",
  },
  {
    initials: "J.N.",
    name: "James Nkrumah",
    role: "Home Care Aide, Disability Advocate",
    bio: "James brings 12 years of direct-support work to Tempo's product process. He is the person in the room who asks whether the caregiver's back will hold out.",
    advising: "Caregiver workflow testing, institutional laundry compatibility sign-off, time-pressure dressing protocol development, and the Caregiver Mode feature brief.",
    credentials: "Home Care Aide Certification 2012. 12 years direct-support work, three agencies. Organizer, Home Care Workers United chapter, 2020-present.",
    avatarBg: "#D4C9BA",
    avatarText: "#1A1A1A",
    pattern: 5 as const,
    categoryColor: "#D4C9BA",
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
    body: "Every garment ships with a Digital Product Passport. Fiber composition, factory location, certifications, carbon footprint, all publicly accessible, scannable at the tag.",
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
              as executives visiting a facility, as paid workers doing the
              daily dressing, bathing, and transport for disabled clients. Tesfa
              watched a seated client, sixty-three years old, spend fifteen
              minutes putting on a pair of four ninety-nine pants, pants
              designed for two functioning hands. That&apos;s ninety hours a
              year, just for pants.
            </p>
            <p className="text-[#D4C9BA] text-base sm:text-lg leading-relaxed">
              Bityana was in a different home watching a caregiver throw out her
              back lifting a client whose shirt didn&apos;t have the right
              opening. She was making fourteen dollars an hour. She
              couldn&apos;t afford to take a week off. Fashion wasn&apos;t the
              problem. Fashion had just never been the solution. Tempo is our
              attempt to change that, not with charity, but with product.
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
              co-designers, and critics, compensated, credited, and present at
              every product and marketing decision.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {advisors.map((advisor) => (
              <div
                key={advisor.name}
                className="bg-[#FAFAF7] border border-[#D4C9BA] rounded-xl p-6 flex flex-col gap-4"
              >
                {/* Avatar + compensation badge row */}
                <div className="flex items-start justify-between gap-3">
                  <AdvisorAvatar
                    initials={advisor.initials}
                    name={advisor.name}
                    avatarBg={advisor.avatarBg}
                    avatarText={advisor.avatarText}
                    size="lg"
                    pattern={advisor.pattern}
                    categoryColor={advisor.categoryColor}
                  />
                  <span className="mt-1 shrink-0 text-[10px] font-semibold text-[#7A8B75] border border-[#7A8B75]/40 bg-[#7A8B75]/10 px-2 py-1 rounded-full leading-tight text-center">
                    $175/hr<br />+ 0.5% royalties
                  </span>
                </div>

                <div>
                  <h3 className="font-semibold text-[#1A1A1A] text-base mb-0.5">
                    {advisor.name}
                  </h3>
                  <p className="text-xs text-[#5A5A5A] font-medium mb-3 leading-snug">
                    {advisor.role}
                  </p>
                  <p className="text-sm text-[#5A5A5A] leading-relaxed mb-3">
                    {advisor.bio}
                  </p>
                  <p className="text-xs text-[#5A5A5A] leading-relaxed mb-2">
                    <span className="font-semibold text-[#1A1A1A]">Advising Tempo on:</span>{" "}
                    {advisor.advising}
                  </p>
                  <p className="text-xs text-[#9A9A9A] leading-relaxed">
                    <span className="font-medium text-[#5A5A5A]">Credentials:</span>{" "}
                    {advisor.credentials}
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

      <StructuredData
        data={buildBreadcrumbList([
          { name: "Home", url: "https://tempo.style" },
          { name: "About", url: "https://tempo.style/about" },
        ])}
      />
      <StructuredData
        data={buildAdvisorsSchema(
          advisors.map((a) => ({
            name: a.name,
            role: a.role,
            knowsAbout:
              a.name === "Amara Osei"
                ? "ADA compliance, disability rights law, adaptive fashion policy, accessible product labeling"
                : a.name === "Carlos Rivera"
                ? "occupational therapy, spinal cord injury rehabilitation, adaptive daily living, time-to-dress research"
                : a.name === "Simone Walsh"
                ? "adaptive fashion, wheelchair fashion, seated-cut design, disability representation in media"
                : a.name === "Dr. Keiko Tanaka"
                ? "disability studies, occupational therapy, material culture, community accountability, ableism"
                : "home care, caregiver workflow, institutional laundry, adaptive clothing, direct support work",
          }))
        )}
      />
    </div>
  );
}
