export interface FAQItem {
  id: string;
  q: string;
  a: string;
}

export interface FAQCategory {
  id: string;
  label: string;
  items: FAQItem[];
}

export const FAQ_CATEGORIES: FAQCategory[] = [
  {
    id: "sizing",
    label: "Sizing and Fit",
    items: [
      {
        id: "sizing-1",
        q: "How do I measure if I can't stand?",
        a: "All Tempo measurements are taken seated or lying down. For tops, measure the widest point of your chest and the distance from shoulder to wrist with your arm resting naturally. For bottoms, measure your waist at the navel level and your hip at the widest point. A printable seated measurement guide is available on any product page under the Fit Concierge.",
      },
      {
        id: "sizing-2",
        q: "Do you offer custom sizing?",
        a: "Tempo does not offer made-to-measure at this time. Each garment comes in a full size range from XS to 5X with extended lengths available for tops. The Fit Concierge can identify which size will work best given your specific measurements. Custom sizing is planned for the Architect-tier co-design program, expected in late 2026.",
      },
      {
        id: "sizing-3",
        q: "What if my size is between two options?",
        a: "Size up for tops and size based on the larger measurement for bottoms. Tempo garments have 1 to 2 inches of additional ease built in, which means a slightly larger size will not look oversized. The Fit Concierge can give a specific recommendation based on the garment's ease measurement and your body measurements.",
      },
      {
        id: "sizing-4",
        q: "How do adaptive cuts differ from standard sizing?",
        a: "Adaptive cuts account for seated posture, limited range of motion, and common assistive device proportions. Seated cuts add fabric at the back rise to prevent the waistband from pulling down when seated. Open-back designs allow dressing from the front. Ergonomic sleeve lengths are shorter at the back to avoid bunching in a wheelchair. These adjustments are built into the size, not added as alterations.",
      },
      {
        id: "sizing-5",
        q: "I use a wheelchair full time. Which garments suit seated posture?",
        a: 'All products tagged "Seated Cut" or "Wheelchair Fit" are designed specifically for full-time wheelchair users. The Seated-Cut Trouser and similar garments have a higher back rise, elasticated waistbands, and tapered legs that do not bunch at the footrest. The Fit Concierge will highlight these garments automatically if you indicate full-time wheelchair use.',
      },
      {
        id: "sizing-6",
        q: "My measurements changed after a medical event. Can I exchange?",
        a: "Yes. Contact us through the Fit Concierge within your return window and explain the situation. We will arrange a size exchange with return shipping covered. If your window has passed, any item can be returned through the Take-Back program for 1,000 TempoPoints, which can be applied toward a replacement.",
      },
      {
        id: "sizing-7",
        q: "How do I measure for someone else as a caregiver?",
        a: "The Fit Concierge supports caregiver-mode measurements. You can enter measurements for each care recipient separately under your Caregiver account. The tool will suggest sizes and flag garments suited to the recipient's conditions. A downloadable measurement worksheet for care facilities is available in your account.",
      },
      {
        id: "sizing-8",
        q: "What does the Fit Concierge recommend if I have asymmetric measurements?",
        a: "The Fit Concierge will size for the larger measurement and note the difference. For significant asymmetry (more than two size equivalents), it will suggest which side to prioritize based on the garment's closure and dressing style. For example, for a hemiplegia dressing scenario, it will suggest sizing for the affected side for ease of dressing.",
      },
      {
        id: "sizing-9",
        q: "Are size charts consistent across all products?",
        a: "Size charts are consistent within each product category (tops, bottoms, outerwear) but may vary slightly across categories. Each product page includes a garment-specific size chart with actual finished measurements alongside the standard body measurements. If a garment runs narrow or wide, this is noted in the size chart.",
      },
    ],
  },
  {
    id: "adaptive",
    label: "Adaptive Features",
    items: [
      {
        id: "adaptive-1",
        q: "How do the magnets work at the hospital?",
        a: "Tempo uses neodymium magnets embedded behind fabric panels. For most hospital and clinical environments, the magnets are not strong enough to interfere with standard medical equipment. However, Tempo magnetic closures are not MRI-safe. Do not wear Tempo garments with magnetic closures into an MRI suite. For MRI appointments, the Fit Concierge can suggest equivalent garments with hook-and-loop or snap closures.",
      },
      {
        id: "adaptive-2",
        q: "Are flat-felled seams durable?",
        a: "Flat-felled seams (where the seam allowance is folded and stitched flat on both sides) are among the most durable seam types available. They are standard on Tempo garments that contact skin directly. They resist fraying, tolerate repeated washing, and reduce pressure points for people who are sensitive to raised seams or who spend long periods in one position.",
      },
      {
        id: "adaptive-3",
        q: "Can this be worn without a caregiver?",
        a: "Every Tempo product page includes a dressing-independence score showing whether the garment can be put on and taken off independently with one hand, two hands, or whether caregiver assistance is typically needed. Garments rated for one-handed dressing have been tested with disabled advisors who use one hand. The Fit Concierge can filter by dressing independence level.",
      },
      {
        id: "adaptive-4",
        q: "What is a seated cut and how does it differ from regular trousers?",
        a: "A seated cut adds approximately 2 to 3 inches of back rise so that the waistband stays at the natural waist when seated rather than pulling down and exposing the lower back. The front of the garment is cut slightly shorter to prevent fabric bunching at the lap. Leg openings are shaped to fall straight over footrests rather than tapering in ways that create pressure points.",
      },
      {
        id: "adaptive-5",
        q: "How are magnetic closures different from snaps and buttons?",
        a: "Magnetic closures require no pinching, gripping, or precise finger alignment. Two panels are guided near each other and the magnets engage automatically. Snaps require pressing with force. Buttons require threading through a loop. For customers with reduced grip strength, fine motor differences, or tremors, magnetic closures can reduce dressing time by several minutes per garment.",
      },
      {
        id: "adaptive-6",
        q: "Are there any garments safe for MRI scans?",
        a: "Garments with hook-and-loop, snap, or no closures are MRI compatible. Garments with metal snaps or magnetic closures are not safe in the MRI room. Tempo product pages include an MRI safety tag for compatible garments. The MRI-safe collection uses all-fabric construction with no metal hardware.",
      },
      {
        id: "adaptive-7",
        q: "How do I care for magnetic closures?",
        a: "Wash magnetic closure garments on a gentle or delicates cycle, cold water. Fasten all magnetic closures before washing to prevent them snagging other items. Tumble dry on low or hang to dry. Avoid ironing directly over a magnetic closure. Do not dry-clean garments with magnetic closures, as solvents can degrade the fabric panel covering the magnet.",
      },
      {
        id: "adaptive-8",
        q: "What does open-back design mean for comfort?",
        a: "Open-back garments have a full or partial back opening that allows the garment to be put on from the front without lifting the arms overhead or bending the back. The opening is typically held closed by magnets or hook-and-loop at the shoulders or mid-back. For people who are bedbound or who have limited shoulder mobility, this design eliminates the most physically demanding part of dressing.",
      },
      {
        id: "adaptive-9",
        q: "Can I request a specific adaptive feature not currently offered?",
        a: "Yes. The co-design program invites customers and caregivers to submit feature requests. Submit a request through the Fit Concierge or by email with a description of the functional need. Advisor-tier members have direct access to the quarterly co-design board where feature requests are reviewed with the advisory panel.",
      },
    ],
  },
  {
    id: "sustainability",
    label: "Sustainability and Materials",
    items: [
      {
        id: "sust-1",
        q: "What does GOTS certify?",
        a: "The Global Organic Textile Standard (GOTS) certifies the entire supply chain from raw fiber to finished garment. It requires organic fiber content of at least 70 percent, prohibits most synthetic dyes and finishing chemicals, mandates fair labor standards at every processing stage, and requires third-party audits of every facility in the chain. Tempo garments marked GOTS-certified meet the 95 percent organic content threshold.",
      },
      {
        id: "sust-2",
        q: "Where is Tempo cotton grown?",
        a: "Tempo sources certified organic cotton from two primary regions: the Izmir region of Turkey, which has a long history of organic cotton farming supported by cooperatives, and select farms in Tamil Nadu, India, certified under GOTS. Both sources are verified through third-party supply chain audits. Farm origin is documented in each garment's Digital Product Passport.",
      },
      {
        id: "sust-3",
        q: "What is the carbon footprint of shipping my order?",
        a: "Standard US shipping generates approximately 0.3 to 0.7 kg CO2e per parcel depending on distance and carrier. Tempo offsets 200 percent of shipping emissions through verified carbon removal projects (direct air capture and enhanced weathering). The offset program is audited annually. The carbon footprint of the garment itself, including raw materials, manufacturing, and transport, is documented in each garment's Digital Product Passport.",
      },
      {
        id: "sust-4",
        q: "What is Tencel and why does Tempo use it?",
        a: "Tencel (branded lyocell) is a fiber made from sustainably sourced wood pulp using a closed-loop solvent process that recovers 99 percent of solvent for reuse. It is naturally soft, breathable, and moisture-wicking, which makes it suited to garments worn close to sensitive or reactive skin. Tempo uses Tencel blends in garments designed for people with skin conditions that are aggravated by synthetic fibers.",
      },
      {
        id: "sust-5",
        q: "Are Tempo dyes free of harmful chemicals?",
        a: "Tempo uses OEKO-TEX Standard 100 certified dyes, which means they have been tested for over 100 harmful substances including formaldehyde, heavy metals, pesticide residues, and aromatic amines. GOTS certification additionally prohibits many synthetic dye classes entirely. The Digital Product Passport for each garment lists the dye supplier and their certification.",
      },
      {
        id: "sust-6",
        q: "What does Bluesign certification mean?",
        a: "Bluesign certifies that the fabric was produced with minimal environmental impact. It covers water consumption, chemical discharge, energy use, and worker safety at the mill level. A Bluesign-certified mill reduces water consumption by up to 50 percent compared to conventional mills and eliminates hazardous chemical discharge. Tempo fabric suppliers for non-cotton garments hold Bluesign approval.",
      },
      {
        id: "sust-7",
        q: "How does Tempo handle end-of-life for garments?",
        a: "The Take-Back program accepts Tempo garments in any condition. Garments in good condition are repaired and resold. Garments beyond repair are sent to a certified textile recycling partner that mechanically processes the fiber into insulation and industrial fill. Garments with mixed fibers (cotton-Tencel blends) are processed by a chemical recycling pilot that separates fiber types. Progress is reported in the annual sustainability report.",
      },
      {
        id: "sust-8",
        q: "Is Tempo packaging recyclable?",
        a: "Yes. All Tempo packaging is either recycled paper or compostable bioplastic. The mailing envelope is made from 100 percent post-consumer recycled paper. Internal tissue is FSC-certified. Garment bags are certified compostable (TUV OK Compost HOME). No single-use plastic is used in the primary packaging. Returns packaging reuses the original mailer when possible.",
      },
      {
        id: "sust-9",
        q: "What percentage of Tempo materials are recycled or renewable?",
        a: "Across the full collection, approximately 78 percent of materials by weight are renewable (organic cotton, Tencel, linen) and 12 percent are recycled (post-consumer polyester used in structured adaptive hardware panels and interfacing). The remaining 10 percent is virgin synthetic used for hardware, elastic, and closures where no certified recycled alternative currently meets the durability requirement. Tempo is actively sourcing replacements.",
      },
    ],
  },
  {
    id: "dpp",
    label: "Digital Product Passport",
    items: [
      {
        id: "dpp-1",
        q: "What is a Digital Product Passport?",
        a: "A Digital Product Passport (DPP) is a structured digital record of everything that went into making a garment, including raw materials, certifications, supply chain facilities, carbon footprint, care and repair instructions, and end-of-life options. Tempo's DPPs comply with the EU Ecodesign for Sustainable Products Regulation (ESPR) framework. Each garment has a unique QR code that links to its passport.",
      },
      {
        id: "dpp-2",
        q: "Why should I scan the QR code?",
        a: "Scanning the QR code gives you access to the garment's full passport: exact material composition by percentage, the carbon footprint in grams CO2e per use, certification documents, the factory and mill names, care instructions translated for adaptive dressing scenarios, and Take-Back program options. You also earn 100 TempoPoints for the first scan of any new garment.",
      },
      {
        id: "dpp-3",
        q: "What happens to my data when I scan the QR code?",
        a: "The QR code links to a public URL that requires no login to view. Scanning generates a standard HTTP request to tempo.style. Tempo does not store IP addresses or device identifiers from passport scans. If you are logged in to your Tempo account when you scan, the scan is recorded in your account to award TempoPoints. No behavioral tracking or third-party analytics are used on passport pages.",
      },
      {
        id: "dpp-4",
        q: "What is the ESPR regulation?",
        a: "The EU Ecodesign for Sustainable Products Regulation (ESPR) requires that products sold in the EU carry digital records documenting sustainability, repairability, and recyclability. It entered into force in July 2024 and phased implementation begins with textiles in 2026. Tempo's DPPs are designed to meet the forthcoming textile sector requirements so that garments are already compliant before the mandate takes effect.",
      },
      {
        id: "dpp-5",
        q: "Can I share a passport with my healthcare provider or occupational therapist?",
        a: "Yes. Each passport page has a share button that copies the URL to your clipboard. The URL is permanently stable and publicly accessible without a login. You can also download a two-page PDF version of the passport from the passport page, which is formatted for printing or attaching to a medical record.",
      },
      {
        id: "dpp-6",
        q: "How is passport data updated after I purchase?",
        a: "Passport data reflects the specification of the garment at the time it was manufactured. If a supplier changes materials or a certification is updated, a new passport version is created and linked to new production runs. The QR code on your garment always points to the passport that matches your specific production batch. Passports are versioned and previous versions are archived.",
      },
      {
        id: "dpp-7",
        q: "Is passport data available offline?",
        a: "The PDF download is available offline once downloaded. The interactive passport web page requires an internet connection. For customers with limited connectivity, the PDF includes the full material table, certifications, carbon data, and care instructions in a printable format.",
      },
      {
        id: "dpp-8",
        q: "What does the carbon footprint figure in the passport include?",
        a: "The figure covers Scope 1 and Scope 2 emissions from raw material production, ginning or extraction, spinning, fabric production, dyeing and finishing, cut-and-sew, packaging, and outbound shipping to the Tempo fulfillment center. It does not include emissions from your use of the garment (washing, drying) or end-of-life. A methodology note explaining the calculation boundaries is available on the passport page.",
      },
      {
        id: "dpp-9",
        q: "Can I download my passport as a PDF?",
        a: "Yes. Every passport page has a Download PDF button that generates a two-page A4 PDF. Page 1 covers the garment identity, material composition table, supply chain facilities, and certifications. Page 2 covers carbon footprint, care instructions, sterilization compatibility, and end-of-life options. The PDF includes the garment's QR code for future reference.",
      },
    ],
  },
  {
    id: "shipping",
    label: "Shipping and Returns",
    items: [
      {
        id: "ship-1",
        q: "Do you ship to care facilities and residential care homes?",
        a: "Yes. Tempo ships to any address including care facilities, group homes, hospitals, and rehabilitation centers. Use the facility name as the first line of the address and add the resident name or room number on the second line. Agency account holders placing bulk orders can set a default facility shipping address in their account.",
      },
      {
        id: "ship-2",
        q: "Can a caregiver return a garment on behalf of a care recipient?",
        a: "Yes. Returns can be initiated by any account that placed the order. If a caregiver purchased on behalf of a care recipient through a Caregiver account, the caregiver initiates the return at /take-back using the order number and account email. The return window for Caregiver accounts is 90 days from delivery.",
      },
      {
        id: "ship-3",
        q: "How long does shipping take to Canada?",
        a: "Standard shipping to Canada takes 7 to 12 business days after the order is processed (1 to 2 business days). Express shipping takes 4 to 6 business days. Customs clearance can add 1 to 3 additional business days. Tempo marks all shipments at full declared value, which is required by Canadian customs. Import duties and GST or HST are the responsibility of the recipient.",
      },
      {
        id: "ship-4",
        q: "What is the Take-Back program?",
        a: "Take-Back is Tempo's garment return program that accepts items in any condition, at any time, for any reason. There is no return window for Take-Back. Instead of a cash refund, you receive 1,000 TempoPoints. Garments in good condition are repaired and resold. Garments beyond repair are mechanically or chemically recycled. Start a Take-Back at /take-back.",
      },
      {
        id: "ship-5",
        q: "Do you accept returns without an original receipt?",
        a: "Returns are linked to your order number, which is sent by email when you place your order. If you cannot locate your order number, contact us with the email address used for the purchase and approximate purchase date. For gifted items returned by the recipient, the gifter can share the order number or we can look it up by email.",
      },
      {
        id: "ship-6",
        q: "Is return shipping free?",
        a: "Advisor and Architect tier members receive free prepaid return labels for all standard returns. All other customers are responsible for return postage unless the item is damaged or defective. Take-Back shipping labels are available for 500 TempoPoints (redeemable from your rewards balance), or you can use your own postage.",
      },
      {
        id: "ship-7",
        q: "What if my parcel arrives damaged or with a manufacturing defect?",
        a: "Contact us within 30 days of delivery with your order number and a photo of the damage. Tempo will send a prepaid return label by email the same day your report is reviewed (typically within one business day). You choose between a full replacement or a full refund. Tempo covers all shipping costs for damaged or defective items.",
      },
      {
        id: "ship-8",
        q: "How do I track my return?",
        a: "When you initiate a return at /take-back, you receive a return authorization number and a carrier tracking link by email within one business day. Once the item arrives at our fulfillment center, refunds process within 5 to 10 business days. TempoPoints from Take-Back returns are credited within 24 hours of the item being received.",
      },
      {
        id: "ship-9",
        q: "Do you offer express or overnight shipping for medical urgency?",
        a: "Express shipping (2 to 3 business days for contiguous US) is available at checkout. Overnight shipping is available for contiguous US addresses. For medical urgency situations such as a hospital stay or post-surgery recovery, contact us directly. We will expedite the order and waive the express shipping surcharge where possible.",
      },
    ],
  },
  {
    id: "financial",
    label: "Financial Support",
    items: [
      {
        id: "fin-1",
        q: "Does my HSA cover Tempo garments?",
        a: "Tempo adaptive garments may qualify as an eligible HSA expense under IRS Publication 502 when prescribed or recommended by a licensed healthcare provider for a medical condition. A Letter of Medical Necessity (LMN) from your physician, OT, or PT strengthens reimbursement claims. You can use an HSA debit card at checkout or pay out of pocket and submit the Tempo order confirmation as a receipt.",
      },
      {
        id: "fin-2",
        q: "How do I verify Medicaid reimbursement eligibility?",
        a: "Tempo is piloting a Medicaid reimbursement pathway in select states for adaptive clothing classified under durable medical equipment or clothing allowance provisions. Eligibility depends on your state's Medicaid program and your specific condition. Contact us through the Fit Concierge with your state and diagnosis category. We will confirm whether your state is active in the pilot and provide supporting documentation.",
      },
      {
        id: "fin-3",
        q: "What is a Letter of Medical Necessity?",
        a: "A Letter of Medical Necessity (LMN) is a document from a licensed healthcare provider stating that the adaptive garment is needed to treat or manage a medical condition. It typically includes the patient's diagnosis, the functional limitation addressed by the garment, and the provider's signature. The Fit Concierge can generate a product description letter to support your LMN request.",
      },
      {
        id: "fin-4",
        q: "Can I use FSA funds at checkout?",
        a: "Yes. FSA debit cards are accepted at Tempo checkout in the same way as a standard debit card. For FSA accounts that require itemized receipts, the Tempo order confirmation email includes itemized product descriptions. If your FSA administrator requires a Merchant Category Code, Tempo processes as a clothing retailer (MCC 5621). Some FSA plans require an LMN for adaptive clothing reimbursement.",
      },
      {
        id: "fin-5",
        q: "Do you offer bulk pricing for care facilities and agencies?",
        a: "Caregiver agencies, residential care facilities, and home health organizations placing orders of 12 or more garments in a single transaction receive 15 percent off the listed price. Bulk orders also receive priority fulfillment and a dedicated account contact. Set up a bulk account via the Fit Concierge or by emailing us with your organization name and expected order volume.",
      },
      {
        id: "fin-6",
        q: "Is there a Veterans Affairs clothing allowance for Tempo garments?",
        a: "Tempo garments are eligible for reimbursement under the VA Clothing Allowance benefit for veterans whose skin condition or prosthetic, orthopedic, or assistive device damages or requires special clothing. The annual allowance is paid directly to the veteran. To apply, submit VA Form 10-8678 to your nearest VA medical center. Tempo can provide product documentation formatted for VA submissions, available through the Fit Concierge.",
      },
      {
        id: "fin-7",
        q: "Are there payment plans available?",
        a: "Tempo does not currently offer installment payment directly. However, buy-now-pay-later services (Klarna, Afterpay) are accepted at checkout. For agency bulk orders on Net 30 terms, contact us to set up an invoice billing arrangement. Net 30 billing is available to registered care organizations with a verified business address.",
      },
      {
        id: "fin-8",
        q: "How do I get documentation for insurance or reimbursement claims?",
        a: "The Fit Concierge can generate a product description document that includes the garment name, adaptive features, material composition, and the functional need addressed. This document is formatted for submission to insurance administrators, HSA/FSA plan administrators, and VA benefits offices. Ask the Fit Concierge for a 'reimbursement documentation' letter and specify the program you are submitting to.",
      },
      {
        id: "fin-9",
        q: "Can TempoPoints reduce the cost of a purchase?",
        a: "Yes. TempoPoints can be redeemed for rewards including a $25 discount on your next order (2,000 points), early access to product drops (5,000 points), and a named donation to the Disability Rights Education Fund (3,000 points). Points do not convert to cash directly, but the $25 discount reward effectively reduces purchase cost. View all redemptions at /rewards.",
      },
    ],
  },
];
