# Tempo CICDC 2026 Demo Script

**Format:** Live browser walkthrough, 8-10 minutes  
**URL:** tempo.style (or localhost:3000 for local demo)  
**Presenter:** Tesfa Desta and/or Bityana Yishak

---

## Step 1: Open the homepage

Open tempo.style in a full-screen browser window (1440px wide if possible).

**Say:** "This is Tempo. Adaptive fashion, sustainable materials, and a design process built with disabled co-designers. The three nav items you see, Women, Men, and Adaptive, each link to a first-class storefront. Adaptive is not a sub-category. It has the same product depth, the same filtering, and the same checkout flow."

Point to the primary nav: Women, Men, Adaptive, Virtual Fitting, Passports.

---

## Step 2: Click "Adaptive" in the nav

Navigate to /shop?gender=adaptive.

**Say:** "The Adaptive category is pre-filtered, but the filter sidebar gives the buyer full control. You can narrow by condition, size, price range, and specific adaptive features. None of that logic is different from the Women's or Men's storefronts."

Hover over one or two product cards to show the hover state and the condition badges.

---

## Step 3: Toggle Caregiver Mode

Click the Caregiver Mode toggle in the top-right of the shop page.

**Say:** "Caregiver Mode is a product spec, not a marketing feature. When it's on, every card shows the time-to-dress estimate and a sterilization compatibility flag. Home care agencies and institutional buyers told us these were the two data points they actually needed. We added them as structured data, not copy."

Show a card with time-to-dress and the sterilization-safe badge visible.

---

## Step 4: Open a product detail page

Click on an Adaptive product (e.g., Magnetic-Close Overshirt, TMP-011).

**Say:** "This is the product detail page. Above the fold: name, price, the financial support disclosure, long description, and the conditions this garment was designed for."

Scroll slowly down the page.

**Say:** "Adaptive features are listed as structured items with icons. Certifications are surfaced. Size selection and add-to-cart are keyboard-reachable."

---

## Step 5: Show the Digital Product Passport

On the product detail page, scroll to the Digital Product Passport section.

**Say:** "Every garment ships with a Digital Product Passport. This QR code links to the garment's full materials chain: fiber origin, certifications, carbon footprint, water usage, and sterilization compatibility. This is ESPR-aligned. The EU Digital Product Passport regulation doesn't go live until 2026 but we built to spec now."

Click "View full passport" to open the passport page.

Point to the sustainability data: CO2e, water usage, recyclability score.

---

## Step 6: Navigate to AI Virtual Fitting

Click "Virtual Fitting" in the primary nav, or navigate to /fit.

**Say:** "AI Virtual Fitting lets a buyer see any garment on their own image before purchasing. All processing is on-device. No frames are uploaded, transmitted, or stored. This matters for buyers who may not want their medical equipment or mobility aids appearing in a company's database."

Point to the Wheelchair Mode callout.

**Say:** "Wheelchair Mode adjusts garment positioning for seated body proportions. It's toggleable with the W key during a session. This was built from feedback from our advisor Simone Walsh, who runs Rolling in Style."

---

## Step 7: Open a try-on session

Click any product on the /fit page to open /fit/[slug].

**Say:** "The try-on interface gives you live garment overlay, zoom and pan, wheelchair mode toggle, and a share-your-look button. The session earns loyalty points. This is the full product, running in a browser, no app install."

(If a camera is available: briefly activate the camera feed. If not: describe the interface.)

---

## Step 8: Show the Match-Set Builder

Navigate to /style/build.

**Say:** "The Match-Set Builder uses adaptive compatibility scoring. When you navigate the top swiper, the bottom swiper re-orders to show the most compatible bottoms first, based on shared adaptive features and complementary closures. You can save a set to your browser and add both pieces to cart in one click."

Navigate the top swiper, watch bottoms re-order, show the "Matches this top" badge.

Toggle Caregiver Mode on the builder page and show the filter that narrows to Adaptive products.

---

## Step 9: Return to Shop, show filter system

Navigate to /shop with no gender filter.

**Say:** "The filter sidebar handles category, conditions, sizes, and price range. The gender chips are URL-persistent, so a buyer can bookmark /shop?gender=adaptive and share it. The product count updates live as filters change. This entire filter state is client-side, no server roundtrip."

Apply a condition filter and show the count update.

---

## Step 10: Open the Brief page

Navigate to /brief.

**Say:** "The brief page is our internal accountability document, public because we think it should be. It covers the three-category architecture, the market thesis, the advisor compensation model, and a description of every differentiated feature. We use this internally to ask: are we doing what we said we would do?"

Show the category architecture section and the differentiators grid.

Close with: "Tempo is live at tempo.style. The full catalog, Digital Product Passports, Virtual Fitting, and Match-Set Builder are all navigable today."

---

## Backup: Advisor accountability

If asked about who built this:

Navigate to /about and show the Advisory Board section.

**Say:** "Five disabled advisors are compensated at $175 per hour plus a 0.5 percent royalty on garments they co-designed. Compensation is disclosed annually. Advisors have authority over product copy and marketing language. This is not a board that rubber-stamps decisions."

---

## Common questions

**"Is this a real product line?"**  
The catalog is a funded prototype. We are in conversations with three adaptive fashion labels about production licensing. The DPP infrastructure is production-ready.

**"What's the Adaptive category revenue thesis?"**  
Disabled Americans have $490B in disposable income (American Institutes for Research, 2022). The adaptive clothing market is $54B by 2031. Most of that market is underserved by existing labels. We sell at $85-$165 per unit with a 62 percent gross margin at projected volume.

**"How do you handle returns for adaptive garments?"**  
All adaptive garments include a 60-day fit guarantee with prepaid return label. Caregiver-purchased items have a 90-day window.

**"What's the tech stack?"**  
Next.js 15 App Router, TypeScript strict, Tailwind v4, Vercel, shadcn/ui, Zustand. AI features use claude-sonnet-4-5. On-device virtual fitting uses MediaPipe.
